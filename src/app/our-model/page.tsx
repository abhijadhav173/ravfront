/**
 * /our-model — CMS-driven page (migrated from static in #76 part 3/3).
 *
 * Server fetches OurModelPageContent from site_content slug "our-model".
 * Falls back to bundled DEFAULT_OUR_MODEL_PAGE if the row hasn't been
 * created yet (first admin save persists).
 */

import {
    fetchGenericPage,
    fetchNavbarContent,
    DEFAULT_OUR_MODEL_PAGE,
    DEFAULT_NAVBAR,
    type OurModelPageContent,
} from "@/lib/site-content";
import OurModelPageBody from "./_components/OurModelPageBody";

export const dynamic = "force-dynamic";

export default async function OurModel() {
    const [fetched, navbar] = await Promise.all([
        fetchGenericPage("our-model"),
        fetchNavbarContent(),
    ]);
    const content: OurModelPageContent =
        (fetched as unknown as OurModelPageContent) ?? DEFAULT_OUR_MODEL_PAGE;
    return <OurModelPageBody initialContent={content} navbar={navbar ?? DEFAULT_NAVBAR} />;
}
