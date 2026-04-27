import { Hero, IntroSection, Bridge, Portfolio, Team } from "@/components/sections";
import Footer from "@/components/layout/Footer";

/**
 * Homepage — Q2 redesign one-pager.
 *
 * Section sequence (per WEBSITE-TECHNICAL-RULES.md §12):
 *   Hero          → 2a Hero (entry only — wordmark + tagline + scroll cue)
 *   IntroSection  → 2c C-Reveal (about + statue + facts + CTAs)
 *   Bridge        → 2c C-Reveal (REITs analogy + Hollywood-vs-RAVOK comparison)
 *   Portfolio     → 2b Scrollytell (4 pillars: Film SPVs / Meris / Delphi / Phema)
 *   Team          → 2c C-Reveal (Greek-coin marquee)
 *   Footer        → standard
 *
 * No Navbar — this is a one-pager. /about-us and /our-model still exist as
 * routes but are no longer linked from the homepage.
 *
 * C-ladder z-indexes are owned by each section primitive via the `zIndex` prop.
 */

export default function Home() {
    return (
        <main
            className="min-h-screen text-white selection:bg-ravok-gold selection:text-black"
            style={{ overflowX: "clip" }}
        >
            <Hero />
            <IntroSection />
            <Bridge />
            <Portfolio />
            <Team />
            <div className="relative z-[60]">
                <Footer />
            </div>
        </main>
    );
}
