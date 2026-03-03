"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Hls, { Level } from "hls.js"

const IMAGEKIT_URL_ENDPOINT =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dp0809"

const HLS_RESOLUTIONS = "sr-240_360_480_720_1080"

function buildHlsUrl(videoUrl: string): string {
    if (videoUrl.includes("ik-master.m3u8")) return videoUrl
    let base = videoUrl
    if (!base.startsWith("http")) {
        base = `${IMAGEKIT_URL_ENDPOINT}${base.startsWith("/") ? "" : "/"}${base}`
    }
    return `${base}/ik-master.m3u8?tr=${HLS_RESOLUTIONS}`
}

function formatTime(s: number) {
    if (isNaN(s)) return "0:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
}

interface QualityLevel { index: number; label: string; height: number }

interface HLSVideoPlayerProps {
    src: string
    poster?: string
    className?: string
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    /** When false, shows only a bare <video> with no controls (for card thumbnails) */
    controls?: boolean
}

export default function HLSVideoPlayer({
    src,
    poster,
    className = "",
    autoPlay = false,
    muted: initMuted = false,
    loop = false,
    controls = true,
}: HLSVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const hlsRef = useRef<Hls | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [levels, setLevels] = useState<QualityLevel[]>([])
    const [selectedLevel, setSelectedLevel] = useState(-1)
    const [currentHeight, setCurrentHeight] = useState<number | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [isHlsMode, setIsHlsMode] = useState(false)

    // Playback state
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(initMuted)
    const [volume, setVolume] = useState(1)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [controlsVisible, setControlsVisible] = useState(true)
    const [fullscreen, setFullscreen] = useState(false)

    // ── Auto-hide controls ────────────────────────────────────────────
    const showControls = useCallback(() => {
        setControlsVisible(true)
        if (hideTimer.current) clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => {
            if (!menuOpen) setControlsVisible(false)
        }, 3000)
    }, [menuOpen])

    useEffect(() => { showControls() }, [showControls])

    // Keep controls visible while menu is open
    useEffect(() => {
        if (menuOpen) {
            setControlsVisible(true)
            if (hideTimer.current) clearTimeout(hideTimer.current)
        }
    }, [menuOpen])

    // Close menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    // ── HLS setup ────────────────────────────────────────────────────
    useEffect(() => {
        const video = videoRef.current
        if (!video || !src) return

        setError(null); setLoading(true); setLevels([])
        setSelectedLevel(-1); setCurrentHeight(null); setIsHlsMode(false)

        const hlsUrl = buildHlsUrl(src)

        if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, autoStartLoad: true })
            hlsRef.current = hls
            setIsHlsMode(true)

            hls.loadSource(hlsUrl)
            hls.attachMedia(video)

            hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
                setLoading(false)
                if (autoPlay) video.play().catch(() => { })
                const sorted: QualityLevel[] = [...data.levels]
                    .map((l: Level, i: number) => ({ index: i, label: `${l.height}p`, height: l.height }))
                    .sort((a, b) => b.height - a.height)
                setLevels([{ index: -1, label: "Auto", height: -1 }, ...sorted])
            })

            hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
                const lvl = hls.levels[data.level]
                if (lvl) setCurrentHeight(lvl.height)
            })

            hls.on(Hls.Events.ERROR, (_e, data) => {
                if (data.fatal) {
                    setLoading(false)
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
                    else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
                    else { setError("Playback error. The video may still be processing."); hls.destroy() }
                }
            })

            return () => { hls.destroy(); hlsRef.current = null }
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = hlsUrl
            video.addEventListener("loadedmetadata", () => setLoading(false))
            return () => { video.src = "" }
        }

        video.src = src
        video.addEventListener("loadedmetadata", () => setLoading(false))
        return () => { video.src = "" }
    }, [src, autoPlay])

    // ── Video event handlers ──────────────────────────────────────────
    const onTimeUpdate = () => {
        const v = videoRef.current
        if (v) setCurrentTime(v.currentTime)
    }
    const onDurationChange = () => {
        const v = videoRef.current
        if (v) setDuration(v.duration)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onVolumeChange = () => {
        const v = videoRef.current
        if (v) { setMuted(v.muted); setVolume(v.volume) }
    }

    // ── Control actions ───────────────────────────────────────────────
    const togglePlay = () => {
        const v = videoRef.current
        if (!v) return
        playing ? v.pause() : v.play().catch(() => { })
        showControls()
    }

    const toggleMute = () => {
        const v = videoRef.current
        if (!v) return
        v.muted = !v.muted
    }

    const onVolumeSlider = (val: number) => {
        const v = videoRef.current
        if (!v) return
        v.volume = val
        v.muted = val === 0
    }

    const onSeek = (val: number) => {
        const v = videoRef.current
        if (v) v.currentTime = val
    }

    const toggleFullscreen = () => {
        const el = containerRef.current
        if (!el) return
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(() => { })
        } else {
            document.exitFullscreen()
        }
    }

    useEffect(() => {
        const handler = () => setFullscreen(!!document.fullscreenElement)
        document.addEventListener("fullscreenchange", handler)
        return () => document.removeEventListener("fullscreenchange", handler)
    }, [])

    const changeQuality = useCallback((idx: number) => {
        const hls = hlsRef.current
        if (hls) hls.currentLevel = idx
        setSelectedLevel(idx)
        setMenuOpen(false)
    }, [])

    const activeLabel = selectedLevel === -1
        ? (currentHeight ? `Auto (${currentHeight}p)` : "Auto")
        : (levels.find(l => l.index === selectedLevel)?.label ?? "Auto")

    // If controls=false (thumbnail cards), just render bare video
    if (!controls) {
        return (
            <div className={`relative bg-black ${className}`}>
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-300/80">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                )}
                <video
                    ref={videoRef}
                    poster={poster}
                    muted
                    loop={loop}
                    playsInline
                    className="h-full w-full object-cover"
                    onLoadedMetadata={() => setLoading(false)}
                />
            </div>
        )
    }

    const progress = duration ? (currentTime / duration) * 100 : 0

    return (
        <div
            ref={containerRef}
            className={`group relative bg-black select-none ${className}`}
            onMouseMove={showControls}
            onMouseLeave={() => { if (!menuOpen && playing) setControlsVisible(false) }}
            onClick={togglePlay}
        >
            {/* Loading */}
            {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-base-300/80">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/90 p-4 text-center">
                    <svg className="h-10 w-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-white/70">{error}</p>
                </div>
            )}

            {/* Big play/pause on click */}
            {!loading && !error && (
                <div className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200
          ${controlsVisible ? "opacity-100" : "opacity-0"}`}>
                    {!playing && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <svg className="h-8 w-8 text-white ml-1" fill="white" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    )}
                </div>
            )}

            {/* Video element — native controls OFF */}
            <video
                ref={videoRef}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                playsInline
                className="h-full w-full"
                onTimeUpdate={onTimeUpdate}
                onDurationChange={onDurationChange}
                onPlay={onPlay}
                onPause={onPause}
                onVolumeChange={onVolumeChange}
                onLoadedMetadata={() => setLoading(false)}
            />

            {/* ── Custom controls bar ── */}
            {!loading && !error && (
                <div
                    className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300
            ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Gradient backdrop */}
                    <div className="h-20 bg-gradient-to-t from-black/80 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 space-y-1">
                        {/* Seek bar */}
                        <input
                            type="range" min={0} max={duration || 100} step={0.1} value={currentTime}
                            onChange={(e) => onSeek(Number(e.target.value))}
                            className="w-full h-1 accent-primary cursor-pointer rounded-full"
                        />

                        {/* Controls row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* Play/Pause */}
                                <button onClick={togglePlay} className="text-white hover:text-primary transition-colors p-1">
                                    {playing ? (
                                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    )}
                                </button>

                                {/* Volume */}
                                <button onClick={toggleMute} className="text-white hover:text-primary transition-colors p-1">
                                    {muted || volume === 0 ? (
                                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                                            <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                        </svg>
                                    )}
                                </button>

                                {/* Volume slider */}
                                <input
                                    type="range" min={0} max={1} step={0.05}
                                    value={muted ? 0 : volume}
                                    onChange={(e) => onVolumeSlider(Number(e.target.value))}
                                    className="w-16 h-1 accent-primary cursor-pointer rounded-full"
                                />

                                {/* Time */}
                                <span className="text-xs text-white/80 font-mono tabular-nums">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                {/* ⋮ Three-dot menu (quality) */}
                                {isHlsMode && levels.length > 1 && (
                                    <div ref={menuRef} className="relative">
                                        {/* Quality panel */}
                                        {menuOpen && (
                                            <div className="absolute bottom-10 right-0 w-44 overflow-hidden rounded-xl border border-white/15 bg-black/95 shadow-2xl backdrop-blur-md">
                                                <div className="border-b border-white/10 px-3 py-2">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Quality</p>
                                                </div>
                                                {levels.map((lvl) => {
                                                    const isActive = selectedLevel === lvl.index
                                                    return (
                                                        <button
                                                            key={lvl.index}
                                                            onClick={() => changeQuality(lvl.index)}
                                                            className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors
                                ${isActive ? "bg-primary/70 text-white font-semibold" : "text-white/80 hover:bg-white/10"}`}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <svg className={`h-3.5 w-3.5 shrink-0 ${isActive ? "opacity-100" : "opacity-0"}`}
                                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                {lvl.label}
                                                            </span>
                                                            {lvl.index === -1 && currentHeight && (
                                                                <span className="text-[11px] text-white/40">{currentHeight}p</span>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* ⋮ Button */}
                                        <button
                                            onClick={() => setMenuOpen(o => !o)}
                                            title="Settings"
                                            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors
                        ${menuOpen ? "bg-white/25 text-white" : "text-white/80 hover:bg-white/15"}`}
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* Fullscreen */}
                                <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors p-1">
                                    {fullscreen ? (
                                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
