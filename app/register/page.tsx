"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            router.push("/dashboard")
        }
    }, [status, session, router])

    if (status === "loading") {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        )
    }

    if (status === "authenticated") return null

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                {error && (
                    <div className="alert alert-error mb-4 text-sm">
                        ⚠️{" "}
                        {error === "OAuthAccountNotLinked"
                            ? "This email is already registered with a password. Please log in with your credentials."
                            : error === "GoogleNoEmail"
                                ? "Could not retrieve email from Google. Please try again."
                                : error === "GoogleSignInFailed"
                                    ? "Google sign-in failed. Please try again."
                                    : "An error occurred. Please try again."}
                    </div>
                )}
                <RegisterForm />
            </div>
        </div>
    )
}
