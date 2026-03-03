"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { IVideo } from "@/models/video"
import HLSVideoPlayer from "@/components/hls-video-player"
import { ArrowLeft, Calendar, Film } from "lucide-react"

export default function VideoPlayerPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { status } = useSession()

    const [videoData, setVideoData] = useState<IVideo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    useEffect(() => {
        if (!id) return
        const fetchVideo = async () => {
            try {
                const res = await fetch(`/api/videos/${id}`)
                if (!res.ok) throw new Error("Video not found")
                const data = await res.json()
                setVideoData(data)
            } catch (err: any) {
                setError(err.message || "Failed to load video")
            } finally {
                setLoading(false)
            }
        }
        if (status === "authenticated") fetchVideo()
    }, [id, status])

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        )
    }

    if (error || !videoData) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <Film className="h-16 w-16 text-base-content/30" />
                <p className="text-base-content/60">{error || "Video not found"}</p>
                <button className="btn btn-primary" onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
        )
    }

    const thumbnailUrl = videoData.thumbnail_url || undefined

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            {/* HLS Video Player */}
            <div className="overflow-hidden rounded-2xl border border-base-300 bg-black shadow-2xl">
                <HLSVideoPlayer
                    src={videoData.video_url}
                    poster={thumbnailUrl}
                    controls
                    className="aspect-video w-full"
                />
            </div>

            {/* Video Info */}
            <div className="space-y-3">
                <h1 className="text-2xl font-bold text-base-content md:text-3xl">
                    {videoData.title || "Untitled Video"}
                </h1>

                {videoData.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-base-content/50">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(videoData.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                )}

                {videoData.description && (
                    <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-base-content/70 leading-relaxed">
                        {videoData.description}
                    </p>
                )}
            </div>

            {/* Technical Info Badge */}
            <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary badge-outline gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    HLS Adaptive Streaming
                </span>
                <span className="badge badge-ghost gap-1">
                    240p · 360p · 480p · 720p · 1080p
                </span>
            </div>
        </div>
    )
}
