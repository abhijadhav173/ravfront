"use client";

/**
 * Partners — Who We Build With.
 * Sticky CRevealSection with a horizontal MARQUEE of partner stone cards
 * (matches the sample's `.team` pattern). Auto-scrolls via CSS animation;
 * pauses on hover so people can read.
 *
 * Architecture: sticky single section (NOT scrollytell) so it participates
 * fully in the C-ladder cover-from-below flip. Fits in viewport height.
 */

import { Video, DollarSign, Monitor, User, Mail, LucideIcon } from "lucide-react";
import { CRevealSection, StoneCard } from "@/components/design-system";

type PartnerData = {
    type: string;
    icon: LucideIcon;
    desc: string;
    bring: string;
    get: string;
};

const partners: PartnerData[] = [
    {
        type: "Co-Producers",
        icon: Video,
        desc: "Experienced producers who want equity in creator-driven ventures.",
        bring: "Packaging expertise, talent relationships, production knowledge.",
        get: "Equity positions, producing credits, portfolio diversification.",
    },
    {
        type: "Financiers",
        icon: DollarSign,
        desc: "Capital partners who see the creator economy opportunity.",
        bring: "Smart capital, patient approach, industry understanding.",
        get: "Portfolio exposure across multiple ventures, transparent structures, creative + financial upside.",
    },
    {
        type: "Distribution Partners",
        icon: Monitor,
        desc: "Streamers, sales agents, distributors seeking original IP.",
        bring: "Distribution pathways, market access, festival relationships.",
        get: "First-look at creator-owned IP, festival-positioned projects, franchise potential.",
    },
    {
        type: "Operational Partners",
        icon: User,
        desc: "Operators, attorneys, strategists who want to build institutions.",
        bring: "COO bandwidth, legal expertise, marketing strategy, finance operations.",
        get: "Equity, ground-floor involvement, meaningful impact.",
    },
];

// Duplicate the list so the marquee loops seamlessly (we translate by -50%).
const marqueeCards = [...partners, ...partners];

export default function Partners() {
    return (
        <CRevealSection
            id="investors"
            zIndex={15}
            eyebrow="To scale this model, we need the right partners."
            headline={
                <>
                    The Future of Media
                    <br />
                    <span className="text-[var(--ds-ink)]">Won&apos;t Be Built by Gatekeepers.</span>
                </>
            }
            lead="It will be built by creators, partners, and investors who believe ownership matters."
            contentMaxWidth="1400px"
        >
            {/* Horizontal marquee — auto-scrolls, pauses on hover */}
            <div className="partners-marquee relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-8 mt-4">
                <div className="partners-marquee-track flex gap-6 lg:gap-8 w-max">
                    {marqueeCards.map((p, i) => {
                        const Icon = p.icon;
                        return (
                            <StoneCard
                                key={i}
                                className="!flex-none !w-[340px] lg:!w-[380px] !min-h-[320px] !p-7"
                                aria-hidden={i >= partners.length}
                            >
                                <Icon className="w-7 h-7 text-[var(--ds-stone-gold)] mb-4" />
                                <h3 className="font-heading text-[1.4rem] leading-tight text-[var(--ds-stone-ink)] mb-3">
                                    {p.type}
                                </h3>
                                <p className="text-[0.88rem] leading-relaxed mb-5">{p.desc}</p>
                                <div className="space-y-3 pt-3 border-t border-[rgba(26,23,19,0.12)]">
                                    <div>
                                        <h4 className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-1">
                                            Bring
                                        </h4>
                                        <p className="text-[0.78rem] leading-[1.5] text-[rgba(26,23,19,0.7)]">{p.bring}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-1">
                                            Get
                                        </h4>
                                        <p className="text-[0.78rem] leading-[1.5] text-[rgba(26,23,19,0.7)]">{p.get}</p>
                                    </div>
                                </div>
                            </StoneCard>
                        );
                    })}
                </div>
            </div>

            {/* Email contact strip */}
            <div className="mt-10 max-w-[900px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-[rgba(15,15,13,0.5)] backdrop-blur-sm border-y border-[var(--ds-border)] px-8 py-6">
                <Mail className="w-6 h-6 text-ravok-gold flex-shrink-0" />
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <span className="font-sans text-[0.85rem] text-[var(--ds-ink-dim)] whitespace-nowrap">
                        Questions? Email us at:
                    </span>
                    <a
                        href="mailto:contact@ravokstudios.com"
                        className="font-heading text-lg lg:text-xl text-ravok-gold hover:text-[var(--ds-ink)] transition-colors break-all sm:break-normal"
                    >
                        contact@ravokstudios.com
                    </a>
                </div>
            </div>
        </CRevealSection>
    );
}
