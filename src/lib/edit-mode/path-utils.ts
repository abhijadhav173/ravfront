/**
 * Tiny lodash.set / lodash.get equivalents for path-based content updates.
 *
 * Path syntax: dot-separated keys with array indices, e.g. "intro.facts.0".
 *
 * We avoid pulling lodash for two functions; this lib is small enough.
 */

export type Path = string;

export function getAtPath<T = unknown>(obj: unknown, path: Path): T | undefined {
    const parts = path.split(".");
    let cur: unknown = obj;
    for (const p of parts) {
        if (cur == null || typeof cur !== "object") return undefined;
        cur = (cur as Record<string, unknown>)[p];
    }
    return cur as T | undefined;
}

/**
 * Returns a NEW object with `value` set at `path`. Original is untouched.
 * Creates intermediate objects/arrays as needed (object if next key is non-numeric,
 * array if numeric).
 */
export function setAtPath<T extends object>(obj: T, path: Path, value: unknown): T {
    const parts = path.split(".");
    if (parts.length === 0) return obj;

    function recurse(node: unknown, idx: number): unknown {
        const key = parts[idx];
        const isLast = idx === parts.length - 1;

        if (isLast) {
            if (Array.isArray(node)) {
                const next = node.slice();
                next[Number(key)] = value;
                return next;
            }
            return { ...(node as object), [key]: value };
        }

        const nextKey = parts[idx + 1];
        const nextIsArrayIdx = /^\d+$/.test(nextKey);
        const child =
            node && typeof node === "object" && key in (node as Record<string, unknown>)
                ? (node as Record<string, unknown>)[key]
                : nextIsArrayIdx
                ? []
                : {};

        const updatedChild = recurse(child, idx + 1);

        if (Array.isArray(node)) {
            const next = node.slice();
            next[Number(key)] = updatedChild;
            return next;
        }
        return { ...(node as object), [key]: updatedChild };
    }

    return recurse(obj, 0) as T;
}
