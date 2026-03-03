"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next"
import type { UploadResponse } from "@imagekit/next"
import { Upload, CheckCircle, AlertCircle, Film } from "lucide-react"

export default function UploadPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    const authenticator = async () => {
        const res = await fetch("/api/imagekit_auth")
        if (!res.ok) throw new Error("Auth failed")
        return res.json()
    }

    const validateFile = (file: File): boolean => {
        if (!file.type.startsWith("video/")) {
            setError("Please select a video file (MP4, WebM, MOV, etc.)")
            return false
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("Video file size exceeds the 100MB limit.")
            return false
        }
        return true
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedFile(file)
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!title.trim()) {
            setError("Please enter a title for the video.")
            return
        }
        if (!description.trim()) {
            setError("Please enter a description for the video.")
            return
        }
        if (!selectedFile) {
            setError("Please select a video file to upload.")
            return
        }
        if (!validateFile(selectedFile)) return

        setUploading(true)
        setProgress(0)

        // Step 1: Authenticate with ImageKit
        let authParams
        try {
            authParams = await authenticator()
        } catch {
            setError("Failed to authenticate for upload. Please try again.")
            setUploading(false)
            return
        }

        const { signature, expire, token, publicKey } = authParams
        abortControllerRef.current = new AbortController()

        // Step 2: Upload to ImageKit
        let uploadResponse: UploadResponse
        try {
            uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file: selectedFile,
                fileName: selectedFile.name,
                folder: "/videos",
                onProgress: (event) => {
                    setProgress(Math.round((event.loaded / event.total) * 100))
                },
                abortSignal: abortControllerRef.current.signal,
            })
        } catch (err) {
            if (err instanceof ImageKitAbortError) {
                setError("Upload was cancelled.")
            } else if (err instanceof ImageKitInvalidRequestError) {
                setError(`Invalid request: ${err.message}`)
            } else if (err instanceof ImageKitUploadNetworkError) {
                setError(`Network error: ${err.message}`)
            } else if (err instanceof ImageKitServerError) {
                setError(`Server error: ${err.message}`)
            } else {
                setError(`Upload failed: ${err}`)
            }
            setUploading(false)
            return
        }

        // Step 3: Save video metadata to database
        try {
            const videoData = {
                title: title.trim(),
                description: description.trim(),
                video_url: uploadResponse.url,
                thumbnail_url: uploadResponse.thumbnailUrl || uploadResponse.url,
            }

            const res = await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(videoData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || "Failed to save video")
            }

            setSuccess(true)
            setProgress(100)

            // Redirect to dashboard after 2 seconds
            setTimeout(() => router.push("/dashboard"), 2000)
        } catch (err: any) {
            setError(err.message || "Failed to save video metadata.")
            setUploading(false)
        }
    }

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        setUploading(false)
        setProgress(0)
    }

    if (status === "loading") {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        )
    }

    if (status !== "authenticated") return null

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Upload className="h-5 w-5 text-primary" />
                    </div>
                    Upload Video
                </h1>
                <p className="text-base-content/60 mt-2">
                    Upload your video to StreamVault. It will be stored on ImageKit CDN for blazing-fast delivery.
                </p>
            </div>

            {/* Success State */}
            {success ? (
                <div className="card bg-success/10 border border-success/30">
                    <div className="card-body items-center text-center p-8">
                        <CheckCircle className="h-16 w-16 text-success mb-4" />
                        <h2 className="text-xl font-bold text-base-content">Upload Successful!</h2>
                        <p className="text-base-content/60">
                            Your video has been uploaded and saved. Redirecting to dashboard...
                        </p>
                        <progress className="progress progress-success w-full max-w-xs mt-4" value={100} max={100} />
                    </div>
                </div>
            ) : (
                /* Upload Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content">Video Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter a descriptive title..."
                            className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={uploading}
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content">Description</span>
                        </label>
                        <textarea
                            placeholder="Describe your video..."
                            className="textarea textarea-bordered w-full bg-base-200 border-base-300 focus:border-primary h-28 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={uploading}
                            maxLength={500}
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content/40">
                                {description.length}/500 characters
                            </span>
                        </label>
                    </div>

                    {/* File Picker */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content">Video File</span>
                            <span className="label-text-alt text-base-content/40">Max 100MB</span>
                        </label>

                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${selectedFile
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-base-300 bg-base-200 hover:border-primary/30 hover:bg-base-200/80"
                                }
                ${uploading ? "pointer-events-none opacity-60" : ""}
              `}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />

                            {selectedFile ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Film className="h-10 w-10 text-primary" />
                                    <div>
                                        <p className="font-medium text-base-content">{selectedFile.name}</p>
                                        <p className="text-sm text-base-content/50">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                    {!uploading && (
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs text-base-content/60"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedFile(null)
                                                if (fileInputRef.current) fileInputRef.current.value = ""
                                            }}
                                        >
                                            Change file
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload className="h-10 w-10 text-base-content/30" />
                                    <div>
                                        <p className="font-medium text-base-content">Click to select a video</p>
                                        <p className="text-sm text-base-content/50">
                                            MP4, WebM, MOV, or AVI
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-base-content/60">Uploading...</span>
                                <span className="font-medium text-primary">{progress}%</span>
                            </div>
                            <progress
                                className="progress progress-primary w-full"
                                value={progress}
                                max={100}
                            />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-error">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        {uploading ? (
                            <button
                                type="button"
                                className="btn btn-error btn-outline flex-1"
                                onClick={handleCancel}
                            >
                                Cancel Upload
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1 gap-2"
                                    disabled={!title.trim() || !description.trim() || !selectedFile}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Video
                                </button>
                            </>
                        )}
                    </div>
                </form>
            )}
        </div>
    )
}
