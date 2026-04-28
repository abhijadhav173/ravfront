"use client";

/**
 * Hero — pattern 2a per WEBSITE-TECHNICAL-RULES.md §2a.
 *
 * Full viewport, no sticky, no page-pass edges. Lives at the top, scrolls away
 * normally. Z-index 2. Owns the temple visual + entry copy + scroll cue.
 *
 * Content is CMS-driven via the `content` prop with EditableText/EditableImage
 * wrappers active when EditModeProvider.enabled === true.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/lib/site-content";
import { EditableText, EditableImage } from "@/lib/edit-mode";

type HeroProps = {
    content?: HomeContent["hero"];
};

export default function Hero({ content }: HeroProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.hero;
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const templeY = useTransform(scrollY, [0, 600], ["0%", "-12%"], { clamp: true });
    const templeOpacity = useTransform(scrollY, [0, 500], [0.12, 0.04], { clamp: true });
    const contentOpacity = useTransform(scrollY, [0, 350], [1, 0], { clamp: true });
    const contentY = useTransform(scrollY, [0, 350], [0, 30], { clamp: true });

    return (
        <section
            ref={sectionRef}
            className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center px-10 pt-36 pb-20 text-center"
            style={{ zIndex: 2 }}
        >
            <h1 className="sr-only">RAVOK Studios — {c.tagline}</h1>

            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ y: templeY, opacity: templeOpacity, zIndex: 0 }}
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
            </motion.div>

            <motion.div
                className="relative z-[5] flex flex-col items-center"
                style={{ opacity: contentOpacity, y: contentY }}
            >
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
            </motion.div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 font-sans text-[0.6rem] font-medium tracking-[0.3em] uppercase text-[var(--ds-ink-muted)] z-[5]"
                style={{ opacity: contentOpacity }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            >
                <EditableText path="hero.scrollCue" value={c.scrollCue} />
            </motion.div>
        </section>
    );
}
