"use client";
import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export const GlareCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            className={`relative overflow-hidden group ${className}`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.15),
              transparent 40%
            )
          `,
                }}
            />
            <div className="relative z-0 h-full w-full">{children}</div>
        </div>
    );
};
