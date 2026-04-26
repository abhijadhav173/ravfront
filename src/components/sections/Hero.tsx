"use client";

/**
 * Hero — pattern 2a per WEBSITE-TECHNICAL-RULES.md §2a.
 *
 * Full viewport, no sticky, no page-pass edges. Lives at the top, scrolls away
 * normally. Z-index 2. Owns the temple visual + entry copy + scroll cue.
 *
 * NO solid background — atmosphere (gold glow, wireframe grid, particles)
 * shows through. Per rules: "anything that should look 'global' goes in
 * atmosphere or wireframe, NOT inside the hero."
 *
 * Composition matches sample:
 *  - Temple visual (subtle parallax float)
 *  - Wordmark
 *  - Context line
 *  - Catchphrase (serif italic gold accent)
 *  - Two buttons (primary + secondary)
 *  - Bobbing scroll cue
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Subtle parallax float on the temple visual (ease, not dramatic).
    const templeY = useTransform(scrollY, [0, 600], ["0%", "-12%"], { clamp: true });
    const templeOpacity = useTransform(scrollY, [0, 500], [0.12, 0.04], { clamp: true });

    // Content fades on scroll out.
    const contentOpacity = useTransform(scrollY, [0, 350], [1, 0], { clamp: true });
    const contentY = useTransform(scrollY, [0, 350], [0, 30], { clamp: true });

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-10 pt-36 pb-20 text-center"
            style={{ zIndex: 2 }}
        >
            {/* Temple visual — fixed-feel, subtle parallax, mix-blend-mode screen so atmosphere reads through */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ y: templeY, opacity: templeOpacity, zIndex: 0 }}
            >
                <img
                    src="/images/bg_image.png"
                    alt=""
                    className="w-[60%] max-w-[700px] object-contain"
                    style={{ mixBlendMode: "screen" }}
                />
            </motion.div>

            {/* Content stack */}
            <motion.div
                className="relative z-[5] flex flex-col items-center"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                {/* Wordmark */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.2, 0.6, 0.2, 1], delay: 0.1 }}
                    className="w-[min(820px,88vw)] mb-14"
                >
                    <img
                        src="/images/logo.png"
                        alt="RAVOK"
                        className="w-full"
                        style={{ mixBlendMode: "screen" }}
                    />
                </motion.div>

                {/* Tagline — formatted as sample's context line, with gold dot accents */}
                <motion.p
                    className="font-sans text-[0.7rem] font-medium tracking-[0.3em] text-[var(--ds-ink-muted)] uppercase flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <span className="text-ravok-gold">·</span>
                    A New Architecture for Entertainment
                    <span className="text-ravok-gold">·</span>
                </motion.p>
            </motion.div>

            {/* Scroll cue — bobs softly */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 font-sans text-[0.6rem] font-medium tracking-[0.3em] uppercase text-[var(--ds-ink-muted)] z-[5]"
                style={{ opacity: contentOpacity }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            >
                ↓ Scroll
            </motion.div>
        </section>
    );
}
