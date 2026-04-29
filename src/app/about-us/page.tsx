/**
 * /about-us — CMS-driven page (migrated from static in #76 part 2/3).
 *
 * Server fetches AboutUsPageContent from site_content slug "about-us".
 * Falls back to bundled DEFAULT_ABOUT_US_PAGE if the row hasn't been
 * created yet (first admin save persists).
 */

import {
    fetchGenericPage,
    DEFAULT_ABOUT_US_PAGE,
    type AboutUsPageContent,
} from "@/lib/site-content";
import AboutUsPageBody from "./_components/AboutUsPageBody";

export const dynamic = "force-dynamic";

export default async function AboutUs() {
    const fetched = await fetchGenericPage("about-us");
    const content: AboutUsPageContent =
        (fetched as unknown as AboutUsPageContent) ?? DEFAULT_ABOUT_US_PAGE;
    return <AboutUsPageBody initialContent={content} />;
}
