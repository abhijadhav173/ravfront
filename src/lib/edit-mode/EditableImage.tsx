"use client";

/**
 * EditableImage — wraps an image whose `src` lives in CMS content.
 *
 * Outside edit mode: renders a plain <img> (or whatever element you nest as
 * children) with the given src.
 *
 * Inside edit mode: same image, plus a hover overlay button at the top-right.
 * Clicking the button opens a modal picker showing every file in the static
 * image manifest. Picking one writes the new path into context at `path`.
 */

import { useState, type CSSProperties, type ReactNode } from "react";
import { ImagePlus, X } from "lucide-react";
import { IMAGE_MANIFEST } from "@/lib/site-content/image-manifest";
import { useEditMode } from "./EditModeProvider";

type Props = {
    /** Dot-path into HomeContent that holds the image src */
    path: string;
    /** Current image src */
    value: string;
    /** Alt text for the rendered image */
    alt?: string;
    /** Optional className for the rendered <img> */
    className?: string;
    /** Optional inline style for the <img> */
    style?: CSSProperties;
    /** If true, render aria-hidden on the image (decorative). Default true. */
    decorative?: boolean;
    /** If provided, overrides the default <img> rendering. Useful when the
     *  image is wrapped in a special container (e.g. coin frame). */
    children?: (src: string) => ReactNode;
};

export function EditableImage({
    path,
    value,
    alt = "",
    className,
    style,
    decorative = true,
    children,
}: Props) {
    const { enabled, setAt } = useEditMode();
    const [pickerOpen, setPickerOpen] = useState(false);

    const rendered =
        children !== undefined ? (
            children(value)
        ) : (
            <img
                src={value}
                alt={alt}
                className={className}
                style={style}
                aria-hidden={decorative ? true : undefined}
            />
        );

    if (!enabled) return <>{rendered}</>;

    return (
        <span className="edit-mode-image-wrap">
            {rendered}
            <button
                type="button"
                className="edit-mode-image-edit-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPickerOpen(true);
                }}
                aria-label="Change image"
            >
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Change</span>
            </button>
            {pickerOpen && (
                <ImagePickerModal
                    current={value}
                    onClose={() => setPickerOpen(false)}
                    onPick={(picked) => {
                        setAt(path, picked);
                        setPickerOpen(false);
                    }}
                />
            )}
        </span>
    );
}

function ImagePickerModal({
    current,
    onClose,
    onPick,
}: {
    current: string;
    onClose: () => void;
    onPick: (path: string) => void;
}) {
    const [customPath, setCustomPath] = useState("");

    return (
        <div className="edit-mode-modal-backdrop" onClick={onClose}>
            <div
                className="edit-mode-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Pick an image"
            >
                <div className="edit-mode-modal-header">
                    <h3>Change image</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="edit-mode-modal-close"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="edit-mode-modal-body">
                    {Object.entries(IMAGE_MANIFEST).map(([group, items]) => (
                        <div key={group} className="edit-mode-image-group">
                            <div className="edit-mode-image-group-label">{group}</div>
                            <div className="edit-mode-image-grid">
                                {items.map((src) => (
                                    <button
                                        key={src}
                                        type="button"
                                        className={`edit-mode-image-tile ${
                                            src === current ? "is-current" : ""
                                        }`}
                                        onClick={() => onPick(src)}
                                        title={src}
                                    >
                                        <img src={src} alt="" />
                                        <span className="edit-mode-image-tile-label">
                                            {src.split("/").pop()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="edit-mode-image-custom">
                        <label>
                            Or paste a custom path:
                            <input
                                type="text"
                                value={customPath}
                                onChange={(e) => setCustomPath(e.target.value)}
                                placeholder="/images/..."
                            />
                        </label>
                        <button
                            type="button"
                            disabled={!customPath.trim()}
                            onClick={() => onPick(customPath.trim())}
                        >
                            Use custom path
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
