"use client";

/**
 * Team — horizontal coin marquee. Content (members + coin frame asset) is CMS-driven.
 * Marquee + coin styles live in globals.css under TEAM MARQUEE and COIN.
 */

import { CRevealSection } from "@/components/design-system";
import {
    DEFAULT_HOME_CONTENT,
    renderInline,
    type HomeContent,
    type TeamMemberContent,
} from "@/lib/site-content";

type TeamProps = {
    content?: HomeContent["team"];
};

function CoinMember({
    member,
    coinFrame,
    ariaHidden = false,
}: {
    member: TeamMemberContent;
    coinFrame: string;
    ariaHidden?: boolean;
}) {
    const card = (
        <>
            <div className="coin">
                <div className="coin-portrait">
                    <img src={member.photo} alt="" />
                </div>
                <img className="coin-frame" src={coinFrame} alt="" aria-hidden="true" />
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
        </>
    );

    const wrapperClass = "team-member flex-none w-[260px] text-center flex flex-col items-center";

    if (member.linkedin) {
        return (
            <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={wrapperClass}
                aria-hidden={ariaHidden || undefined}
                tabIndex={ariaHidden ? -1 : undefined}
            >
                {card}
            </a>
        );
    }

    return (
        <div className={wrapperClass} aria-hidden={ariaHidden || undefined}>
            {card}
        </div>
    );
}

export default function Team({ content }: TeamProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.team;

    return (
        <CRevealSection zIndex={13} id="team" centerHeader={true} contentMaxWidth="1400px">
            <div className="text-center mb-6">
                <p className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3">
                    {c.eyebrow}
                </p>
                <h2 className="font-heading font-normal text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.015em] text-[var(--ds-ink)] mb-2">
                    {renderInline(c.headline)}
                </h2>
                <p className="font-heading italic text-[0.85rem] leading-[1.45] text-[var(--ds-ink-dim)] max-w-[520px] mx-auto">
                    {c.lead}
                </p>
            </div>
            <div className="team-marquee relative w-full overflow-hidden py-2">
                <div className="team-marquee-inner flex gap-12 w-max">
                    {c.members.map((m, i) => (
                        <CoinMember key={`s1-${i}`} member={m} coinFrame={c.coinFrame} />
                    ))}
                    {c.members.map((m, i) => (
                        <CoinMember key={`s2-${i}`} member={m} coinFrame={c.coinFrame} ariaHidden />
                    ))}
                </div>
            </div>
        </CRevealSection>
    );
}
