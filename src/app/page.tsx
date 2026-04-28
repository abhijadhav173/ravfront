import { fetchHomeContent } from "@/lib/site-content";
import { PageBody } from "./_components/PageBody";

/**
 * Homepage — Q2 redesign one-pager. Content is CMS-driven.
 *
 * Server-side: fetches latest home content from the API (no-store cache so
 * admin saves show on next request). Falls back to bundled defaults if the
 * backend is unreachable.
 *
 * Client-side: PageBody wraps the section tree in EditModeProvider so admins
 * see an in-page edit experience (click text to type, click image to swap,
 * Save toolbar). Non-admins see no edit affordances.
 */

export const dynamic = "force-dynamic";

export default async function Home() {
    const content = await fetchHomeContent();
    return <PageBody initialContent={content} />;
}
