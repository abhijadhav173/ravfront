import Navbar from "@/components/layout/Navbar";
import { Hero, IntroSection, Philosophy, QuoteSection, VentureModel, Offerings, Partners } from "@/components/sections";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-ravok-gold selection:text-black">
      <Navbar />
      <Hero />
      <IntroSection />

      {/* Stacking Sections Container — C-reveal: each section rises and covers the one before */}
      <div className="relative">
        <div className="sticky top-0 z-10"><Philosophy /></div>
        <div className="sticky top-0 z-20"><QuoteSection /></div>
        <div className="sticky top-0 z-30"><VentureModel /></div>
        <div className="sticky top-0 z-40"><Offerings /></div>
        <div className="sticky top-0 z-50"><Partners /></div>
        <div className="relative z-[60]"><Footer /></div>
      </div>
    </main>
  );
}
