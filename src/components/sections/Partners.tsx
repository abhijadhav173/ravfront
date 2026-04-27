"use client";

/**
 * Partners — partner-types scrollytell (4 steps).
 * Per rules §12: "Process / how-it-works (3–6)" → ScrollytellSection.
 * Each partner type gets a full 100vh moment.
 */

import { Video, DollarSign, Monitor, User, Mail, LucideIcon } from "lucide-react";
import { ScrollytellSection, StoneCard } from "@/components/design-system";

type Partner = {
    type: string;
    icon: LucideIcon;
    desc: string;
    bring: string;
    get: string;
};

const partners: Partner[] = [
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

export default function Partners() {
    return (
        <>
            <ScrollytellSection
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
                steps={partners.map((p, i) => ({
                    label: `${String(i + 1).padStart(2, "0")} / ${String(partners.length).padStart(2, "0")}`,
                    content: <PartnerStage partner={p} />,
                }))}
            />

            {/* Email contact strip — separate sticky cap on top of the scrollytell chain */}
            <div className="sticky top-0 z-[16] section-card bg-[var(--ds-bg)] py-24 px-10"
                 style={{
                    backgroundImage: [
                        "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                        "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
                        "linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    ].join(", "),
                    backgroundSize: "100% 100%, 80px 80px, 80px 80px",
                 }}
            >
                <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-[rgba(15,15,13,0.5)] backdrop-blur-sm border-y border-[var(--ds-border)] px-8 py-8">
                    <Mail className="w-7 h-7 text-ravok-gold flex-shrink-0" />
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <span className="font-sans text-[0.95rem] text-[var(--ds-ink-dim)] whitespace-nowrap">
                            Questions? Email us at:
                        </span>
                        <a
                            href="mailto:contact@ravokstudios.com"
                            className="font-heading text-xl lg:text-2xl text-ravok-gold hover:text-[var(--ds-ink)] transition-colors break-all sm:break-normal"
                        >
                            contact@ravokstudios.com
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

function PartnerStage({ partner }: { partner: Partner }) {
    const Icon = partner.icon;
    return (
        <div className="max-w-[820px] mx-auto">
            <StoneCard className="!p-10 lg:!p-14">
                <Icon className="w-10 h-10 text-[var(--ds-stone-gold)] mb-5" />
                <h3 className="font-heading text-[1.85rem] lg:text-[2.2rem] leading-tight text-[var(--ds-stone-ink)] mb-4">
                    {partner.type}
                </h3>
                <p className="text-[1.05rem] leading-[1.6] mb-8">{partner.desc}</p>
                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-[rgba(26,23,19,0.12)]">
                    <div>
                        <h4 className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-2">
                            What you bring
                        </h4>
                        <p className="text-[0.92rem] leading-[1.55] text-[rgba(26,23,19,0.7)]">{partner.bring}</p>
                    </div>
                    <div>
                        <h4 className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-2">
                            What you get
                        </h4>
                        <p className="text-[0.92rem] leading-[1.55] text-[rgba(26,23,19,0.7)]">{partner.get}</p>
                    </div>
                </div>
            </StoneCard>
        </div>
    );
}
