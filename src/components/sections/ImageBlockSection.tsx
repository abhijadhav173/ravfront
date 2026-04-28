"use client";

/**
 * ImageBlockSection — admin-added custom block (v8). Full-width or
 * constrained image with optional caption. Decorations supported just like
 * core sections.
 *
 * Path scheme: each instance has a unique id. Editable paths reference
 * `customBlocks.${blockIndex}.props.<field>` so updates mutate the right
 * element in the customBlocks array.
 */

import { CRevealSection } from "@/components/design-system";
import type { ImageBlockProps } from "@/lib/site-content";
import { EditableText, EditableImage, FloatingElementsLayer } from "@/lib/edit-mode";

type Props = {
    /** Index of this block in the HomeContent.customBlocks array */
    blockIndex: number;
    /** z-index slot in the C-ladder */
    zIndex: number;
    /** Anchor id for in-page navigation */
    id: string;
    /** Block content */
    content: ImageBlockProps;
};

export default function ImageBlockSection({
    blockIndex,
    zIndex,
    id,
    content,
}: Props) {
    const pathPrefix = `customBlocks.${blockIndex}.props`;

    return (
        <CRevealSection
            zIndex={zIndex}
            id={id}
            centerHeader={true}
            contentMaxWidth={content.fullBleed ? "100%" : "1300px"}
        >
            <FloatingElementsLayer
                decorations={content.decorations ?? []}
                path={`${pathPrefix}.decorations`}
            />
            <div className="flex flex-col items-center gap-6">
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
                            className="w-full max-h-[80vh] object-contain"
                            style={transformStyle}
                            aria-hidden="true"
                        />
                    )}
                </EditableImage>
                {(content.caption || true) && (
                    <EditableText
                        path={`${pathPrefix}.caption`}
                        value={content.caption}
                        as="p"
                        className="font-heading italic text-[0.95rem] text-[var(--ds-ink-dim)] max-w-[640px] text-center"
                    />
                )}
            </div>
        </CRevealSection>
    );
}
