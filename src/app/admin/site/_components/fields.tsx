"use client";

/**
 * Reusable form field primitives for the Site Editor (CMS MVP).
 *
 * Plain Tailwind-styled inputs, no third-party form library — the editor
 * is small enough that React's useState is enough.
 */

import { ALL_IMAGES, IMAGE_MANIFEST } from "@/lib/site-content/image-manifest";
import { Trash2, Plus } from "lucide-react";

const labelClass = "block font-sans text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-white/60 mb-1.5";
const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-ravok-gold/60 focus:bg-white/8 transition-colors";
const helpClass = "mt-1 text-[0.65rem] text-white/40 italic";

export function TextField({
    label,
    value,
    onChange,
    placeholder,
    help,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    help?: string;
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                type="text"
                className={inputClass}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {help && <p className={helpClass}>{help}</p>}
        </div>
    );
}

export function TextareaField({
    label,
    value,
    onChange,
    rows = 4,
    placeholder,
    help,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    rows?: number;
    placeholder?: string;
    help?: string;
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <textarea
                className={`${inputClass} resize-y font-mono text-[0.85rem] leading-[1.5]`}
                value={value}
                rows={rows}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {help && <p className={helpClass}>{help}</p>}
        </div>
    );
}

export function ImagePicker({
    label,
    value,
    onChange,
    help,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    help?: string;
}) {
    const knownPaths = ALL_IMAGES;
    const isCustom = value && !knownPaths.includes(value);

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-20 h-20 rounded-md border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                    {value ? (
                        <img src={value} alt="" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <span className="text-[0.6rem] text-white/30 uppercase tracking-wider">none</span>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <select
                        className={inputClass}
                        value={isCustom ? "__custom__" : value}
                        onChange={(e) => {
                            if (e.target.value === "__custom__") return;
                            onChange(e.target.value);
                        }}
                    >
                        <option value="">— None —</option>
                        {Object.entries(IMAGE_MANIFEST).map(([group, items]) => (
                            <optgroup key={group} label={group.charAt(0).toUpperCase() + group.slice(1)}>
                                {items.map((path) => (
                                    <option key={path} value={path}>
                                        {path}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                        {isCustom && (
                            <option value="__custom__">{value} (custom)</option>
                        )}
                    </select>
                    <input
                        type="text"
                        className={`${inputClass} text-[0.78rem] font-mono`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="/images/... (or paste a custom path)"
                    />
                </div>
            </div>
            {help && <p className={helpClass}>{help}</p>}
        </div>
    );
}

export function StringListField({
    label,
    value,
    onChange,
    addLabel = "Add item",
    placeholder,
    help,
}: {
    label: string;
    value: string[];
    onChange: (v: string[]) => void;
    addLabel?: string;
    placeholder?: string;
    help?: string;
}) {
    function update(i: number, v: string) {
        const next = [...value];
        next[i] = v;
        onChange(next);
    }
    function add() {
        onChange([...value, ""]);
    }
    function remove(i: number) {
        onChange(value.filter((_, idx) => idx !== i));
    }

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="space-y-2">
                {value.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                        <input
                            type="text"
                            className={inputClass}
                            value={item}
                            onChange={(e) => update(i, e.target.value)}
                            placeholder={placeholder}
                        />
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-md border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-colors text-white/50"
                            aria-label="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={add}
                    className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.15em] uppercase text-ravok-gold/80 hover:text-ravok-gold font-semibold px-3 py-1.5 border border-ravok-gold/30 hover:border-ravok-gold/60 rounded-md transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    {addLabel}
                </button>
            </div>
            {help && <p className={helpClass}>{help}</p>}
        </div>
    );
}

export function SectionPanel({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <details
            className="border border-white/10 rounded-lg bg-white/[0.02] open:bg-white/[0.04] transition-colors"
            open
        >
            <summary className="cursor-pointer px-5 py-4 flex items-center justify-between hover:bg-white/[0.03]">
                <div>
                    <div className="font-heading text-[1.05rem] text-white">{title}</div>
                    {description && (
                        <div className="font-sans text-[0.75rem] text-white/50 mt-0.5">{description}</div>
                    )}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-wider">edit</div>
            </summary>
            <div className="px-5 pb-5 pt-2 space-y-4 border-t border-white/5">{children}</div>
        </details>
    );
}

export function EmphasisHelp() {
    return (
        <p className="text-[0.65rem] text-white/40 italic">
            Use <code className="text-ravok-gold/80">**phrase**</code> to mark a phrase for gold-italic emphasis on the live site.
        </p>
    );
}
