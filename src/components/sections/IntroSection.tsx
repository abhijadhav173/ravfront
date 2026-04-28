"use client";

/**
 * IntroSection — "About" / hook section.
 * Per WEBSITE-TECHNICAL-RULES.md §12: manifesto/brand statement → CRevealSection.
 *
 * Layout: 2-column grid (text left, statue right). Content CMS-driven.
 */

import { Eye } from "lucide-react";
import { CRevealSection, Button } from "@/components/design-system";
import { DEFAULT_HOME_CONTENT, renderInline, type HomeContent } from "@/lib/site-content";

type IntroSectionProps = {
    content?: HomeContent["intro"];
};

export default function IntroSection({ content }: IntroSectionProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.intro;

    return (
        <CRevealSection
            zIndex={10}
            id="about"
            centerHeader={false}
            contentMaxWidth="1300px"
        >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <p className="font-sans text-[0.62rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3">
                        {c.eyebrow}
                    </p>

                    <h2 className="font-heading font-normal text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-4">
                        {renderInline(c.headline)}
                    </h2>

                    <p className="font-sans text-[0.95rem] leading-[1.55] text-[var(--ds-ink-dim)] mb-3 max-w-[540px]">
                        {renderInline(c.body1)}
                    </p>

                    <p className="font-sans text-[0.95rem] leading-[1.55] text-[var(--ds-ink-dim)] mb-5 max-w-[540px]">
                        {renderInline(c.body2)}
                    </p>

                    {c.facts.length > 0 && (
                        <ul className="intro-facts list-none p-0 mb-5 max-w-[540px] grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
                            {c.facts.map((fact, i) => (
                                <li
                                    key={i}
                                    className="relative pl-4 font-sans text-[0.74rem] font-medium tracking-[0.02em] text-[var(--ds-ink)]"
                                >
                                    <span className="absolute left-0 text-ravok-gold font-semibold">✓</span>
                                    {fact}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        {c.ctas.map((cta, i) => (
                            <Button key={i} href={cta.href} variant={cta.variant}>
                                {cta.label}
                            </Button>
                        ))}
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(232,228,218,0.15)] bg-transparent transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:border-ravok-gold hover:-translate-y-px"
                            aria-label="Watch"
                        >
                            <Eye className="h-4 w-4 text-ravok-gold" />
                        </button>
                    </div>
                </div>

                <div className="order-1 lg:order-2 relative flex items-center justify-center">
                    <img
                        src={c.statueImage}
                        alt=""
                        className="w-full h-auto max-h-[68vh] object-contain"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </CRevealSection>
    );
}
