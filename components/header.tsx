"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut, User, Palette, UserPlus, LogIn } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme, THEMES } from "@/components/theme-provider"
import { useState, useRef, useEffect } from "react"
import { GradientText } from "@/components/ui/gradient-text"

export function Header() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [themeOpen, setThemeOpen] = useState(false)
    const themeRef = useRef<HTMLDivElement>(null)

    // Close theme dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
                setThemeOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-base-300 bg-base-100/80 backdrop-blur-lg px-4 md:px-6">
            {/* Left: Hamburger */}
            <SidebarTrigger className="btn btn-ghost btn-sm btn-square" />

            {/* Brand */}
            <a
                href="/"
                className="hidden sm:flex items-center gap-2 text-lg font-bold text-base-content hover:text-primary transition-colors"
            >
                <GradientText text="StreamVault" className="text-xl" />
            </a>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side controls */}
            <div className="flex items-center gap-2">
                {/* Theme Dropdown */}
                <div className="relative" ref={themeRef}>
                    <button
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={() => setThemeOpen(!themeOpen)}
                        title="Change theme"
                    >
                        <Palette className="h-5 w-5" />
                    </button>
                    {themeOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 max-h-80 overflow-y-auto rounded-xl border border-base-300 bg-base-200 shadow-xl z-50">
                            <div className="p-2 text-xs font-semibold uppercase tracking-wider text-base-content/50 px-3">
                                Theme
                            </div>
                            {THEMES.map((t) => (
                                <button
                                    key={t}
                                    className={`flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-base-300 transition-colors ${theme === t
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-base-content"
                                        }`}
                                    onClick={() => {
                                        setTheme(t)
                                        setThemeOpen(false)
                                    }}
                                >
                                    {/* Theme color preview dots */}
                                    <div className="flex gap-0.5" data-theme={t}>
                                        <span className="h-3 w-3 rounded-full bg-primary" />
                                        <span className="h-3 w-3 rounded-full bg-secondary" />
                                        <span className="h-3 w-3 rounded-full bg-accent" />
                                    </div>
                                    <span className="capitalize">{t}</span>
                                    {theme === t && <span className="ml-auto text-primary">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {status === "authenticated" && session?.user ? (
                    <>
                        {/* Profile */}
                        <button
                            className="btn btn-ghost btn-sm btn-circle"
                            onClick={() => router.push("/profile")}
                            title="Profile"
                        >
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="h-7 w-7 rounded-full"
                                />
                            ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-content text-xs font-bold">
                                    {(session.user.name || session.user.email || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}
                        </button>

                        {/* Sign Out */}
                        <button
                            className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden md:inline">Sign Out</span>
                        </button>
                    </>
                ) : status === "unauthenticated" ? (
                    <>
                        <button
                            className="btn btn-ghost btn-sm gap-2"
                            onClick={() => router.push("/login")}
                        >
                            <LogIn className="h-4 w-4" />
                            <span className="hidden sm:inline">Login</span>
                        </button>
                        <button
                            className="btn btn-primary btn-sm gap-2"
                            onClick={() => router.push("/register")}
                        >
                            <UserPlus className="h-4 w-4" />
                            <span className="hidden sm:inline">Register</span>
                        </button>
                    </>
                ) : null}
            </div>
        </header>
    )
}
