"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Play, Video, Shield, Zap, ArrowRight, Sparkles } from "lucide-react"

function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const spacing = 30
      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1
      const cx = w / 2
      const cy = h / 2

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing
          const y = j * spacing

          const dx = x - cx
          const dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = Math.sqrt(cx * cx + cy * cy)
          const norm = dist / maxDist

          const angle = Math.atan2(dy, dx)
          const wave = Math.sin(dist * 0.02 - time * 2) * 0.5 + 0.5
          const spiral = Math.sin(angle * 3 + dist * 0.01 - time * 1.5) * 0.5 + 0.5

          const size = 1 + wave * 2 + spiral * 1.5
          const alpha = (1 - norm * 0.7) * (0.2 + wave * 0.4 + spiral * 0.2)

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(var(--p), ${alpha})`
          ctx.fill()
        }
      }

      time += 0.016
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

const features = [
  {
    icon: Video,
    title: "Upload & Manage",
    description: "Drag and drop your videos. Organize with tags and folders.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "Google OAuth + credentials. Your content stays private.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: Zap,
    title: "CDN Delivery",
    description: "Lightning-fast streaming powered by ImageKit CDN.",
    gradient: "from-amber-500 to-orange-400",
  },
]

export default function HomePage() {
  const router = useRouter()
  const { status } = useSession()

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <DotField />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/0 via-base-100/20 to-base-100 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 space-y-8 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-pulse">
            <Sparkles className="h-4 w-4" />
            Modern Media Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="text-base-content">Stream Your</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Content
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-base-content/60 max-w-xl mx-auto leading-relaxed">
            Upload, manage, and stream your video library with a beautiful
            dashboard. Built for creators who demand quality.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            {status === "authenticated" ? (
              <button
                className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  onClick={() => router.push("/register")}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  className="btn btn-outline btn-lg gap-2"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content">
              Everything you need
            </h2>
            <p className="text-base-content/60 max-w-lg mx-auto">
              A complete platform for video content creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-200/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative space-y-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">
            Ready to get started?
          </h2>
          <p className="text-base-content/60">
            Join StreamVault today and take control of your media content.
          </p>
          <button
            className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25"
            onClick={() =>
              router.push(status === "authenticated" ? "/dashboard" : "/register")
            }
          >
            <Play className="h-5 w-5" />
            {status === "authenticated" ? "Open Dashboard" : "Create Account"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 py-8 px-6 text-center text-base-content/40 text-sm">
        © 2026 StreamVault. Built with Next.js + DaisyUI.
      </footer>
    </div>
  )
}
