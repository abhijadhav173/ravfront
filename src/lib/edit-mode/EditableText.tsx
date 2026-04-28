"use client";

/**
 * EditableText — wraps a piece of CMS-driven text. In edit mode the rendered
 * element becomes contentEditable; on blur the new text is patched into the
 * EditModeProvider content tree.
 *
 * Usage:
 *   <EditableText path="intro.headline" value={c.headline} />
 *
 * - Outside edit mode: renders `value` rendered through `renderInline()`
 *   (so **emphasis** still styles correctly on the public site).
 * - Inside edit mode: renders the raw `value` text in a contentEditable span
 *   with a subtle blue dashed outline. Authors edit raw text including
 *   `**phrase**` markers; emphasis re-renders only after save+reload.
 *
 * Hover affordance: dashed outline + small "edit" cursor.
 */

import {
    useEffect,
    useRef,
    useState,
    type ElementType,
    type ReactNode,
} from "react";
import { useEditMode } from "./EditModeProvider";
import { renderInline } from "@/lib/site-content/render";

type Props = {
    /** Dot-path into HomeContent, e.g. "intro.headline" or "intro.facts.0" */
    path: string;
    /** Current value of that field */
    value: string;
    /** Element to render when NOT in edit mode (default span) */
    as?: ElementType;
    /** Optional className applied to the rendered element */
    className?: string;
    /** Optional inline-emphasis rendering (default true). Off for things that
     *  shouldn't render `**...**` (e.g., raw image alt text). */
    inline?: boolean;
    /** Multi-line textarea-like behaviour (default false; true for body paragraphs) */
    multiline?: boolean;
    /** Render children as the static-mode content instead of `value`. Used when
     *  caller has a custom renderer. */
    children?: ReactNode;
};

export function EditableText({
    path,
    value,
    as: Tag = "span",
    className = "",
    inline = true,
    multiline = false,
    children,
}: Props) {
    const { enabled, setAt } = useEditMode();
    const ref = useRef<HTMLElement | null>(null);

    // Track text state internally so the contentEditable doesn't fight React.
    // We sync from `value` only when not focused (prevents cursor jumps).
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        if (!ref.current) return;
        if (focused) return;
        if (ref.current.textContent !== value) {
            ref.current.textContent = value;
        }
    }, [enabled, value, focused]);

    if (!enabled) {
        const content = children ?? (inline ? renderInline(value) : value);
        return <Tag className={className}>{content}</Tag>;
    }

    function commit() {
        const newText = ref.current?.textContent ?? "";
        if (newText !== value) {
            setAt(path, newText);
        }
        setFocused(false);
    }

    return (
        <Tag
            ref={ref as never}
            className={`${className} edit-mode-editable ${multiline ? "edit-mode-editable--multi" : ""}`.trim()}
            contentEditable
            suppressContentEditableWarning
            spellCheck
            data-path={path}
            onFocus={() => setFocused(true)}
            onBlur={commit}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (!multiline && e.key === "Enter") {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                }
                if (e.key === "Escape") {
                    e.preventDefault();
                    if (ref.current) ref.current.textContent = value;
                    (e.target as HTMLElement).blur();
                }
            }}
        />
    );
}
