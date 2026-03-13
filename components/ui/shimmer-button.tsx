"use client";
import React from "react";

export const ShimmerButton = ({ children, className = "", onClick, type = "button", disabled = false }: any) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`group relative overflow-hidden rounded-lg font-semibold text-primary-content transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            <div className="absolute inset-0 z-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                <div className="relative h-full w-12 bg-white/30 blur-sm" />
            </div>
        </button>
    );
};
