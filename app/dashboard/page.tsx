"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { IVideo } from "@/models/video"
import HLSVideoPlayer from "@/components/hls-video-player"
import { User, Mail, UserCheck, Video as VideoIcon, Activity, HardDrive, Play } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState<IVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    if (status === "authenticated" && (session?.user as any)?.hasPassword === false) {
      router.push("/profile")
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos")
        if (response.ok) {
          const data = await response.json()
          setVideos(data)
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchVideos()
    }
  }, [status])

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (status !== "authenticated") return null

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-base-content">
          Welcome back, {session?.user?.name || (session?.user as any)?.user_name || "User"}! 👋
        </h1>
        <p className="text-base-content/60 mt-1">
          Here&apos;s an overview of your account and activity
        </p>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
          <div className="card-body flex-row items-start gap-3 p-5">
            <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-base-content/60">Email Address</p>
              <p className="font-medium text-base-content break-all">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
          <div className="card-body flex-row items-start gap-3 p-5">
            <User className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-base-content/60">Username</p>
              <p className="font-medium text-base-content">
                {(session?.user as any)?.user_name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
          <div className="card-body flex-row items-start gap-3 p-5">
            <UserCheck className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-base-content/60">Account Status</p>
              <p className="font-medium text-base-content">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 text-base-content/60 text-sm">
              <VideoIcon className="h-4 w-4" /> Total Videos
            </div>
            <p className="text-3xl font-bold text-base-content">{videos.length}</p>
          </div>
        </div>
        <div className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 text-base-content/60 text-sm">
              <Activity className="h-4 w-4" /> Active Sessions
            </div>
            <p className="text-3xl font-bold text-primary">1</p>
          </div>
        </div>
        <div className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 text-base-content/60 text-sm">
              <HardDrive className="h-4 w-4" /> Storage Used
            </div>
            <p className="text-3xl font-bold text-base-content">0 MB</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-base-content">Your Content</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div
                key={String(v._id)}
                className="card bg-base-200 border border-base-300 overflow-hidden hover:border-primary transition-all hover:shadow-lg group cursor-pointer"
                onClick={() => router.push(`/video/${v._id}`)}
              >
                {/* Thumbnail with HLS preview on hover */}
                <figure className="relative bg-black aspect-video overflow-hidden">
                  <HLSVideoPlayer
                    src={v.video_url}
                    poster={v.thumbnail_url || undefined}
                    controls={false}
                    muted
                    className="aspect-video w-full"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 shadow-lg">
                      <Play className="h-6 w-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </figure>

                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title text-base text-base-content truncate flex-1">
                      {v.title || "Untitled Video"}
                    </h3>
                    <span className="badge badge-primary badge-xs shrink-0 mt-1">HLS</span>
                  </div>
                  <p className="text-sm text-base-content/60 line-clamp-2">
                    {v.description || "No description"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body items-center text-center p-8">
              <VideoIcon className="h-12 w-12 text-base-content/20 mb-2" />
              <p className="text-base-content/60">No content available yet</p>
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => router.push("/upload")}
              >
                Upload your first video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
