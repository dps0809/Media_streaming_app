import React from "react";

export const Meteors = ({ number = 20, className = "" }: { number?: number; className?: string }) => {
    const meteors = new Array(number).fill(true);
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
            {meteors.map((el, idx) => (
                <span
                    key={"meteor" + idx}
                    className="pointer-events-none absolute left-1/2 top-1/2 flex h-0.5 w-0.5 animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
                    style={{
                        top: Math.floor(Math.random() * 100) + "%",
                        left: Math.floor(Math.random() * 100) + "%",
                        animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
                        animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
                    }}
                >
                    <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
                </span>
            ))}
        </div>
    );
};
