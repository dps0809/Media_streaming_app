"use client"
import {
    ImageKitAbortError,
    UploadResponse,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUpload {
    onSuccess: (response: UploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image/jpeg" | "image/png" | "video/mp4";
}

interface FileUploadComponentProps {
    authenticator: () => Promise<{
        signature: string;
        expire: number;
        token: string;
        publicKey: string;
    }>;
}

export const FileUploadComponent = ({ authenticator }: FileUploadComponentProps) => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    const onError = (res: { messages: string }) => {
        console.error("Upload error:", res.messages);
        setError(res.messages);
        setUploading(false);
    };

    const handleSuccess = (res: UploadResponse) => {
        console.log("Upload successful:", res);
        setUploading(false);
        setError(null);
        
    };

    const handlestartupload = (evt: ProgressEvent) => {
        console.log("Upload started:", evt);
        setUploading(true);
        setError(null);
    };

    const handleProgress = (event: ProgressEvent) => {
        setProgress((event.loaded / event.total) * 100);
        console.log("Upload progress:", progress);
    };

    const ValidateFile = (file: File): boolean => {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const isImage = validImageTypes.includes(file.type);
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
            setError("Invalid file type. Please select an image or video file.");
            return false;
        }

        // File size limits
        if (isVideo && file.size > 100 * 1024 * 1024) {
            setError("Video file size exceeds the 100MB limit.");
            return false;
        }
        if (isImage && file.size > 5 * 1024 * 1024) {
            setError("Image file size exceeds the 5MB limit.");
            return false;
        }

        return true;
    };

    const getUploadFolder = (file: File): string => {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const isImage = validImageTypes.includes(file.type);
        
        return isImage ? "/images" : "/videos";
    };

    async function handleUpload({
        onSuccess,
        onProgress,
    }: Omit<FileUpload, 'fileType'>) {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            setError("Please select a file to upload");
            return;
        }

        const file = fileInput.files[0];

        // Validate file
        if (!ValidateFile(file)) {
            return;
        }

        handlestartupload(new ProgressEvent("start"));

        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            onError({ messages: "Authentication failed" });
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        const uploadFolder = getUploadFolder(file);

        try {
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                folder: uploadFolder,
                onProgress: (event) => {
                    handleProgress(event);
                },
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);
            handleSuccess(uploadResponse);
            onSuccess(uploadResponse);
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                onError({ messages: `Upload aborted: ${error.reason}` });
            } else if (error instanceof ImageKitInvalidRequestError) {
                onError({ messages: `Invalid request: ${error.message}` });
            } else if (error instanceof ImageKitUploadNetworkError) {
                onError({ messages: `Network error: ${error.message}` });
            } else if (error instanceof ImageKitServerError) {
                onError({ messages: `Server error: ${error.message}` });
            } else {
                onError({ messages: `Upload error: ${error}` });
            }
        }
    }

    return (
        <>
            <input 
                type="file" 
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo"
            />
            <button
                type="button"
                onClick={() => handleUpload({ onSuccess: () => {} })}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Photo/Video"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <br />
            Upload progress: <progress value={progress} max={100}></progress>
        </>
    );
};
