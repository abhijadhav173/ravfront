/**
 * /about-us — CMS-driven page (migrated from static in #76 part 2/3).
 *
 * Server fetches AboutUsPageContent from site_content slug "about-us".
 * Falls back to bundled DEFAULT_ABOUT_US_PAGE if the row hasn't been
 * created yet (first admin save persists).
 */

import {
    fetchGenericPage,
    fetchNavbarContent,
    DEFAULT_ABOUT_US_PAGE,
    DEFAULT_NAVBAR,
    type AboutUsPageContent,
} from "@/lib/site-content";
import AboutUsPageBody from "./_components/AboutUsPageBody";

export const dynamic = "force-dynamic";

export default async function AboutUs() {
    const [fetched, navbar] = await Promise.all([
        fetchGenericPage("about-us"),
        fetchNavbarContent(),
    ]);
    const content: AboutUsPageContent =
        (fetched as unknown as AboutUsPageContent) ?? DEFAULT_ABOUT_US_PAGE;
    return <AboutUsPageBody initialContent={content} navbar={navbar ?? DEFAULT_NAVBAR} />;
}
