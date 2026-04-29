"use client";

/**
 * RichTextSection — admin-added custom block. Eyebrow + heading + body.
 * Body supports `**emphasis**` markers; renderInline handles them on the
 * public site. Optional center alignment.
 */

import { CRevealSection } from "@/components/design-system";
import type { RichTextBlockProps } from "@/lib/site-content";
import { EditableText, FloatingElementsLayer } from "@/lib/edit-mode";

type Props = {
    blockIndex: number;
    zIndex: number;
    id: string;
    content: RichTextBlockProps;
};

export default function RichTextSection({ blockIndex, zIndex, id, content }: Props) {
    const pathPrefix = `customBlocks.${blockIndex}.props`;
    const align = content.align ?? "left";

    return (
        <CRevealSection
            zIndex={zIndex}
            id={id}
            centerHeader={align === "center"}
            contentMaxWidth="900px"
        >
            <FloatingElementsLayer
                decorations={content.decorations ?? []}
                path={`${pathPrefix}.decorations`}
            />
            <div className={align === "center" ? "text-center" : ""}>
                <EditableText
                    path={`${pathPrefix}.eyebrow`}
                    value={content.eyebrow}
                    as="p"
                    className="font-sans text-[0.62rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-4"
                />
                <EditableText
                    path={`${pathPrefix}.heading`}
                    value={content.heading}
                    as="h2"
                    className="font-heading font-normal text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-6"
                />
                <EditableText
                    path={`${pathPrefix}.body`}
                    value={content.body}
                    as="p"
                    multiline
                    className="font-sans text-[1rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[680px] mx-auto"
                />
            </div>
        </CRevealSection>
    );
}
