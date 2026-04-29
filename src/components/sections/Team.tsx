"use client";

/**
 * Team — horizontal coin marquee.
 * Content is CMS-driven and in-page editable. Per-member fields (role, name,
 * bio, photo, linkedin) are individually editable when in edit mode.
 *
 * Marquee animation pauses naturally on hover (CSS), which makes editing
 * feasible. Members are duplicated for the seamless loop; only the first set
 * is editable so admins don't accidentally try to edit a duplicate (the
 * second-set EditableTexts use the same path so changes propagate, but we
 * mark them aria-hidden + tabIndex={-1} so focus skips them).
 */

import { useEffect } from "react";
import { CRevealSection } from "@/components/design-system";
import {
    DEFAULT_HOME_CONTENT,
    type HomeContent,
    type TeamMemberContent,
} from "@/lib/site-content";
import { EditableText, EditableImage, EditableList, FloatingElementsLayer, useEditMode } from "@/lib/edit-mode";

/** The laurel ring is the actual team coin frame. */
const LAUREL_URL =
    "https://pub-0c5b0ff2bc9242ffa0b31812b16adf4e.r2.dev/2026/04/i1swh4tzrnnd.svg";
/** The legacy wireframe path that production data still points at. It's
 *  actually a 1920x810 landscape SVG — never rendered as a real frame. We
 *  treat its presence as "data not migrated yet" and substitute the laurel. */
const LEGACY_WIREFRAME_PATH = "/images/coins/coin-frame.svg";

const NEW_MEMBER_DEFAULT: TeamMemberContent = {
    name: "New Member",
    role: "Role",
    bio: "Bio…",
    photo: "/images/team/amanda.jpg",
    linkedin: "",
};

type TeamProps = {
    content?: HomeContent["team"];
};

function CoinMember({
    member,
    index,
    coinFrame,
    isDuplicate = false,
}: {
    member: TeamMemberContent;
    index: number;
    coinFrame: string;
    isDuplicate?: boolean;
}) {
    const { enabled } = useEditMode();
    const wrapperClass = "team-member flex-none w-[260px] text-center flex flex-col items-center";
    const tabIdx = isDuplicate ? -1 : undefined;

    const card = (
        <>
            <div className="coin">
                {/* Photo: EditableImage wrapper IS the coin-portrait so the
                    edit toolbar (Change/Remove/Transform) appears on hover. */}
                <EditableImage
                    path={`team.members.${index}.photo`}
                    value={member.photo}
                    wrapperClassName="coin-portrait"
                >
                    {(src) => <img src={src} alt="" />}
                </EditableImage>

                {/* Coin frame: separate EditableImage so admins can remove or
                    swap the gold wireframe ring. Path is at the team level
                    (shared across all members) so removing it removes for all. */}
                {!isDuplicate ? (
                    <EditableImage
                        path="team.coinFrame"
                        value={coinFrame}
                        wrapperClassName="coin-frame-wrap"
                    >
                        {(src) => (
                            <img className="coin-frame" src={src} alt="" aria-hidden="true" />
                        )}
                    </EditableImage>
                ) : coinFrame ? (
                    <img className="coin-frame" src={coinFrame} alt="" aria-hidden="true" />
                ) : null}
            </div>
            <EditableText
                path={`team.members.${index}.role`}
                value={member.role}
                as="div"
                inline={false}
                className="member-role font-sans text-[0.52rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-1"
            />
            <EditableText
                path={`team.members.${index}.name`}
                value={member.name}
                as="div"
                inline={false}
                className="member-name font-heading italic text-[1.05rem] leading-[1.15] text-[var(--ds-ink)] mb-1.5"
            />
            <EditableText
                path={`team.members.${index}.bio`}
                value={member.bio}
                as="div"
                inline={false}
                multiline
                className="member-bio font-sans text-[0.7rem] leading-[1.5] text-[var(--ds-ink-dim)] max-w-[230px] mx-auto"
            />
            {enabled && (
                <EditableText
                    path={`team.members.${index}.linkedin`}
                    value={member.linkedin}
                    as="div"
                    inline={false}
                    className="font-mono text-[0.6rem] text-[var(--ds-ink-muted)] mt-2 max-w-[230px] mx-auto"
                />
            )}
        </>
    );

    // Outside edit mode: live anchor if linkedin exists; otherwise plain div.
    if (!enabled && member.linkedin) {
        return (
            <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={wrapperClass}
                aria-hidden={isDuplicate || undefined}
                tabIndex={tabIdx}
            >
                {card}
            </a>
        );
    }

    return (
        <div className={wrapperClass} aria-hidden={isDuplicate || undefined}>
            {card}
        </div>
    );
}

