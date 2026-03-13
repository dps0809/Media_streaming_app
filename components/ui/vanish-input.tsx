"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";

export const VanishInput = ({ placeholders = ["Search..."], onChange, onSubmit, className = "" }: any) => {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const [value, setValue] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(value);
        setValue(""); // Vanish effect
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`relative flex items-center w-full max-w-md mx-auto bg-base-100 border border-base-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all ${className}`}
        >
            <div className="pl-4">
                <Search className="h-5 w-5 text-base-content/50" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    if (onChange) onChange(e);
                }}
                className="w-full bg-transparent border-none py-3 pl-3 pr-4 text-base-content focus:outline-none placeholder-transparent"
            />
            <div className="pointer-events-none absolute inset-y-0 left-12 flex items-center">
                <AnimatePresence mode="wait">
                    {!value && (
                        <motion.p
                            key={currentPlaceholder}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-base-content/50 m-0 truncate"
                        >
                            {placeholders[currentPlaceholder]}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
};
