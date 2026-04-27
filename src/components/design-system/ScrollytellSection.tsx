"use client";

/**
 * ScrollytellSection — sticky-outer + scroll-tracker pattern.
 *
 * Why this architecture:
 *   The C-ladder cover-from-below requires the section's outer element to
 *   be sticky at top:0 so the next section can flip OVER it. But if the
 *   outer is sticky AND tall enough to hold N stacked steps, the inner
 *   content gets frozen (sticky elements with overflow content render
 *   their content at fixed positions during the stuck range, so only the
 *   first step is ever in the viewport).
 *
 *   Solution: outer is sticky h-screen (just 100vh), so it stays locked
 *   at top. Inside, ONE active step is shown at a time with cross-fade
 *   between steps. A scroll tracker rendered AFTER the section provides
 *   the scroll range that drives the active-step index. As the user
 *   scrolls through the tracker, the active step changes — content
 *   "scrolls" while the section stays locked. After the tracker ends,
 *   the next sibling section rises up and flips over this one.
 *
 * Layout inside the sticky outer:
 *   2-column grid. Left = active text step (cross-fade). Right = active
 *   visual (cross-fade). Counter pill at the top.
 *
 * z-index/cover behavior:
 *   Outer holds the section's z-index. Next sticky section with higher
 *   z covers it as it rises.
 */

import { ReactNode, useEffect, useRef, useState } from "react";
import { SectionLabel } from "./SectionLabel";

export type ScrollytellStep = {
    /** Small uppercase tag, e.g. "Entertainment · 01" */
    tag?: string;
    /** Big italic gold name, e.g. "Film SPVs" */
    name: ReactNode;
    /** Heading sentence (serif, with optional <em> for gold accents) */
    title?: ReactNode;
    /** Body paragraph */
    description?: ReactNode;
    /** Pill chip at the bottom, e.g., "10–50% Equity" */
    chip?: string;
    /** The pinned visual for this step (img, icon, anything) */
    visual: ReactNode;
};

type ScrollytellSectionProps = {
    zIndex?: number;
    /** Eyebrow label at the top of the text column */
    label?: string;
    /** Counter suffix, e.g., "THE PORTFOLIO". If undefined, counter hidden. */
    counterSuffix?: string;
    steps: ScrollytellStep[];
    id?: string;
    className?: string;
    noTopFade?: boolean;
    /** vh per step in the tracker. Default 100vh per step. Larger = slower scrub. */
    vhPerStep?: number;
};

export function ScrollytellSection({
    zIndex = 11,
    label,
    counterSuffix,
    steps,
    id,
    className = "",
    noTopFade = false,
    vhPerStep = 100,
}: ScrollytellSectionProps) {
    const [activeIdx, setActiveIdx] = useState(0);
    const trackerRef = useRef<HTMLDivElement | null>(null);
    const lastIdxRef = useRef(0);

    useEffect(() => {
        let rafId: number | null = null;

        function update() {
            rafId = null;
            const tracker = trackerRef.current;
            if (!tracker) return;
            const r = tracker.getBoundingClientRect();
            // Scroll progress within the tracker. r.top is negative when scrolled past tracker start.
            const totalRange = Math.max(1, r.height);
            const scrolled = Math.max(0, -r.top);
            const progress = Math.min(0.9999, scrolled / totalRange);
            const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
            if (idx !== lastIdxRef.current) {
                lastIdxRef.current = idx;
                setActiveIdx(idx);
            }
        }

        function onScroll() {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(update);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        update();
        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [steps.length]);

    return (
        <>
            {/* Sticky scrollytell scene — exactly 100vh, locked at top */}
            <section
                id={id}
                className={`sticky top-0 h-screen w-full overflow-hidden section-card flex flex-col ${className}`.trim()}
                style={{
                    zIndex,
                    backgroundColor: "var(--ds-bg)",
                    backgroundImage: noTopFade
                        ? undefined
                        : "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 px-6 lg:px-[6vw] py-20 lg:py-24 flex-1 max-w-[1500px] mx-auto w-full">
                    {/* Left — active text step (cross-fade) */}
                    <div className="relative flex flex-col justify-center">
                        {label && <SectionLabel className="mb-10 lg:mb-14">{label}</SectionLabel>}
                        <div className="relative flex-1 flex items-center">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${
                                        activeIdx === i ? "opacity-100" : "opacity-0 pointer-events-none"
                                    }`}
                                >
                                    {step.tag && (
                                        <span className="font-sans text-[0.56rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-4">
                                            {step.tag}
                                        </span>
                                    )}
                                    <h3 className="font-heading italic font-normal text-ravok-gold text-[clamp(2.5rem,4vw,3.5rem)] leading-[1] mb-5">
                                        {step.name}
                                    </h3>
                                    {step.title && (
                                        <h4 className="font-heading font-normal text-[1.5rem] lg:text-[1.7rem] leading-tight mb-4 text-[var(--ds-ink)]">
                                            {step.title}
                                        </h4>
                                    )}
                                    {step.description && (
                                        <p className="font-heading text-[1rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[480px] mb-5">
                                            {step.description}
                                        </p>
                                    )}
                                    {step.chip && (
                                        <span className="self-start font-sans text-[0.58rem] font-semibold tracking-[0.22em] uppercase px-[0.9rem] py-2 border border-[rgba(196,149,58,0.3)] rounded-full text-ravok-gold">
                                            {step.chip}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — active visual (cross-fade) */}
                    <div className="relative hidden lg:flex items-center justify-center">
                        {counterSuffix !== undefined && (
                            <div className="absolute top-[5vh] left-1/2 -translate-x-1/2 font-heading text-[13px] tracking-[0.3em] uppercase text-[var(--ds-ink-dim)] z-[3] whitespace-nowrap">
                                <span className="text-ravok-gold italic">
                                    {String(activeIdx + 1).padStart(2, "0")}
                                </span>{" "}
                                / {String(steps.length).padStart(2, "0")} — {counterSuffix}
                            </div>
                        )}
                        <div className="relative w-full aspect-square max-h-[80vh] mx-auto">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                                        activeIdx === i ? "opacity-100" : "opacity-0"
                                    }`}
                                >
                                    {step.visual}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Scroll tracker — invisible spacer that provides the scroll range
                for active-step calculation. Total height = N × vhPerStep. */}
            <div
                ref={trackerRef}
                aria-hidden="true"
                style={{ height: `${steps.length * vhPerStep}vh` }}
            />
        </>
    );
}
