"use client";

/**
 * /admin/site — homepage content editor (CMS MVP).
 *
 * Loads the current home content from the backend on mount, hands it to
 * SiteEditorClient. Editor handles save/reload/dirty-state on its own.
 */

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    DEFAULT_HOME_CONTENT,
    fetchHomeContentForAdmin,
    type HomeContent,
} from "@/lib/site-content";
import { SiteEditorClient } from "./_components/SiteEditorClient";

export default function AdminSitePage() {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchHomeContentForAdmin()
            .then((c) => {
                if (!cancelled) setContent(c);
            })
            .catch((err) => {
                if (cancelled) return;
                // Fall back to defaults so admin can still work even if backend
                // hasn't run the seeder yet — saving will create the row.
                console.warn("Failed to fetch site content; falling back to defaults", err);
                setContent(DEFAULT_HOME_CONTENT);
                setError(err instanceof Error ? err.message : "unknown error");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!content) {
        return (
            <div className="flex items-center gap-3 text-white/60 py-12">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-sans text-sm">Loading site content…</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <header className="space-y-1">
                <h1 className="font-heading text-2xl text-white">Site Editor</h1>
                <p className="font-sans text-sm text-white/60">
                    Edit the homepage copy and swap images. Changes are live after Save.
                </p>
                {error && (
                    <p className="font-sans text-[0.75rem] text-amber-400">
                        Backend unreachable; showing defaults. Saving will create a fresh content row. ({error})
                    </p>
                )}
            </header>
            <SiteEditorClient initialContent={content} />
        </div>
    );
}
