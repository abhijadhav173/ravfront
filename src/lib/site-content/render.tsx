import { Fragment, ReactNode } from "react";

/**
 * Renders text with `**emphasis**` markers as JSX, wrapping each marked phrase
 * in a gold-italic <em>. Anything outside `**...**` is plain text.
 *
 * Example:
 *   renderInline("Film is uninvestable. **Until now.**")
 *   → ["Film is uninvestable. ", <em>Until now.</em>]
 *
 * Newline (\n) becomes <br/> so authored copy with line breaks renders cleanly.
 */
export function renderInline(text: string | undefined | null, key?: string | number): ReactNode {
    if (!text) return null;

    // Tokenize: split on **...** while preserving the markers as their own tokens.
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return (
        <Fragment key={key}>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    const inner = part.slice(2, -2);
                    return (
                        <em
                            key={i}
                            className="text-ravok-gold not-italic font-heading italic"
                        >
                            {withLineBreaks(inner)}
                        </em>
                    );
                }
                return <Fragment key={i}>{withLineBreaks(part)}</Fragment>;
            })}
        </Fragment>
    );
}

function withLineBreaks(text: string): ReactNode {
    if (!text.includes("\n")) return text;
    const lines = text.split("\n");
    return lines.map((line, i) => (
        <Fragment key={i}>
            {line}
            {i < lines.length - 1 ? <br /> : null}
        </Fragment>
    ));
}
