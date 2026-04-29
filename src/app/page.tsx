import { fetchHomeContent, fetchNavbarContent, DEFAULT_NAVBAR } from "@/lib/site-content";
import { PageBody } from "./_components/PageBody";

/**
 * Homepage — Q2 redesign one-pager. Content is CMS-driven.
 *
 * Server-side: fetches latest home content + navbar content from the API
 * (no-store cache so admin saves show on next request). Falls back to
 * bundled defaults when the backend is unreachable or rows don't exist.
 */

export const dynamic = "force-dynamic";

export default async function Home() {
    const [content, navbar] = await Promise.all([
        fetchHomeContent(),
        fetchNavbarContent(),
    ]);
    return <PageBody initialContent={content} navbar={navbar ?? DEFAULT_NAVBAR} />;
}
