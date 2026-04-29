"use client";

/**
 * TwoColumnSection — admin-added custom block. Image on one side + text on
 * the other. `imagePosition` controls which side the image sits on.
 */

import { CRevealSection } from "@/components/design-system";
import type { TwoColumnBlockProps } from "@/lib/site-content";
import { EditableText, EditableImage, FloatingElementsLayer } from "@/lib/edit-mode";

type Props = {
    blockIndex: number;
    zIndex: number;
    id: string;
    content: TwoColumnBlockProps;
};

export default function TwoColumnSection({ blockIndex, zIndex, id, content }: Props) {
    const pathPrefix = `customBlocks.${blockIndex}.props`;
    const imageOnLeft = content.imagePosition === "left";

    const imageEl = (
        <div className="relative flex items-center justify-center">
            <EditableImage
                path={`${pathPrefix}.image`}
                value={content.image}
                transformPath={`${pathPrefix}.imageTransform`}
                transform={content.imageTransform}
            >
                {(src, transformStyle) => (
                    <img
                        src={src}
                        alt=""
                        className="w-full h-auto max-h-[60vh] object-contain"
                        style={transformStyle}
                        aria-hidden="true"
                    />
                )}
            </EditableImage>
        </div>
    );

    const textEl = (
        <div>
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
                className="font-heading font-normal text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-5"
            />
            <EditableText
                path={`${pathPrefix}.body`}
                value={content.body}
                as="p"
                multiline
                className="font-sans text-[1rem] leading-[1.6] text-[var(--ds-ink-dim)] max-w-[540px]"
            />
        </div>
    );

    return (
        <CRevealSection
            zIndex={zIndex}
            id={id}
            centerHeader={false}
            contentMaxWidth="1300px"
        >
            <FloatingElementsLayer
                decorations={content.decorations ?? []}
                path={`${pathPrefix}.decorations`}
            />
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {imageOnLeft ? (
                    <>
                        {imageEl}
                        {textEl}
                    </>
                ) : (
                    <>
                        {textEl}
                        {imageEl}
                    </>
                )}
            </div>
        </CRevealSection>
    );
}
