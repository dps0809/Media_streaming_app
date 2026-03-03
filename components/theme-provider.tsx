"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeContextType = {
    theme: string
    setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    setTheme: () => { },
})

export const useTheme = () => useContext(ThemeContext)

export const THEMES = [
    "light",
    "dark",
    "synthwave",
    "cyberpunk",
    "retro",
    "valentine",
    "halloween",
    "forest",
    "aqua",
    "dracula",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("dark")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("sv-theme") || "dark"
        setTheme(saved)
        document.documentElement.setAttribute("data-theme", saved)
        setMounted(true)
    }, [])

    const handleSetTheme = (newTheme: string) => {
        setTheme(newTheme)
        localStorage.setItem("sv-theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    // Prevent flash of wrong theme
    if (!mounted) return null

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
