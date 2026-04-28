"use client";

/**
 * Portfolio — 4-pillar scrollytelling.
 *
 * Behaviour split:
 *   - Out of edit mode → ScrollytellSection (sticky scroll-driven advance, the
 *     production design).
 *   - In edit mode → static stacked layout where every step is visible at once
 *     and editable inline. Avoids the contentEditable-vs-scrollytell conflict
 *     where scrolling to read your own typing would snap to the next step.
 *
 * Both modes use the same content shape, the same step rendering, and write
 * through the same path-based EditModeProvider — so saves are identical.
 */

import { ScrollytellSection, type ScrollytellStep } from "@/components/design-system";
import {
    DEFAULT_HOME_CONTENT,
    renderInline,
    type HomeContent,
    type PortfolioStepContent,
} from "@/lib/site-content";
import { EditableText, useEditMode } from "@/lib/edit-mode";

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

function StepBody({
    body,
    meta,
    pathPrefix,
    editable,
}: {
    body: string;
    meta: string[];
    pathPrefix: string;
    editable: boolean;
}) {
    if (!editable) {
        // Production / scrollytell mode — same render as before so the
        // generated HTML matches the public-site layout.
        return (
            <>
                <span className="block mb-4">{renderInline(body)}</span>
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

    // Edit mode — wrap body and each meta item in EditableText
    return (
        <>
            <EditableText
                path={`${pathPrefix}.body`}
                value={body}
                as="span"
                multiline
                className="block mb-4"
            />
            {meta.length > 0 && (
                <span className="block">
                    {meta.map((m, i) => (
                        <span
                            key={i}
                            className="block relative pl-4 mb-1.5 last:mb-0 font-sans text-[0.78rem] tracking-[0.02em] text-[var(--ds-ink-dim)]"
                        >
                            <span className="absolute left-0 text-ravok-gold">—</span>
                            <EditableText path={`${pathPrefix}.meta.${i}`} value={m} />
                        </span>
                    ))}
                </span>
            )}
        </>
    );
}

function toScrollytellStep(s: PortfolioStepContent, i: number): ScrollytellStep {
    const pathPrefix = `portfolio.steps.${i}`;
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
        description: <StepBody body={s.body} meta={s.meta} pathPrefix={pathPrefix} editable={false} />,
        chip: s.chip,
        visual: <StepBadge num={s.badgeNum} label={s.badgeLabel} />,
    };
}

/* ───── Edit-mode rendering: static stacked layout ───── */

function StackedStep({
    step,
    index,
}: {
    step: PortfolioStepContent;
    index: number;
}) {
    const pathPrefix = `portfolio.steps.${index}`;
    return (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center py-12 border-t border-[rgba(232,228,218,0.06)]">
            <div>
                <EditableText
                    path={`${pathPrefix}.tag`}
                    value={step.tag}
                    inline={false}
                    as="div"
                    className="font-sans text-[0.56rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-4"
                />
                <EditableText
                    path={`${pathPrefix}.name`}
                    value={step.name}
                    as="h3"
                    inline={false}
                    className="font-heading italic font-normal text-ravok-gold text-[clamp(2rem,3.4vw,3rem)] leading-[1] mb-5"
                />
                <EditableText
                    path={`${pathPrefix}.title`}
                    value={step.title}
                    as="h4"
                    multiline
                    className="font-heading font-normal text-[1.3rem] lg:text-[1.5rem] leading-tight mb-4 text-[var(--ds-ink)]"
                />
                <p className="font-sans text-[0.95rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[540px]">
                    <StepBody
                        body={step.body}
                        meta={step.meta}
                        pathPrefix={pathPrefix}
                        editable
                    />
                </p>
                <div className="mt-5">
                    <EditableText
                        path={`${pathPrefix}.chip`}
                        value={step.chip}
                        inline={false}
                        as="span"
                        className="inline-block font-sans text-[0.58rem] font-semibold tracking-[0.22em] uppercase px-[0.9rem] py-2 border border-[rgba(196,149,58,0.3)] rounded-full text-ravok-gold"
                    />
                </div>
                <div className="mt-3 flex gap-4 text-[0.65rem] tracking-[0.18em] uppercase text-white/40 font-sans">
                    <label className="flex items-center gap-2">
                        Badge num:
                        <EditableText
                            path={`${pathPrefix}.badgeNum`}
                            value={step.badgeNum}
                            inline={false}
                            className="text-white"
                        />
                    </label>
                    <label className="flex items-center gap-2">
                        Badge label:
                        <EditableText
                            path={`${pathPrefix}.badgeLabel`}
                            value={step.badgeLabel}
                            inline={false}
                            className="text-white"
                        />
                    </label>
                </div>
            </div>
            <div className="flex items-center justify-center min-h-[260px]">
                <StepBadge num={step.badgeNum} label={step.badgeLabel} comingSoon={step.comingSoon} />
            </div>
        </div>
    );
}

function PortfolioStacked({ content }: { content: HomeContent["portfolio"] }) {
    return (
        <section
            id="portfolio"
            className="section-card relative w-full px-6 lg:px-[6vw] py-20"
            style={{
                zIndex: 12,
                backgroundColor: "var(--ds-bg)",
                backgroundImage: "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
            }}
        >
            <div className="max-w-[1500px] mx-auto">
                <EditableText
                    path="portfolio.label"
                    value={content.label}
                    inline={false}
                    as="div"
                    className="font-sans text-[0.62rem] font-semibold tracking-[0.32em] uppercase text-ravok-gold mb-4"
                />
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40 mb-8 italic">
                    Edit-mode preview · stacked layout. Public site shows scroll-driven advance.
                </p>
                {content.steps.map((step, i) => (
                    <StackedStep key={i} step={step} index={i} />
                ))}
            </div>
        </section>
    );
}

export default function Portfolio({ content }: PortfolioProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.portfolio;
    const { enabled } = useEditMode();

    if (enabled) {
        return <PortfolioStacked content={c} />;
    }

    const steps = c.steps.map((s, i) => toScrollytellStep(s, i));

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
