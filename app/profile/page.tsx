"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    User,
    Mail,
    Shield,
    Key,
    CheckCircle,
    AlertTriangle,
} from "lucide-react"

export default function ProfilePage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")
    const [passwordLoading, setPasswordLoading] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordLoading(true)
        setPasswordError("")
        setPasswordSuccess("")

        if (!password || !confirmPassword) {
            setPasswordError("Please fill in both fields")
            setPasswordLoading(false)
            return
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters")
            setPasswordLoading(false)
            return
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match")
            setPasswordLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/set-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPassword }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                setPasswordError(data.message || "Failed to set password")
                setPasswordLoading(false)
                return
            }

            await update()
            setPasswordSuccess("Password set successfully!")
            setPassword("")
            setConfirmPassword("")
            setPasswordLoading(false)
        } catch {
            setPasswordError("An unexpected error occurred")
            setPasswordLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        )
    }

    if (status !== "authenticated" || !session?.user) return null

    const user = session.user as any
    const hasPassword = user.hasPassword !== false

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-base-content">Profile</h1>

            {/* Profile Info Card */}
            <div className="card bg-base-200 border border-base-300">
                <div className="card-body gap-6">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt="Profile"
                                className="h-16 w-16 rounded-full ring-2 ring-primary"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content text-2xl font-bold ring-2 ring-primary/30">
                                {(user.name || user.email || "U").charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-base-content">
                                {user.name || user.user_name || "User"}
                            </h2>
                            <p className="text-base-content/60 text-sm">{user.email}</p>
                        </div>
                    </div>

                    <div className="divider my-0" />

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-base-content/50">Email</p>
                                <p className="text-sm font-medium text-base-content break-all">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-base-content/50">Username</p>
                                <p className="text-sm font-medium text-base-content">
                                    {user.user_name || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-base-content/50">Provider</p>
                                <p className="text-sm font-medium text-base-content capitalize">
                                    {user.provider || "credentials"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-base-content/50">Password</p>
                                <p className="text-sm font-medium text-base-content">
                                    {hasPassword ? (
                                        <span className="text-success flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4" /> Set
                                        </span>
                                    ) : (
                                        <span className="text-warning flex items-center gap-1">
                                            <AlertTriangle className="h-4 w-4" /> Not set
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Set Password Section — only for Google users without a password */}
            {!hasPassword && (
                <div className="card bg-base-200 border border-warning/30">
                    <div className="card-body">
                        <h2 className="card-title text-base-content flex items-center gap-2">
                            <Key className="h-5 w-5 text-warning" />
                            Set Your Password
                        </h2>
                        <p className="text-sm text-base-content/60 mb-4">
                            You signed in with Google. Set a password to also log in with your
                            email and password.
                        </p>

                        <form onSubmit={handleSetPassword} className="space-y-4 max-w-md">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="At least 6 characters"
                                    className="input input-bordered w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={passwordLoading}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    className="input input-bordered w-full"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={passwordLoading}
                                    required
                                />
                            </div>

                            {passwordError && (
                                <div className="alert alert-error text-sm py-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    {passwordError}
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="alert alert-success text-sm py-2">
                                    <CheckCircle className="h-4 w-4" />
                                    {passwordSuccess}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    "Set Password"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
