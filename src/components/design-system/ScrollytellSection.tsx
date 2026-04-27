"use client";

/**
 * ScrollytellSection — 2b pattern from WEBSITE-TECHNICAL-RULES.md.
 *
 * Use when: multi-step thesis (problem → insight → answer),
 * process/how-it-works (3–6 steps), or any content where each step deserves
 * its own 100vh moment.
 *
 * Architecture:
 *   - Outer wrapper: position: relative, height = (N+1) * 100vh
 *     (Provides the scroll range. N steps × 100vh of scrubbing + 1 × 100vh entry)
 *   - Inner pin: position: sticky top:0, h-screen, owns the section's z-index.
 *     This is what stays visible during the section's scroll range.
 *   - Steps: absolute-positioned within the stage. Opacity + Y are driven by
 *     scrollYProgress on the outer wrapper. Cross-fade with slight rise.
 *
 * Because the inner pin holds the z-index, ScrollytellSection participates in
 * the C-reveal cover chain — the next section's higher z-index will rise over
 * it as the user scrolls past.
 *
 * Author provides:
 *   - eyebrow / headline / lead (always visible header)
 *   - steps[]: array of { content: ReactNode, label?: string }
 *
 * The primitive handles: scroll progress, cross-fade timing, progress dots,
 * page-pass edges, gold top fade, per-section grid background.
 */

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { SectionLabel } from "./SectionLabel";

type ScrollytellStep = {
    content: ReactNode;
    /** Optional label shown in the corner of the stage (e.g., "01 / 03") */
    label?: string;
};

type ScrollytellSectionProps = {
    zIndex?: number;
    eyebrow?: ReactNode;
    headline?: ReactNode;
    lead?: ReactNode;
    steps: ScrollytellStep[];
    id?: string;
    /** Vertical viewport heights per step. Default 100. Increase for slower scroll pace. */
    vhPerStep?: number;
    /** Optional className for the outer wrapper */
    className?: string;
    /** Hide the gold top fade (e.g., outside the C-ladder) */
    noTopFade?: boolean;
};

export function ScrollytellSection({
    zIndex = 11,
    eyebrow,
    headline,
    lead,
    steps,
    id,
    vhPerStep = 100,
    className = "",
    noTopFade = false,
}: ScrollytellSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    // Outer height: 1 viewport of entry + (N steps × vhPerStep)
    // This gives sticky duration = N × vhPerStep of scroll, exactly enough
    // to scrub through every step.
    const totalVh = (steps.length + 1) * vhPerStep;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    return (
        <div
            ref={ref}
            id={id}
            className={`relative ${className}`.trim()}
            style={{ minHeight: `${totalVh}vh` }}
        >
            {/* Pinned scene — stays visible during the section's scroll range */}
            <section
                className="sticky top-0 h-screen w-full px-10 py-20 section-card flex flex-col"
                style={{
                    zIndex,
                    backgroundColor: "var(--ds-bg)",
                    backgroundImage: [
                        !noTopFade && "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                        "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
                        "linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    ]
                        .filter(Boolean)
                        .join(", "),
                    backgroundSize: noTopFade
                        ? "80px 80px, 80px 80px"
                        : "100% 100%, 80px 80px, 80px 80px",
                }}
            >
                {/* Header — always visible */}
                {(eyebrow || headline || lead) && (
                    <header className="text-center max-w-[1100px] mx-auto mb-10 lg:mb-14">
                        {eyebrow && (typeof eyebrow === "string" ? <SectionLabel>{eyebrow}</SectionLabel> : eyebrow)}
                        {headline && (
                            <h2 className="font-heading font-normal text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-4">
                                {headline}
                            </h2>
                        )}
                        {lead && (
                            <p className="font-heading text-[1rem] lg:text-[1.1rem] leading-[1.6] text-[var(--ds-ink-dim)] max-w-[640px] mx-auto">
                                {lead}
                            </p>
                        )}
                    </header>
                )}

                {/* Stage — steps cross-fade here */}
                <div className="relative flex-1 max-w-[1400px] w-full mx-auto">
                    {steps.map((step, i) => (
                        <Step
                            key={i}
                            index={i}
                            total={steps.length}
                            scrollYProgress={scrollYProgress}
                            content={step.content}
                            label={step.label}
                        />
                    ))}
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-3 mt-6 lg:mt-10">
                    {steps.map((_, i) => (
                        <ProgressDot
                            key={i}
                            index={i}
                            total={steps.length}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

/** Single step in the stage. Cross-fades + rises slightly based on scroll. */
function Step({
    index,
    total,
    scrollYProgress,
    content,
    label,
}: {
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
    content: ReactNode;
    label?: string;
}) {
    // Scroll progress maps:
    //   - First viewport of scroll = entry buffer (progress 0 to 1/(total+1))
    //   - Each step gets equal slice afterward
    // So step i is "active" from (i+1)/(total+1) ... wait simpler:
    // We let step i be active when progress is in [i/total, (i+1)/total]
    // (ignoring entry buffer; the +1 in totalVh just slows the scrub).
    const slice = 1 / total;
    const start = index * slice;
    const end = (index + 1) * slice;
    const fade = slice * 0.25;

    const opacity = useTransform(
        scrollYProgress,
        [Math.max(0, start - fade), start, end, Math.min(1, end + fade)],
        // First step is visible at progress 0; last step persists at progress 1
        [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
    );
    const y = useTransform(
        scrollYProgress,
        [Math.max(0, start - fade), start, end, Math.min(1, end + fade)],
        [index === 0 ? 0 : 50, 0, 0, index === total - 1 ? 0 : -30]
    );

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity, y }}
        >
            <div className="w-full">
                {label && (
                    <div className="absolute top-0 right-0 font-sans text-[0.62rem] font-semibold tracking-[0.3em] uppercase text-[var(--ds-ink-muted)]">
                        {label}
                    </div>
                )}
                {content}
            </div>
        </motion.div>
    );
}

/** Progress indicator — gold when in this step's range, faint otherwise. */
function ProgressDot({
    index,
    total,
    scrollYProgress,
}: {
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
}) {
    const slice = 1 / total;
    const start = index * slice;
    const end = (index + 1) * slice;

    const backgroundColor = useTransform(
        scrollYProgress,
        [Math.max(0, start - 0.02), start, end, Math.min(1, end + 0.02)],
        [
            "rgba(232,228,218,0.15)",
            "rgb(196,149,58)",
            "rgb(196,149,58)",
            "rgba(232,228,218,0.15)",
        ]
    );
    const boxShadow = useTransform(
        scrollYProgress,
        [Math.max(0, start - 0.02), start, end, Math.min(1, end + 0.02)],
        [
            "0 0 0 rgba(196,149,58,0)",
            "0 0 10px rgba(196,149,58,0.6)",
            "0 0 10px rgba(196,149,58,0.6)",
            "0 0 0 rgba(196,149,58,0)",
        ]
    );

    return (
        <motion.div
            className="w-10 h-[3px] rounded-full"
            style={{ backgroundColor, boxShadow }}
        />
    );
}
