"use client";

/**
 * IntroSection — "About" / hook section.
 * Per WEBSITE-TECHNICAL-RULES.md §12: manifesto/brand statement → CRevealSection.
 *
 * Layout: 2-column grid (text left, statue right).
 * Content: eyebrow + h2 hook + 2 body paragraphs + facts list + dual CTAs.
 * Statue: SVG illustration on the right column, no frame chrome.
 */

import { Eye } from "lucide-react";
import { CRevealSection, Button } from "@/components/design-system";

const facts = [
    "2 films incorporated as SPVs",
    "20+ IPs in development",
    "Emmy-nominated director attached",
    "PGA producer on board",
    "Tax rebate secured",
    "Meris beta live",
];

export default function IntroSection() {
    return (
        <CRevealSection
            zIndex={10}
            id="about"
            centerHeader={false}
            contentMaxWidth="1300px"
        >
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left — text */}
                <div className="order-2 lg:order-1">
                    <p className="font-sans text-[0.62rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-6">
                        — About
                    </p>

                    <h2 className="font-heading font-normal text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-6">
                        Film is historically uninvestable.{" "}
                        <em className="text-ravok-gold not-italic font-heading italic">Until now.</em>
                    </h2>

                    <p className="font-sans text-[1rem] leading-[1.65] text-[var(--ds-ink-dim)] mb-6 max-w-[540px]">
                        The legal and accounting infrastructure that makes a tech startup underwritable —
                        cap tables, audit trails, verifiable performance — was never built for film.{" "}
                        <em className="text-[var(--ds-ink)]">So we&apos;re building it.</em>
                    </p>

                    <p className="font-sans text-[1rem] leading-[1.65] text-[var(--ds-ink-dim)] mb-6 max-w-[540px]">
                        RAVOK is a venture studio for entertainment. Each project incorporates as its own company,
                        with creator equity, transparent waterfalls, and audit-grade reporting.{" "}
                        <strong className="text-[var(--ds-ink)] font-medium">
                            The same structural rigor every other industry takes for granted — finally applied to a $2.9T
                            market that still runs on handshake deals.
                        </strong>
                    </p>

                    <ul className="intro-facts list-none p-0 mb-8 max-w-[540px] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {facts.map((fact, i) => (
                            <li
                                key={i}
                                className="relative pl-4 font-sans text-[0.78rem] font-medium tracking-[0.02em] text-[var(--ds-ink)]"
                            >
                                <span className="absolute left-0 text-ravok-gold font-semibold">✓</span>
                                {fact}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button href="/thesis" variant="primary">
                            Read the thesis →
                        </Button>
                        <Button href="#portfolio" variant="secondary">
                            See the portfolio
                        </Button>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(232,228,218,0.15)] bg-transparent transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:border-ravok-gold hover:-translate-y-px"
                            aria-label="Watch"
                        >
                            <Eye className="h-4 w-4 text-ravok-gold" />
                        </button>
                    </div>
                </div>

                {/* Right — statue (transparent SVG, no frame chrome) */}
                <div className="order-1 lg:order-2 relative flex items-center justify-center">
                    <img
                        src="/images/statues/intro-statue.svg"
                        alt=""
                        className="w-full h-auto max-h-[600px] object-contain"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </CRevealSection>
    );
}
