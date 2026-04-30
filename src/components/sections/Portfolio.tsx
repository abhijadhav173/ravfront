"use client";

/**
 * Portfolio — "The Pillars" teaser (design-cms-v2 / #93).
 *
 * Section 4 on the homepage. Shows the Era framing (Era Zero · Founding slate)
 * with a 4-pillar card grid. Each card is a teaser — full detail lives on
 * /portfolio via the ctaHref CTA at the bottom.
 *
 * comingSoon pillars render as locked/muted cards. Revealed pillars get gold
 * border accents and title copy.
 *
 * All text fields editable in-place via EditableText. Add/remove/reorder via
 * EditableList in edit mode.
 */

import {
    DEFAULT_HOME_CONTENT,
    renderInline,
    type HomeContent,
    type PortfolioStepContent,
} from "@/lib/site-content";
import {
    EditableText,
    EditableList,
    FloatingElementsLayer,
    useEditMode,
} from "@/lib/edit-mode";

const NEW_STEP_DEFAULT: PortfolioStepContent = {
    tag: "New · 0X",
    name: "New Pillar",
    title: "Short tagline for this pillar.",
    body: "",
    meta: [],
    chip: "New",
    badgeNum: "0X",
    badgeLabel: "Pillar",
    comingSoon: true,
};

type PortfolioProps = {
    content?: HomeContent["portfolio"];
};

/**
 * PillarCard — one card in the 4-pillar grid.
 *
 * Revealed (comingSoon=false): gold border, gold name, readable title.
 * Locked  (comingSoon=true):  muted everything, "Revealed in Era Zero" copy.
 *
 * In edit mode: EditableText fields are live; a toggle button flips
 * comingSoon without leaving the page.
 */
