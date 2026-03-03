"use client"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Header } from "./header"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <div className="flex flex-1 flex-col min-h-screen overflow-x-hidden">
                        <Header />
                        <main className="flex-1">{children}</main>
                    </div>
                </SidebarProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}