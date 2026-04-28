"use client";

/**
 * Portfolio — 4-pillar scrollytelling.
 * Per WEBSITE-TECHNICAL-RULES.md §12: portfolio → ScrollytellSection.
 * Steps content is CMS-driven via the `content` prop.
 */

import { ScrollytellSection, type ScrollytellStep } from "@/components/design-system";
import {
    DEFAULT_HOME_CONTENT,
    renderInline,
    type HomeContent,
    type PortfolioStepContent,
} from "@/lib/site-content";

type PortfolioProps = {
    content?: HomeContent["portfolio"];
};

function StepBadge({
    num,
    label,
    comingSoon = false,
}: {
    num: string;
    label: string;
    comingSoon?: boolean;
}) {
    return (
        <div
            className={`w-[65%] aspect-square rounded-full border-[1.5px] flex flex-col items-center justify-center font-heading ${
                comingSoon
                    ? "border-[var(--ds-ink-muted,rgba(232,228,218,0.4))] text-[var(--ds-ink-muted,rgba(232,228,218,0.4))]"
                    : "border-ravok-gold text-ravok-gold"
            }`}
            style={{
                background: comingSoon
                    ? "radial-gradient(ellipse at center, rgba(232,228,218,0.04) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at center, rgba(196,149,58,0.06) 0%, transparent 70%)",
            }}
        >
            <div className="font-heading italic text-[clamp(3rem,6vw,5rem)] leading-none mb-2">{num}</div>
            <div className="font-heading italic text-[clamp(1rem,1.5vw,1.4rem)] tracking-[0.05em]">{label}</div>
            {comingSoon && (
                <div className="mt-3 font-sans not-italic text-[0.56rem] font-semibold tracking-[0.32em] uppercase">
                    Coming Soon
                </div>
            )}
        </div>
    );
}

function StepBody({ body, meta }: { body: string; meta: string[] }) {
    return (
        <>
            {body && <span className="block mb-4">{renderInline(body)}</span>}
            {meta.length > 0 && (
                <span className="block">
                    {meta.map((m, i) => (
                        <span
                            key={i}
                            className="block relative pl-4 mb-1.5 last:mb-0 font-sans text-[0.78rem] tracking-[0.02em] text-[var(--ds-ink-dim)]"
                        >
                            <span className="absolute left-0 text-ravok-gold">—</span>
                            {renderInline(m)}
                        </span>
                    ))}
                </span>
            )}
        </>
    );
}

function toScrollytellStep(s: PortfolioStepContent): ScrollytellStep {
    if (s.comingSoon) {
        return {
            tag: s.tag,
            name: s.name,
            title: (
                <span className="text-[var(--ds-ink-muted,rgba(232,228,218,0.4))]">{s.title}</span>
            ),
            chip: s.chip,
            visual: <StepBadge num={s.badgeNum} label={s.badgeLabel} comingSoon />,
        };
    }

    return {
        tag: s.tag,
        name: s.name,
        title: renderInline(s.title),
        description: <StepBody body={s.body} meta={s.meta} />,
        chip: s.chip,
        visual: <StepBadge num={s.badgeNum} label={s.badgeLabel} />,
    };
}

export default function Portfolio({ content }: PortfolioProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.portfolio;
    const steps = c.steps.map(toScrollytellStep);

    return (
        <ScrollytellSection
            zIndex={12}
            id="portfolio"
            label={c.label}
            counterSuffix={c.counterSuffix}
            steps={steps}
        />
    );
}
