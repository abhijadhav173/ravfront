"use client";

import { FadeIn } from "@/components/shared/FadeIn";

export default function QuoteSection() {
    return (
        <section className="bg-[#1c1c1a] py-32 px-6 flex flex-col items-center justify-center section-card relative">
            {/* Gold top fade — C-reveal landing */}
            <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-[rgba(196,149,58,0.06)] to-transparent pointer-events-none" />
            <FadeIn>
                <div className="max-w-4xl mx-auto border-2 border-ravok-gold p-12 lg:p-16 text-center relative rounded-lg">
                    <h3 className="text-2xl lg:text-3xl font-heading leading-relaxed text-ravok-beige mb-6">
                        “What if we funded creators the way VCs fund founders?
                        What if films were structured like startups—with equity,
                        governance, and long-term thinking?”
                    </h3>
                    <p className="text-ravok-gold text-lg tracking-wider font-sans">
                        -Amanda Aoki, Founder.
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.3}>
                <p className="text-center text-ravok-slate/60 text-sm tracking-[0.3em] uppercase mt-12">
                    That's exactly what we built.
                </p>
            </FadeIn>
        </section>
    );
}
