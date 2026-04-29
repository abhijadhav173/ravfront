/**
 * /about-us — CMS-driven page (migrated from static in #76 part 2/3).
 *
 * Server fetches AboutUsPageContent from site_content slug "about-us".
 * Falls back to bundled DEFAULT_ABOUT_US_PAGE if the row hasn't been
 * created yet (first admin save persists).
 *
 * design-cms-v2: also fetches `home` content for the team data — the
 * homepage's Team section moved here, but the team data lives in the
 * `home` slug as the single source of truth (so editing a member's bio
 * on /about-us writes back to the home content where Team JSON canonically
 * lives, ready for V3 revival).
 */

import {
    fetchGenericPage,
    fetchHomeContent,
    fetchNavbarContent,
    DEFAULT_ABOUT_US_PAGE,
    DEFAULT_HOME_CONTENT,
    DEFAULT_NAVBAR,
    type AboutUsPageContent,
} from "@/lib/site-content";
import AboutUsPageBody from "./_components/AboutUsPageBody";

export const dynamic = "force-dynamic";

export default async function AboutUs() {
    const [fetched, navbar, home] = await Promise.all([
        fetchGenericPage("about-us"),
        fetchNavbarContent(),
        fetchHomeContent(),
    ]);
    const content: AboutUsPageContent =
        (fetched as unknown as AboutUsPageContent) ?? DEFAULT_ABOUT_US_PAGE;
    const team = home?.team ?? DEFAULT_HOME_CONTENT.team;
    return (
        <AboutUsPageBody
            initialContent={content}
            navbar={navbar ?? DEFAULT_NAVBAR}
            team={team}
        />
    );
}
