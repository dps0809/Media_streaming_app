"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";

export const TiltCard = ({ children, className = "", style = {} }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        // Tilt limit
        setRotation({
            x: -yPct * 20,
            y: xPct * 20,
        });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX: rotation.x, rotateY: rotation.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ perspective: 1000, ...style }}
            className={className}
        >
            <div className="w-full h-full pointer-events-none">
                {children}
            </div>
        </motion.div>
    );
};
