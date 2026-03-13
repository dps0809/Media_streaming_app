import React from "react";

export const GradientText = ({ text, className = "" }: { text: string; className?: string }) => {
    return (
        <span
            className={`animate-text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-[200%_auto] bg-clip-text text-transparent ${className}`}
        >
            {text}
        </span>
    );
};
