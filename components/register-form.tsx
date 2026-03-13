"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Meteors } from "@/components/ui/meteors"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // ── Client-side Validation ──────────────────────────────────
        if (!userName || !email || !password || !confirmPassword) {
            setError("Please fill in all fields")
            setLoading(false)
            return
        }

        if (userName.length < 2) {
            setError("Username must be at least 2 characters")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            // ── Step 1: Register the user ───────────────────────────────
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_name: userName,
                    email,
                    password,
                }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                setError(data.message || "Registration failed. Please try again.")
                setLoading(false)
                return
            }

            // ── Step 2: Auto sign-in after successful registration ──────
            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (signInResult?.error) {
                // Registration succeeded but auto-login failed — send to login page
                router.push("/login")
                return
            }

            if (signInResult?.ok) {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            console.error("Registration error:", err)
            setError("An unexpected error occurred. Please try again.")
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true)
        setError("")
        try {
            await signIn("google", { callbackUrl: "/dashboard" })
        } catch (err) {
            console.error("Google sign-in error:", err)
            setError("Google sign-in failed. Please try again.")
            setGoogleLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="relative overflow-hidden z-0">
                <Meteors number={30} />
                <CardHeader className="relative z-10">
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="user_name">Username</FieldLabel>
                                <Input
                                    id="user_name"
                                    type="text"
                                    placeholder="johndoe"
                                    value={userName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setUserName(e.target.value)
                                    }
                                    disabled={loading}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setEmail(e.target.value)
                                    }
                                    disabled={loading}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={loading}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword">
                                    Confirm Password
                                </FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    disabled={loading}
                                    required
                                />
                            </Field>
                            {error && (
                                <FieldDescription className="text-red-500 bg-red-50 p-3 rounded-md">
                                    ⚠️ {error}
                                </FieldDescription>
                            )}
                            <Field>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                                <ShimmerButton
                                    type="button"
                                    disabled={googleLoading}
                                    className="w-full mt-2"
                                    onClick={handleGoogleSignIn}
                                >
                                    {googleLoading ? "Redirecting..." : "Sign up with Google"}
                                </ShimmerButton>
                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <a href="/login" className="font-medium hover:underline">
                                        Log in
                                    </a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
