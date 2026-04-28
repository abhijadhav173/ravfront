"use client";

/**
 * EditModeProvider — context for the in-page Canva-style editor.
 *
 * Holds:
 *   - enabled:     is the page currently in edit mode?
 *   - content:     the live (mutable) HomeContent
 *   - setAt(path): patch any field by dot-path
 *   - save / discard / dirty
 *   - isAdmin:     whether the current user is an admin (drives the toggle pill)
 *
 * Strategy:
 *   - Server renders the homepage with `initialContent`.
 *   - Provider hydrates with that as both `content` and `savedContent`.
 *   - Edit mode swaps text to contentEditable and shows image-swap overlays.
 *   - Save POSTs to /api/admin/site/content/home (existing endpoint).
 *   - On success, savedContent updates → dirty becomes false.
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";
import {
    saveHomeContent,
    type HomeContent,
} from "@/lib/site-content";
import { getStoredUser } from "@/lib/api/base";
import { setAtPath, type Path } from "./path-utils";

type EditModeContextValue = {
    enabled: boolean;
    setEnabled: (v: boolean) => void;

    content: HomeContent;
    setAt: (path: Path, value: unknown) => void;

    isAdmin: boolean;
    dirty: boolean;
    saving: boolean;

    save: () => Promise<void>;
    discard: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function useEditMode(): EditModeContextValue {
    const ctx = useContext(EditModeContext);
    if (!ctx) {
        // Allow components to render outside an EditModeProvider — they just
        // get a no-op view. This way EditableText/Image work on /admin/site
        // form preview too if we want, without crashing.
        return {
            enabled: false,
            setEnabled: () => {},
            content: {} as HomeContent,
            setAt: () => {},
            isAdmin: false,
            dirty: false,
            saving: false,
            save: async () => {},
            discard: () => {},
        };
    }
    return ctx;
}

export function EditModeProvider({
    initialContent,
    children,
}: {
    initialContent: HomeContent;
    children: ReactNode;
}) {
    const [enabled, setEnabled] = useState(false);
    const [content, setContent] = useState<HomeContent>(initialContent);
    const [savedContent, setSavedContent] = useState<HomeContent>(initialContent);
    const [saving, setSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Detect admin status client-side (localStorage). Run once on mount.
    useEffect(() => {
        const u = getStoredUser();
        setIsAdmin(u?.role === "admin");
    }, []);

    const dirty = useMemo(
        () => JSON.stringify(content) !== JSON.stringify(savedContent),
        [content, savedContent]
    );

    const setAt = useCallback((path: Path, value: unknown) => {
        setContent((prev) => setAtPath(prev, path, value));
    }, []);

    const save = useCallback(async () => {
        setSaving(true);
        try {
            const persisted = await saveHomeContent(content);
            setContent(persisted);
            setSavedContent(persisted);
            toast.success("Saved.");
        } catch (err) {
            toast.error("Save failed: " + (err instanceof Error ? err.message : "unknown"));
            throw err;
        } finally {
            setSaving(false);
        }
    }, [content]);

    const discard = useCallback(() => {
        if (dirty && !confirm("Discard unsaved changes?")) return;
        setContent(savedContent);
    }, [dirty, savedContent]);

    // Warn before navigating away with unsaved changes
    useEffect(() => {
        if (!dirty) return;
        function beforeUnload(e: BeforeUnloadEvent) {
            e.preventDefault();
            e.returnValue = "";
        }
        window.addEventListener("beforeunload", beforeUnload);
        return () => window.removeEventListener("beforeunload", beforeUnload);
    }, [dirty]);

    const value: EditModeContextValue = useMemo(
        () => ({
            enabled,
            setEnabled,
            content,
            setAt,
            isAdmin,
            dirty,
            saving,
            save,
            discard,
        }),
        [enabled, content, setAt, isAdmin, dirty, saving, save, discard]
    );

    return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}
