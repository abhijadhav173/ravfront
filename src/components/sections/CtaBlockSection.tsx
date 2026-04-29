"use client";

/**
 * CtaBlockSection — admin-added custom block. Centered eyebrow + heading
 * + body + a row of CTAs. Used as a closing call to action or mid-page break.
 */

import { CRevealSection, Button } from "@/components/design-system";
import type { CtaBlockProps, Cta } from "@/lib/site-content";
import { EditableText, EditableList, FloatingElementsLayer } from "@/lib/edit-mode";

const NEW_CTA_DEFAULT: Cta = { label: "Click here", href: "#", variant: "secondary" };

type Props = {
    blockIndex: number;
    zIndex: number;
    id: string;
    content: CtaBlockProps;
};

export default function CtaBlockSection({ blockIndex, zIndex, id, content }: Props) {
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
            <div className="text-center">
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
                    className="font-heading font-normal text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-5"
                />
                <EditableText
                    path={`${pathPrefix}.body`}
                    value={content.body}
                    as="p"
                    multiline
                    className="font-sans text-[1rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[560px] mx-auto mb-8"
                />
                <EditableList
                    arrayPath={`${pathPrefix}.ctas`}
                    items={content.ctas}
                    defaultNewItem={NEW_CTA_DEFAULT}
                    addLabel="Add CTA"
                    as="div"
                    className="flex flex-wrap items-center justify-center gap-3"
                    renderItem={(cta, i) => (
                        <Button href={cta.href} variant={cta.variant}>
                            <EditableText
                                path={`${pathPrefix}.ctas.${i}.label`}
                                value={cta.label}
                                inline={false}
                            />
                        </Button>
                    )}
                />
            </div>
        </CRevealSection>
    );
}
