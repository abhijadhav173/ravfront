"use client";

/**
 * Offerings — Portfolio / pillars (3 steps).
 * Per rules §12: "Process / how-it-works (3–6 steps)" → ScrollytellSection.
 * Each pillar gets a full 100vh moment with statue + stone card detail.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollytellSection, StoneCard } from "@/components/design-system";

type Offering = {
    title: string;
    description: string;
    footer: string;
    stats: string;
    statueIndex: number;
};

const offerings: Offering[] = [
    {
        title: "Film Ventures",
        description:
            "Each film project is launched as a Special Purpose Vehicle (SPV)—a standalone company that we co-found and incorporate with the creative partner. Ravok deploys pre-seed development capital to complete packaging and attract external financing. This creates creator-driven cinema structured for commercial success while maintaining artistic integrity.",
        footer: "Projects",
        stats: "4 in development, 1 financing",
        statueIndex: 1,
    },
    {
        title: "Production Labels",
        description:
            "We build the next generation of IP engines by developing and managing specialized production subsidiaries. These subsidiaries are designed to function as repeatable venture pipelines, continuously spinning up new SPVs. Each label focuses on a specific genre or audience niche, eliminating single-project risk.",
        footer: "Divisions",
        stats: "4 active labels",
        statueIndex: 2,
    },
    {
        title: "Tech Ventures",
        description:
            "Our dedicated Tech Ventures pillar is where we incubate, incorporate, and scale proprietary technology companies. This infrastructure is designed to eliminate traditional media gatekeepers and give creators direct relationships with their audiences, capturing first-party data that de-risks every future venture.",
        footer: "Ventures",
        stats: "3 in development, 1 in validation",
        statueIndex: 3,
    },
];

export default function Offerings() {
    return (
        <ScrollytellSection
            zIndex={14}
            eyebrow="Our 2025 slate proves the model works."
            headline={
                <>
                    Here&apos;s what we offer
                    <br />
                    <em className="not-italic font-heading text-ravok-gold text-[0.7em]">All Structured for Success.</em>
                </>
            }
            lead="Three pillars. Each one a standalone entity with creator ownership, GTM, legal entity set, initial backing, and strategic partners attached."
            steps={offerings.map((offer, i) => ({
                label: `${String(i + 1).padStart(2, "0")} / ${String(offerings.length).padStart(2, "0")}`,
                content: <OfferingStage offer={offer} />,
            }))}
        />
    );
}

function OfferingStage({ offer }: { offer: Offering }) {
    return (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center max-w-[1200px] mx-auto">
            {/* Left — statue */}
            <div className="flex justify-center">
                <img
                    src={`/images/${offer.statueIndex}.png`}
                    alt=""
                    className="h-[40vh] lg:h-[50vh] w-auto object-contain opacity-90"
                />
            </div>
            {/* Right — stone card */}
            <StoneCard
                label={offer.footer}
                title={offer.title}
                footer={
                    <div className="flex justify-between items-center">
                        <span>{offer.footer}</span>
                        <span className="text-[var(--ds-stone-ink)]">{offer.stats}</span>
                    </div>
                }
                className="!p-10"
            >
                <p className="text-[1rem] leading-[1.6] mb-6">{offer.description}</p>
                <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(26,23,19,0.2)] bg-transparent px-6 py-[0.85rem] font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--ds-stone-ink)] transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:bg-[var(--ds-stone-ink)] hover:text-[var(--ds-stone-bg)] hover:-translate-y-px"
                >
                    Contact us <ArrowRight className="w-3 h-3" />
                </Link>
            </StoneCard>
        </div>
    );
}
