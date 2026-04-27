"use client";

/**
 * Bridge — REITs analogy + Hollywood-vs-RAVOK comparison table.
 * Per WEBSITE-TECHNICAL-RULES.md §12: comparison → CRevealSection w/ split layout.
 *
 * Layout: 2-column grid (statue left, text + table right).
 * Statue placeholder is on the LEFT to alternate with IntroSection's right-side statue
 * (so visuals don't stack on the same side down the page).
 */

import { CRevealSection } from "@/components/design-system";

type Row = {
    dim: string;
    old: React.ReactNode;
    next: React.ReactNode;
};

const rows: Row[] = [
    {
        dim: "Cap table",
        old: <>Opaque waterfalls. Hidden positions. &ldquo;Hollywood accounting.&rdquo;</>,
        next: <>Clean SPV equity. <em className="text-ravok-gold not-italic font-heading italic">Every position visible</em>, every dollar tracked.</>,
    },
    {
        dim: "Project structure",
        old: <>Co-mingled studio P&amp;L. Cross-collateralized risk.</>,
        next: <>Each film is its own <em className="text-ravok-gold not-italic font-heading italic">standalone company</em>. Isolated upside.</>,
    },
    {
        dim: "Creator share",
        old: <>Backend that never pays. Net points worth nothing.</>,
        next: <>Standardized profit participation. <em className="text-ravok-gold not-italic font-heading italic">Real equity</em>, real distributions.</>,
    },
    {
        dim: "Audit trail",
        old: <>Statements arrive months late, if ever. No real-time visibility.</>,
        next: <>Real-time reporting through <em className="text-ravok-gold not-italic font-heading italic">Meris</em>. Audit-grade by default.</>,
    },
    {
        dim: "Capital access",
        old: <>Relationship-gated. Insiders only. Uninvestable for institutions.</>,
        next: <>Underwritable structure. <em className="text-ravok-gold not-italic font-heading italic">Institutional-ready</em> from day one.</>,
    },
    {
        dim: "Distribution",
        old: <>Studio gatekeeping. Output deals dictate the upside.</>,
        next: <>DTC optional via <em className="text-ravok-gold not-italic font-heading italic">Phema</em>. The SPV controls its own exit.</>,
    },
];

export default function Bridge() {
    return (
        <CRevealSection
            zIndex={11}
            id="bridge"
            centerHeader={false}
            contentMaxWidth="1400px"
        >
            <div className="grid lg:grid-cols-[1fr_1.55fr] gap-10 lg:gap-16 items-center">
                {/* Left — statue */}
                <div className="order-1 relative flex items-center justify-center">
                    <img
                        src="/images/statues/bridge-statue.svg"
                        alt=""
                        className="w-full h-auto max-h-[600px] object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* Right — text + comparison table */}
                <div className="order-2 min-w-0">
                    <p className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3">
                        — The Pattern
                    </p>

                    <h2 className="font-heading font-normal text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-3">
                        REITs did it for real estate.
                        <br />
                        We&apos;re doing it for{" "}
                        <em className="text-ravok-gold not-italic font-heading italic">entertainment</em>.
                    </h2>

                    <p className="font-heading italic text-[0.88rem] leading-[1.5] text-[var(--ds-ink-dim)] max-w-[600px] mb-5">
                        Before REITs, real estate was illiquid, opaque, relationship-driven.
                        A legal structure and a disclosure regime turned it into a{" "}
                        <em className="text-[var(--ds-ink)] font-heading italic">$4T asset class</em>.
                        Same pattern. Different industry.
                    </p>

                    <table className="comparison-table w-full text-left border-collapse border-t border-[var(--ds-border-strong,rgba(232,228,218,0.15))]">
                        <thead>
                            <tr>
                                <th className="dim-head font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-[var(--ds-ink-muted)] py-2 px-2.5 align-bottom border-b border-[rgba(232,228,218,0.15)] w-[22%]"></th>
                                <th className="col-old font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-[var(--ds-ink-dim)] py-2 px-2.5 align-bottom border-b border-[rgba(232,228,218,0.15)] w-[39%]">
                                    Hollywood (today)
                                </th>
                                <th className="col-new font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-ravok-gold py-2 px-2.5 align-bottom w-[39%]">
                                    RAVOK
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i}>
                                    <td className="dim font-heading italic text-[0.82rem] text-[var(--ds-ink)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        {r.dim}
                                    </td>
                                    <td className="cell-old font-sans text-[0.7rem] leading-[1.4] text-[var(--ds-ink-dim)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        <span className="flex items-start">
                                            <span className="icon-x inline-flex items-center justify-center w-[16px] h-[16px] rounded-full mr-1.5 flex-shrink-0 font-sans font-bold text-[0.56rem]">
                                                ✗
                                            </span>
                                            <span>{r.old}</span>
                                        </span>
                                    </td>
                                    <td
                                        className={`cell-new font-sans text-[0.7rem] leading-[1.4] text-[var(--ds-ink)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]`}
                                    >
                                        <span className="flex items-start">
                                            <span className="icon-check inline-flex items-center justify-center w-[16px] h-[16px] rounded-full mr-1.5 flex-shrink-0 font-sans font-bold text-[0.56rem]">
                                                ✓
                                            </span>
                                            <span>{r.next}</span>
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
