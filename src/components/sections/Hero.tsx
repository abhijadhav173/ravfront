"use client";

/**
 * Hero — design-cms-v2: simplified.
 *
 * Was: sticky `top-0` with scroll-driven framer-motion transforms
 * (parallax temple + fading content). On v2 we kill the scroll-driven
 * effects and the sticky page-flip pattern. Hero now just sits at
 * the top of the page and scrolls away normally.
 *
 * Kept: mount-time fade-ins for logo + tagline (single-frame entrance,
 * not scroll-driven — feels like a normal page-load animation).
 *
 * Original sticky/parallax implementation lives in git history at the
 * v2.5-pre-restructure tag for V3 revival.
 */

import { motion } from "framer-motion";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/lib/site-content";
import { EditableText, EditableImage } from "@/lib/edit-mode";

type HeroProps = {
    content?: HomeContent["hero"];
};

export default function Hero({ content }: HeroProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.hero;

    return (
        <section
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-10 pt-36 pb-20 text-center"
        >
            <h1 className="sr-only">RAVOK Studios — {c.tagline}</h1>

            {/* Temple background — fixed opacity, no scroll parallax */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: 0.12, zIndex: 0 }}
            >
                <EditableImage path="hero.templeImage" value={c.templeImage}>
                    {(src) => (
                        <img
                            src={src}
                            alt=""
                            className="w-[60%] max-w-[700px] object-contain"
                            style={{ mixBlendMode: "screen" }}
                            aria-hidden="true"
                        />
                    )}
                </EditableImage>
            </div>

            <div className="relative z-[5] flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.2, 0.6, 0.2, 1], delay: 0.1 }}
                    className="w-[min(820px,88vw)] mb-14"
                >
                    <EditableImage path="hero.logoImage" value={c.logoImage} decorative={false} alt="RAVOK">
                        {(src) => (
                            <img
                                src={src}
                                alt="RAVOK"
                                className="w-full"
                                style={{ mixBlendMode: "screen" }}
                            />
                        )}
                    </EditableImage>
                </motion.div>

                <motion.p
                    className="font-sans text-[0.7rem] font-medium tracking-[0.3em] text-[var(--ds-ink-muted)] uppercase flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <span className="text-ravok-gold">·</span>
                    <EditableText path="hero.tagline" value={c.tagline} />
                    <span className="text-ravok-gold">·</span>
                </motion.p>
            </div>

            {/* Scroll cue — kept as a static label, no looping bob animation */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 font-sans text-[0.6rem] font-medium tracking-[0.3em] uppercase text-[var(--ds-ink-muted)] z-[5]"
            >
                <EditableText path="hero.scrollCue" value={c.scrollCue} />
            </div>
        </section>
    );
}