export default function Team({ content }: TeamProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.team;
    const { enabled, setAt } = useEditMode();

    // Auto-fallback: production data still has the legacy 16:9 wireframe SVG
    // path stored as coinFrame, plus stale 450/75 scales tuned for that
    // (broken) asset. When detected, we substitute the laurel + sane scales
    // at render time so admins immediately see the right frame regardless of
    // what's in the DB. The data itself migrates on first save.
    const isLegacyData = c.coinFrame === LEGACY_WIREFRAME_PATH;
    const effectiveCoinFrame = isLegacyData ? LAUREL_URL : (c.coinFrame || LAUREL_URL);
    const frameScale = isLegacyData ? 130 : (c.coinFrameScale ?? 130);
    const portraitScale = isLegacyData ? 58 : (c.coinPortraitScale ?? 58);

    // Belt-and-braces: also write the migration to the DB on admin mount so
    // future loads (and the public site) see the laurel without relying on
    // this fallback. Idempotent — bails if already migrated.
    useEffect(() => {
        if (!enabled) return;
        if (!isLegacyData) return;
        const cleanedDecorations = (c.decorations ?? []).filter(
            (d) => (d as { src?: string }).src !== LAUREL_URL
        );
        const nextTeam = {
            ...c,
            coinFrame: LAUREL_URL,
            coinFrameScale: 130,
            coinPortraitScale: 58,
            decorations: cleanedDecorations,
        };
        // eslint-disable-next-line no-console
        console.log("[team-auto-migrate] writing laurel patch", nextTeam);
        setAt("team", nextTeam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, isLegacyData]);
    const teamCSSVars = {
        ["--coin-frame-scale" as string]: `${frameScale}%`,
        ["--coin-portrait-scale" as string]: `${portraitScale}%`,
    } as React.CSSProperties;

    return (
        <CRevealSection zIndex={13} id="team" centerHeader={true} contentMaxWidth="1400px">
            <div style={teamCSSVars}>
            {/* Section-level layer.
             *  - In edit mode: shows ALL decorations so admin can manage them
             *    (the marquee isn't rendered in edit mode, so without this
             *    marquee-target decorations would be invisible).
             *  - In production: shows only section-target decorations.
             *    Marquee-target decorations render inside team-marquee-inner. */}
            <FloatingElementsLayer
                decorations={c.decorations ?? []}
                path="team.decorations"
                targetFilter={enabled ? undefined : "section"}
            />
            <div className="text-center mb-6">
                <EditableText
                    path="team.eyebrow"
                    value={c.eyebrow}
                    as="p"
                    className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3"
                />
                <EditableText
                    path="team.headline"
                    value={c.headline}
                    as="h2"
                    className="font-heading font-normal text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.015em] text-[var(--ds-ink)] mb-2"
                />
                <EditableText
                    path="team.lead"
                    value={c.lead}
                    as="p"
                    multiline
                    inline={false}
                    className="font-heading italic text-[0.85rem] leading-[1.45] text-[var(--ds-ink-dim)] max-w-[520px] mx-auto"
                />
            </div>

            {enabled && (
                <div className="text-center">
                    <div className="team-frame-controls" role="group" aria-label="Team frame sizing">
                        <label>
                            Frame size
                            <input
                                type="range"
                                min={50}
                                max={600}
                                step={5}
                                value={frameScale}
                                onChange={(e) => setAt("team.coinFrameScale", Number(e.target.value))}
                            />
                            <span className="team-frame-controls-value">{frameScale}%</span>
                        </label>
                        <label>
                            Photo size
                            <input
                                type="range"
                                min={30}
                                max={100}
                                step={1}
                                value={portraitScale}
                                onChange={(e) => setAt("team.coinPortraitScale", Number(e.target.value))}
                            />
                            <span className="team-frame-controls-value">{portraitScale}%</span>
                        </label>
                        <button
                            type="button"
                            className="team-frame-install-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                const laurelUrl =
                                    "https://pub-0c5b0ff2bc9242ffa0b31812b16adf4e.r2.dev/2026/04/i1swh4tzrnnd.svg";
                                // Single atomic patch — replaces the whole team
                                // object so all four field changes apply together.
                                // Avoids any chance of split-state / stale-closure
                                // collisions between consecutive setAt calls.
                                const cleaned = (c.decorations ?? []).filter(
                                    (d) => (d as { src?: string }).src !== laurelUrl
                                );
                                const nextTeam = {
                                    ...c,
                                    coinFrame: laurelUrl,
                                    coinFrameScale: 130,
                                    coinPortraitScale: 58,
                                    decorations: cleaned,
                                };
                                console.log("[install-laurel] patching team", nextTeam);
                                setAt("team", nextTeam);
                            }}
                            title="Swap the coin frame to the laurel ring + tune the scales + remove the orphan decoration"
                        >
                            ⚘ Use laurel as frame
                        </button>
                    </div>
                </div>
            )}

            {enabled ? (
                /* Edit mode: static grid so admins can drag/remove/add without
                   the marquee animation pulling things out from under them. */
                <div data-decoration-zone="marquee">
                <EditableList
                    arrayPath="team.members"
                    items={c.members}
                    defaultNewItem={NEW_MEMBER_DEFAULT}
                    addLabel="Add team member"
                    as="div"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
                    renderItem={(m, i) => (
                        <CoinMember member={m} index={i} coinFrame={effectiveCoinFrame} />
                    )}
                />
                </div>
            ) : (
                /* Production: scrolling coin marquee.
                 * Marquee-target decorations live inside team-marquee-inner so
                 * they translate with the coins. We render them TWICE (once
                 * native, once shifted +50%) so the seamless-loop wraparound
                 * also applies to decorations — same trick as the duplicate
                 * coin set. */
                <div className="team-marquee relative w-full overflow-hidden py-2">
                    <div className="team-marquee-inner flex gap-12 w-max relative">
                        <FloatingElementsLayer
                            decorations={c.decorations ?? []}
                            path="team.decorations"
                            targetFilter="marquee"
                        />
                        {c.members.map((m, i) => (
                            <CoinMember key={`s1-${i}`} member={m} index={i} coinFrame={effectiveCoinFrame} />
                        ))}
                        <FloatingElementsLayer
                            decorations={c.decorations ?? []}
                            path="team.decorations"
                            targetFilter="marquee"
                            duplicate
                        />
                        {c.members.map((m, i) => (
                            <CoinMember
                                key={`s2-${i}`}
                                member={m}
                                index={i}
                                coinFrame={effectiveCoinFrame}
                                isDuplicate
                            />
                        ))}
                    </div>
                </div>
            )}
            </div>
        </CRevealSection>
    );
}
