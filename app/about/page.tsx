"use client"

import { Play, Video, Shield, Zap, Globe, Code2 } from "lucide-react"

const features = [
    {
        icon: Video,
        title: "Video Management",
        description: "Upload, organize, and manage your video content with ease.",
    },
    {
        icon: Shield,
        title: "Secure Authentication",
        description:
            "Sign in with credentials or Google. Your data is always protected.",
    },
    {
        icon: Zap,
        title: "Fast Streaming",
        description:
            "Optimized video delivery powered by ImageKit CDN for blazing speeds.",
    },
    {
        icon: Globe,
        title: "Responsive Design",
        description: "Beautiful on every device — desktop, tablet, and mobile.",
    },
]

const techStack = [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "MongoDB + Mongoose",
    "NextAuth.js",
    "DaisyUI + Tailwind CSS",
    "ImageKit",
    "Lucide Icons",
]

export default function AboutPage() {
    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                        <Play className="h-8 w-8 text-primary-content" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-base-content">
                    About <span className="text-primary">StreamVault</span>
                </h1>
                <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
                    StreamVault is a modern media streaming platform built for creators who
                    want full control over their video content. Upload, manage, and stream
                    — all from one beautiful dashboard.
                </p>
            </div>

            {/* Features */}
            <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 text-center">
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="card bg-base-200 border border-base-300 hover:border-primary transition-all hover:shadow-lg group"
                        >
                            <div className="card-body p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-base-content">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-base-content/60">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 text-center">
                    Tech Stack
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {techStack.map((tech) => (
                        <div
                            key={tech}
                            className="badge badge-lg badge-outline gap-2 py-3 px-4 hover:badge-primary transition-colors cursor-default"
                        >
                            <Code2 className="h-3.5 w-3.5" />
                            {tech}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-base-content/40 text-sm pb-8">
                Built with ❤️ using Next.js and DaisyUI
            </div>
        </div>
    )
}
