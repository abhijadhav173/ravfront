"use client";

/**
 * Team — horizontal coin marquee.
 * Per WEBSITE-TECHNICAL-RULES.md §12: team → CRevealSection w/ custom layout.
 *
 * Each member is a Greek-coin (transparent SVG wireframe layered over a
 * sepia-toned circular portrait). Cards scroll horizontally and pause on hover.
 * Cards are duplicated (SET 2 marked aria-hidden) for a seamless loop.
 *
 * Marquee + coin styles live in globals.css under TEAM MARQUEE and COIN.
 */

import { CRevealSection } from "@/components/design-system";

type Member = {
    role: string;
    name: string;
    bio: string;
    photo: string;
};

const members: Member[] = [
    {
        role: "Founder & CEO",
        name: "Amanda Aoki Rak",
        bio: "Packaged 3 feature films across 7+ years in entertainment — now building the venture studio to restructure how they're financed and owned.",
        photo: "/images/team/amanda.jpg",
    },
    {
        role: "Chief of Finance",
        name: "Thibault Dominici",
        bio: "15y+ managing royalties and profit participation at eOne / Lionsgate — ensuring financial accuracy across RAVOK's portfolio.",
        photo: "/images/team/thibault.jpg",
    },
    {
        role: "Board Member / Advisor",
        name: "Lois Ungar",
        bio: "30y+ as a senior finance executive at Disney, DreamWorks, Universal, and Unified Pictures — advising on scaling the studio model.",
        photo: "/images/team/lois.jpg",
    },
    {
        role: "Board Advisor",
        name: "Pye Eshraghian",
        bio: "3x founder with 20+ years across SaaS, finance, and capital markets — advising on SPV infrastructure and capital strategy from 0 → 1.",
        photo: "/images/team/pye.jpg",
    },
];

function CoinMember({ member, ariaHidden = false }: { member: Member; ariaHidden?: boolean }) {
    return (
        <div
            className="team-member flex-none w-[260px] text-center flex flex-col items-center"
            aria-hidden={ariaHidden || undefined}
        >
            <div className="coin">
                <div className="coin-portrait">
                    <img src={member.photo} alt="" />
                </div>
                <img className="coin-frame" src="/images/coins/coin-frame.svg" alt="" aria-hidden="true" />
            </div>
            <div className="member-role font-sans text-[0.52rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-1">
                {member.role}
            </div>
            <div className="member-name font-heading italic text-[1.05rem] leading-[1.15] text-[var(--ds-ink)] mb-1.5">
                {member.name}
            </div>
            <div className="member-bio font-sans text-[0.7rem] leading-[1.5] text-[var(--ds-ink-dim)] max-w-[230px] mx-auto">
                {member.bio}
            </div>
        </div>
    );
}

export default function Team() {
    return (
        <CRevealSection
            zIndex={13}
            id="team"
            centerHeader={true}
            contentMaxWidth="1400px"
        >
            {/* Compact header (smaller than CRevealSection's default header slot) */}
            <div className="text-center mb-6">
                <p className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3">
                    — Who&apos;s building this
                </p>
                <h2 className="font-heading font-normal text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.015em] text-[var(--ds-ink)] mb-2">
                    Built by people who&apos;ve{" "}
                    <em className="text-ravok-gold not-italic font-heading italic">lived the problem</em>.
                </h2>
                <p className="font-heading italic text-[0.85rem] leading-[1.45] text-[var(--ds-ink-dim)] max-w-[520px] mx-auto">
                    Film veterans, finance operators, and platform builders. Advised by executives who&apos;ve shaped the last fifty years of the industry.
                </p>
            </div>
            <div className="team-marquee relative w-full overflow-hidden py-2">
                <div className="team-marquee-inner flex gap-12 w-max">
                    {members.map((m, i) => (
                        <CoinMember key={`s1-${i}`} member={m} />
                    ))}
                    {members.map((m, i) => (
                        <CoinMember key={`s2-${i}`} member={m} ariaHidden />
                    ))}
                </div>
            </div>
        </CRevealSection>
    );
}
