"use client";

/**
 * CalloutSection — admin-added custom block. Pull-quote with attribution.
 * Centered, large italic serif quote, gold attribution.
 */

import { CRevealSection } from "@/components/design-system";
import type { CalloutBlockProps } from "@/lib/site-content";
import { EditableText, FloatingElementsLayer } from "@/lib/edit-mode";

type Props = {
    blockIndex: number;
    zIndex: number;
    id: string;
    content: CalloutBlockProps;
};

export default function CalloutSection({ blockIndex, zIndex, id, content }: Props) {
    const pathPrefix = `customBlocks.${blockIndex}.props`;

    return (
        <CRevealSection
            zIndex={zIndex}
            id={id}
            centerHeader={true}
            contentMaxWidth="900px"
        >
            <FloatingElementsLayer
                decorations={content.decorations ?? []}
                path={`${pathPrefix}.decorations`}
            />
            <div className="text-center px-4">
                <span className="block font-heading text-[3rem] text-ravok-gold leading-none mb-6 select-none">
                    &ldquo;
                </span>
                <EditableText
                    path={`${pathPrefix}.quote`}
                    value={content.quote}
                    as="blockquote"
                    multiline
                    className="font-heading italic font-normal text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.4] text-[var(--ds-ink)] mb-8"
                />
                <EditableText
                    path={`${pathPrefix}.attribution`}
                    value={content.attribution}
                    as="p"
                    className="font-sans text-[0.62rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase"
                />
            </div>
        </CRevealSection>
    );
}
