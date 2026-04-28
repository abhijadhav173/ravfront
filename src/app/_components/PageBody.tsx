"use client";

/**
 * PageBody — client-side wrapper around the homepage content tree.
 *
 * Why this exists:
 *   - The homepage is a server component that fetches `HomeContent` once.
 *   - Edit mode is a CLIENT concern (contentEditable, localStorage admin
 *     check, save state). So we wrap the section tree in a client component
 *     that owns the EditModeProvider.
 *   - Sections still receive their content as props (decoupled), but this
 *     wrapper reads from the provider's live state, so when an admin edits a
 *     field the section re-renders with the new value immediately.
 *
 * Out of edit mode this is a transparent pass-through: sections render with
 * the server-fetched initialContent.
 */

import { useEffect } from "react";
import { Hero, IntroSection, Bridge, Portfolio, Team } from "@/components/sections";
import Footer from "@/components/layout/Footer";
import {
    EditModeProvider,
    EditModeOverlay,
    useEditMode,
} from "@/lib/edit-mode";
import type { HomeContent } from "@/lib/site-content";

export function PageBody({ initialContent }: { initialContent: HomeContent }) {
    return (
        <EditModeProvider initialContent={initialContent}>
            <BodyClassToggle />
            <Sections />
            <EditModeOverlay />
        </EditModeProvider>
    );
}

/** Reads the live content from context and renders the section tree. */
function Sections() {
    const { content } = useEditMode();
    return (
        <main
            className="min-h-screen text-white selection:bg-ravok-gold selection:text-black"
            style={{ overflowX: "clip" }}
        >
            <Hero content={content.hero} />
            <IntroSection content={content.intro} />
            <Bridge content={content.bridge} />
            <Portfolio content={content.portfolio} />
            <Team content={content.team} />
            <div className="relative z-[60]">
                <Footer />
            </div>
        </main>
    );
}

/** Adds .edit-mode-active to <body> when edit mode is on (drives toolbar
 *  spacing CSS in globals.css). */
function BodyClassToggle() {
    const { enabled } = useEditMode();
    useEffect(() => {
        const cls = "edit-mode-active";
        if (enabled) document.body.classList.add(cls);
        else document.body.classList.remove(cls);
        return () => document.body.classList.remove(cls);
    }, [enabled]);
    return null;
}
