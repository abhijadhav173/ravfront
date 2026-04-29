/**
 * /our-model — CMS-driven page (migrated from static in #76 part 3/3).
 *
 * Server fetches OurModelPageContent from site_content slug "our-model".
 * Falls back to bundled DEFAULT_OUR_MODEL_PAGE if the row hasn't been
 * created yet (first admin save persists).
 */

import {
    fetchGenericPage,
    DEFAULT_OUR_MODEL_PAGE,
    type OurModelPageContent,
} from "@/lib/site-content";
import OurModelPageBody from "./_components/OurModelPageBody";

export const dynamic = "force-dynamic";

export default async function OurModel() {
    const fetched = await fetchGenericPage("our-model");
    const content: OurModelPageContent =
        (fetched as unknown as OurModelPageContent) ?? DEFAULT_OUR_MODEL_PAGE;
    return <OurModelPageBody initialContent={content} />;
}
