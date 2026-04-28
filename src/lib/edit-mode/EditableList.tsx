"use client";

/**
 * EditableList — adds drag-to-reorder + remove + add affordances around any
 * list rendering. Outside edit mode it's a transparent pass-through (just
 * renders the children). Inside edit mode each item gets a row of micro
 * controls (drag handle, remove) and an "+ Add" button appears under the list.
 *
 * The caller still controls how each item renders (so existing visual layouts
 * are preserved). EditableList only adds chrome.
 *
 * Drag-and-drop uses native HTML5 DnD (no library) — drag the handle, drop
 * onto another item to swap positions.
 *
 * Usage:
 *   <EditableList
 *     arrayPath="intro.facts"
 *     items={c.facts}
 *     defaultNewItem=""
 *     renderItem={(fact, i) => <li>...</li>}
 *   />
 */

import { useState, type ReactNode } from "react";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { useEditMode } from "./EditModeProvider";

type Props<T> = {
    /** Dot-path of the array in HomeContent (e.g. "intro.facts") */
    arrayPath: string;
    /** Current items in the list */
    items: T[];
    /** Renders a single item; index is the item's position */
    renderItem: (item: T, index: number) => ReactNode;
    /** Default value for a newly-added item */
    defaultNewItem: T;
    /** Optional className on the outer wrapper */
    className?: string;
    /** Optional element type for the wrapper (default div). */
    as?: keyof React.JSX.IntrinsicElements;
    /** Optional label shown next to + Add button */
    addLabel?: string;
    /** If true, the controls row sits ABOVE the item instead of right of it.
     *  Useful for vertical lists where horizontal space is tight. */
    controlsAbove?: boolean;
};

export function EditableList<T>({
    arrayPath,
    items,
    renderItem,
    defaultNewItem,
    className = "",
    as = "div",
    addLabel = "Add item",
    controlsAbove = false,
}: Props<T>) {
    const { enabled, pushAt, removeAt, moveAt } = useEditMode();
    // In edit mode the outer wrapper must be a block-level container (we add
    // <div className="edit-mode-list-item"> children which can't validly nest
    // inside <ul>/<ol>). Out of edit mode we keep the caller-requested
    // element so the public site stays semantic.
    const Tag = (enabled ? "div" : as) as keyof React.JSX.IntrinsicElements;
    const [dragFrom, setDragFrom] = useState<number | null>(null);

    if (!enabled) {
        // Pass-through: caller renders items themselves; we don't add chrome.
        return (
            <Tag className={className}>
                {items.map((item, i) => (
                    <ItemFragment key={i}>{renderItem(item, i)}</ItemFragment>
                ))}
            </Tag>
        );
    }

    return (
        <Tag className={className}>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={`edit-mode-list-item ${
                        controlsAbove ? "edit-mode-list-item--vertical" : ""
                    }`}
                    onDragOver={(e) => {
                        if (dragFrom !== null && dragFrom !== i) e.preventDefault();
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (dragFrom === null || dragFrom === i) return;
                        moveAt(arrayPath, dragFrom, i);
                        setDragFrom(null);
                    }}
                >
                    <div className="edit-mode-list-controls">
                        <button
                            type="button"
                            className="edit-mode-list-handle"
                            draggable
                            onDragStart={(e) => {
                                setDragFrom(i);
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", String(i));
                            }}
                            onDragEnd={() => setDragFrom(null)}
                            title="Drag to reorder"
                            aria-label={`Reorder item ${i + 1}`}
                        >
                            <GripVertical className="w-3 h-3" />
                        </button>
                        <button
                            type="button"
                            className="edit-mode-list-remove"
                            onClick={() => {
                                if (confirm("Remove this item?")) removeAt(arrayPath, i);
                            }}
                            title="Remove"
                            aria-label={`Remove item ${i + 1}`}
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="edit-mode-list-content">{renderItem(item, i)}</div>
                </div>
            ))}
            <button
                type="button"
                className="edit-mode-list-add"
                onClick={() => pushAt(arrayPath, defaultNewItem)}
            >
                <Plus className="w-3.5 h-3.5" />
                <span>{addLabel}</span>
            </button>
        </Tag>
    );
}

/** Renders item content as-is (no extra wrapper element). Children must be a
 *  single valid React element. */
function ItemFragment({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
