import { Hero, IntroSection, Bridge, Portfolio, Team } from "@/components/sections";
import Footer from "@/components/layout/Footer";
import { fetchHomeContent } from "@/lib/site-content";

/**
 * Homepage — Q2 redesign one-pager. Content is CMS-driven.
 *
 * Fetches `home` content server-side at request time (no-store cache so admin
 * edits show immediately on next request). Each section receives its slice
 * via props. If the backend is unreachable, sections fall back to the
 * hard-coded DEFAULT_HOME_CONTENT and the homepage still renders.
 */

export const dynamic = "force-dynamic";

export default async function Home() {
    const content = await fetchHomeContent();

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
