"use client";

/**
 * Bridge — REITs analogy + Hollywood-vs-RAVOK comparison table.
 * Per WEBSITE-TECHNICAL-RULES.md §12: comparison → CRevealSection w/ split layout.
 *
 * Layout: 2-column (statue left, text + table right). Content CMS-driven.
 */

import { CRevealSection } from "@/components/design-system";
import { DEFAULT_HOME_CONTENT, renderInline, type HomeContent } from "@/lib/site-content";

type BridgeProps = {
    content?: HomeContent["bridge"];
};

export default function Bridge({ content }: BridgeProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.bridge;

    return (
        <CRevealSection
            zIndex={11}
            id="bridge"
            centerHeader={false}
            contentMaxWidth="1400px"
        >
            <div className="grid lg:grid-cols-[1fr_1.55fr] gap-10 lg:gap-16 items-center">
                <div className="order-1 relative flex items-center justify-center">
                    <img
                        src={c.statueImage}
                        alt=""
                        className="w-full h-auto max-h-[600px] object-contain"
                        aria-hidden="true"
                    />
                </div>

                <div className="order-2 min-w-0">
                    <p className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3">
                        {c.eyebrow}
                    </p>

                    <h2 className="font-heading font-normal text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-3">
                        {renderInline(c.headline)}
                    </h2>

                    <p className="font-heading italic text-[0.88rem] leading-[1.5] text-[var(--ds-ink-dim)] max-w-[600px] mb-5">
                        {renderInline(c.lead)}
                    </p>

                    <table className="comparison-table w-full text-left border-collapse border-t border-[var(--ds-border-strong,rgba(232,228,218,0.15))]">
                        <thead>
                            <tr>
                                <th className="dim-head font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-[var(--ds-ink-muted)] py-2 px-2.5 align-bottom border-b border-[rgba(232,228,218,0.15)] w-[22%]"></th>
                                <th className="col-old font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-[var(--ds-ink-dim)] py-2 px-2.5 align-bottom border-b border-[rgba(232,228,218,0.15)] w-[39%]">
                                    {c.columnOldLabel}
                                </th>
                                <th className="col-new font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-ravok-gold py-2 px-2.5 align-bottom w-[39%]">
                                    {c.columnNewLabel}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {c.rows.map((r, i) => (
                                <tr key={i}>
                                    <td className="dim font-heading italic text-[0.82rem] text-[var(--ds-ink)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        {r.dim}
                                    </td>
                                    <td className="cell-old font-sans text-[0.7rem] leading-[1.4] text-[var(--ds-ink-dim)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        <span className="flex items-start">
                                            <span className="icon-x inline-flex items-center justify-center w-[16px] h-[16px] rounded-full mr-1.5 flex-shrink-0 font-sans font-bold text-[0.56rem]">
                                                ✗
                                            </span>
                                            <span>{renderInline(r.old)}</span>
                                        </span>
                                    </td>
                                    <td className="cell-new font-sans text-[0.7rem] leading-[1.4] text-[var(--ds-ink)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        <span className="flex items-start">
                                            <span className="icon-check inline-flex items-center justify-center w-[16px] h-[16px] rounded-full mr-1.5 flex-shrink-0 font-sans font-bold text-[0.56rem]">
                                                ✓
                                            </span>
                                            <span>{renderInline(r.next)}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </CRevealSection>
    );
}
