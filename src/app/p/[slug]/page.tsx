import { notFound } from "next/navigation";
import { fetchGenericPage } from "@/lib/site-content";
import GenericPageBody from "@/app/_components/GenericPageBody";

/**
 * /p/[slug] — generic admin-created page.
 *
 * Pages live in the site_content table keyed by slug. Content is a
 * GenericPageContent shape: { title, metaDescription?, customBlocks }.
 * Renders as a stack of custom blocks, no fixed sections.
 *
 * Returns 404 if the slug doesn't exist.
 */

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const content = await fetchGenericPage(slug);
    if (!content) return { title: "Not found" };
    return {
        title: content.title || slug,
        description: content.metaDescription,
    };
}

export default async function GenericPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const content = await fetchGenericPage(slug);
    if (!content) notFound();
    return <GenericPageBody slug={slug} initialContent={content} />;
}
