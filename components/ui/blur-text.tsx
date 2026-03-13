"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    threshold?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
    text,
    delay = 200,
    className = '',
    animateBy = 'words',
    direction = 'top',
    threshold = 0.1,
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) setInView(true);
    }, [isInView]);

    const defaultVariants = {
        hidden: { filter: 'blur(10px)', opacity: 0, transform: `translate3d(0,${direction === 'top' ? '-' : ''}50px,0)` },
        visible: { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
    };

    return (
        <p ref={ref} className={className}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={defaultVariants}
                    transition={{ delay: index * (delay / 1000), duration: 0.5, ease: 'easeOut' }}
                    className="inline-block"
                >
                    {element === ' ' ? '\u00A0' : element}
                    {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </p>
    );
};