function PillarCard({
    step,
    index,
}: {
    step: PortfolioStepContent;
    index: number;
}) {
    const { enabled, setAt } = useEditMode();
    const locked = step.comingSoon;
    const pathPrefix = `portfolio.steps.${index}`;

    return (
        <div
            className={`flex flex-col gap-4 px-5 py-5 border transition-colors duration-300 ${
                locked
                    ? "border-[var(--ds-border)] bg-transparent"
                    : "border-ravok-gold/20 bg-[rgba(196,149,58,0.025)] hover:border-ravok-gold/40"
            }`}
        >
            {/* Pillar number — plain text tag, no circle */}
            <span
                className={`font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase ${
                    locked ? "text-[rgba(232,228,218,0.2)]" : "text-ravok-gold/60"
                }`}
            >
                {step.badgeNum}
            </span>

            {/* Pillar name */}
            <EditableText
                path={`${pathPrefix}.name`}
                value={step.name}
                as="h3"
                inline={false}
                className={`font-heading italic font-normal text-[1.2rem] lg:text-[1.35rem] leading-[1.05] ${
                    locked ? "text-[rgba(232,228,218,0.3)]" : "text-ravok-gold"
                }`}
            />

            {/* Title (italic accent) + body + meta bullets — fills the card */}
            <div className="flex-1 flex flex-col gap-3">
                {/* Italic title accent */}
                {enabled ? (
                    <EditableText
                        path={`${pathPrefix}.title`}
                        value={step.title}
                        as="p"
                        multiline={false}
                        className={`font-heading italic font-normal text-[0.95rem] leading-snug ${
                            locked ? "text-[rgba(232,228,218,0.35)]" : "text-ravok-gold/70"
                        }`}
                    />
                ) : (
                    <p
                        className={`font-heading italic font-normal text-[0.95rem] leading-snug ${
                            locked ? "text-[rgba(232,228,218,0.35)]" : "text-ravok-gold/70"
                        }`}
                    >
                        {renderInline(step.title)}
                    </p>
                )}

                {/* Body paragraph */}
                {enabled ? (
                    <EditableText
                        path={`${pathPrefix}.body`}
                        value={step.body}
                        as="p"
                        multiline
                        className={`font-sans text-[0.78rem] leading-[1.55] ${
                            locked ? "text-[rgba(232,228,218,0.3)]" : "text-[var(--ds-ink-dim)]"
                        }`}
                    />
                ) : (
                    step.body && (
                        <p
                            className={`font-sans text-[0.78rem] leading-[1.55] ${
                                locked ? "text-[rgba(232,228,218,0.3)]" : "text-[var(--ds-ink-dim)]"
                            }`}
                        >
                            {renderInline(step.body)}
                        </p>
                    )
                )}

                {/* Meta bullets (only when present) */}
                {step.meta.length > 0 && (
                    <ul className="mt-1 space-y-1">
                        {step.meta.map((m, mi) => (
                            <li
                                key={mi}
                                className="relative pl-3 font-sans text-[0.7rem] leading-[1.5] text-[var(--ds-ink-dim)]"
                            >
                                <span className="absolute left-0 top-0 text-ravok-gold/60">—</span>
                                {enabled ? (
                                    <EditableText
                                        path={`${pathPrefix}.meta.${mi}`}
                                        value={m}
                                        as="span"
                                        inline
                                        className=""
                                    />
                                ) : (
                                    renderInline(m)
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer: live/coming-soon chip + edit-mode toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--ds-border)]">
                <span
                    className={`inline-flex items-center gap-1.5 font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase ${
                        locked ? "text-[rgba(232,228,218,0.2)]" : "text-ravok-gold"
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            locked
                                ? "border border-[rgba(232,228,218,0.2)]"
                                : "bg-ravok-gold"
                        }`}
                    />
                    {locked ? "Coming soon" : "Live"}
                </span>

                {enabled && (
                    <button
                        type="button"
                        onClick={() => setAt(`${pathPrefix}.comingSoon`, !locked)}
                        className="font-sans text-[0.5rem] tracking-[0.18em] uppercase text-[var(--ds-ink-muted)] hover:text-ravok-gold border border-[var(--ds-border)] hover:border-ravok-gold/30 px-2 py-0.5 transition-colors"
                    >
                        {locked ? "Mark live" : "Mark coming soon"}
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * ThePillars — the full section.
 *
 * Era eyebrow → headline + lead (2-col) → 4-card grid → CTA.
 */
function ThePillars({ content }: { content: HomeContent["portfolio"] }) {
    const { enabled } = useEditMode();

    return (
        <section
            id="portfolio"
            className="relative w-full px-6 lg:px-[6vw] py-14 lg:py-20 border-t border-[var(--ds-border)]"
            style={{
                zIndex: 12,
                backgroundColor: "var(--ds-bg)",
                backgroundImage:
                    "linear-gradient(to bottom, rgba(196,149,58,0.04) 0, transparent 280px)",
            }}
        >
            <FloatingElementsLayer
                decorations={content.decorations ?? []}
                path="portfolio.decorations"
            />

            <div className="max-w-[1300px] mx-auto">

                {/* Era eyebrow */}
                <div className="flex items-center gap-3 mb-8">
                    <EditableText
                        path="portfolio.eraEyebrow"
                        value={content.eraEyebrow ?? "Founding slate"}
                        as="span"
                        inline
                        className="font-sans text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-[var(--ds-ink-muted)]"
                    />
                    <span
                        className="font-sans text-[0.58rem] text-[var(--ds-border-strong)]"
                        aria-hidden
                    >
                        ·
                    </span>
                    <EditableText
                        path="portfolio.eraLabel"
                        value={content.eraLabel ?? "Era Zero"}
                        as="span"
                        inline
                        className="font-sans text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-ravok-gold"
                    />
                </div>

                {/* Headline + lead — 2-col on desktop */}
                <div className="grid lg:grid-cols-[3fr_2fr] gap-6 lg:gap-16 mb-10 lg:mb-14 items-end">
                    <EditableText
                        path="portfolio.headline"
                        value={content.headline ?? "Four pillars of what we're building first."}
                        as="h2"
                        multiline
                        inline={false}
                        className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-heading font-normal text-[var(--ds-ink)] leading-[1.1]"
                    />
                    <EditableText
                        path="portfolio.lead"
                        value={content.lead ?? ""}
                        as="p"
                        multiline
                        inline={false}
                        className="font-sans text-[0.85rem] lg:text-[0.9rem] leading-relaxed text-[var(--ds-ink-dim)]"
                    />
                </div>

                {/* 4-pillar card grid
                 *  EditableList: in edit mode wraps each card in a drag+delete shell
                 *  (each shell becomes a grid cell). In production, items are direct
                 *  children of the grid div — no wrapper overhead. */}
                <EditableList
                    arrayPath="portfolio.steps"
                    items={content.steps}
                    defaultNewItem={NEW_STEP_DEFAULT}
                    addLabel="Add pillar"
                    controlsAbove
                    as="div"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
                    renderItem={(step, i) => (
                        <PillarCard step={step} index={i} />
                    )}
                />

                {/* CTA — plain link in production, editable label + href in edit mode */}
                <div className="mt-8 lg:mt-10 flex justify-center">
                    {enabled ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="inline-flex items-center gap-3 px-7 py-3 rounded-full border border-ravok-gold/40 text-ravok-gold font-sans text-[0.6rem] tracking-[0.25em] uppercase">
                                <EditableText
                                    path="portfolio.ctaLabel"
                                    value={content.ctaLabel ?? "See the full slate"}
                                    as="span"
                                    inline
                                    className=""
                                />
                                <span aria-hidden>→</span>
                            </div>
                            <EditableText
                                path="portfolio.ctaHref"
                                value={content.ctaHref ?? "/portfolio"}
                                as="div"
                                inline={false}
                                className="font-mono text-[0.65rem] text-[var(--ds-ink-muted)] mt-1"
                            />
                        </div>
                    ) : (
                        <a
                            href={content.ctaHref ?? "/portfolio"}
                            className="inline-flex items-center gap-3 px-7 py-3 rounded-full border border-ravok-gold/40 text-ravok-gold font-sans text-[0.6rem] tracking-[0.25em] uppercase hover:border-ravok-gold hover:bg-[rgba(196,149,58,0.06)] transition-colors duration-200"
                        >
                            {content.ctaLabel ?? "See the full slate"}
                            <span aria-hidden>→</span>
                        </a>
                    )}
                </div>

            </div>
        </section>
    );
}

export default function Portfolio({ content }: PortfolioProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.portfolio;
    return <ThePillars content={c} />;
}
