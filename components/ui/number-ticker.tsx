"use client";

import { useEffect, useRef } from "react";
import { useSpring, useInView } from "motion/react";

export function NumberTicker({
    value,
    direction = "up",
    delay = 0,
    className,
}: {
    value: number;
    direction?: "up" | "down";
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useSpring(direction === "down" ? value : 0, {
        damping: 60,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : value);
            }, delay * 1000);
        }
    }, [motionValue, isInView, delay, value, direction]);

    useEffect(() => {
        return motionValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Number(latest.toFixed(0))
                );
            }
        });
    }, [motionValue]);

    return (
        <span
            className={`inline-block tabular-nums tracking-wider ${className}`}
            ref={ref}
        />
    );
}
