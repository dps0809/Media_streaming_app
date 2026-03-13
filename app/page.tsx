"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Play, Video, Shield, Zap, ArrowRight, Sparkles } from "lucide-react"
import { BlurText } from "@/components/ui/blur-text"
import { ShinyText } from "@/components/ui/shiny-text"
import { Particles } from "@/components/ui/particles"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { TiltCard } from "@/components/ui/tilt-card"

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
        <Particles quantity={150} staticity={30} color="#6366f1" className="opacity-40" />

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
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight flex flex-col items-center justify-center gap-2">
            <BlurText text="Stream Your" className="text-base-content" delay={100} />
            <BlurText
              text="Content"
              className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              delay={200}
            />
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-base-content/60 max-w-xl mx-auto leading-relaxed">
            <ShinyText
              text="Upload, manage, and stream your video library with a beautiful dashboard. Built for creators who demand quality."
              speed={4}
            />
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            {status === "authenticated" ? (
              <MagneticButton
                className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </MagneticButton>
            ) : (
              <>
                <MagneticButton
                  className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center"
                  onClick={() => router.push("/register")}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </MagneticButton>
                <MagneticButton
                  className="btn btn-outline btn-lg gap-2 flex items-center justify-center"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </MagneticButton>
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
              <TiltCard
                key={feature.title}
                className="group relative h-full overflow-hidden rounded-2xl border border-base-300 bg-base-200/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
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
              </TiltCard>
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
