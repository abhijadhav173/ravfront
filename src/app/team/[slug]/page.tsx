"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";

const TEAM_MEMBERS: Record<string, {
  name: string;
  role: string;
  image: string;
  bio: string[];
  background: string;
}> = {
  amanda: {
    name: "Amanda Aoki Rak",
    role: "CEO & Founder",
    image: "/images/team/amanda.jpg",
    bio: [
      "Amanda founded RAVOK Studios after experiencing firsthand the entertainment industry's exploitative practices. Moving from Brazil to Los Angeles on an acting scholarship, she quickly recognized the fundamental gaps in how projects are legally protected and financed.",
      "She taught herself to code and developed deep expertise in venture structures, leading to her vision of applying startup methodology to film production. RAVOK treats each project as an independent venture, giving creators real equity and ownership.",
      "Under her leadership, RAVOK has structured its first portfolio of film ventures, developed proprietary technology products, and assembled a team of industry veterans who share the mission of rebuilding entertainment infrastructure.",
    ],
    background: "Former actress turned entrepreneur. Self-taught developer. Over a decade of deep involvement in fan communities that informed her understanding of audience building and engagement.",
  },
  thibault: {
    name: "Thibault Dominici",
    role: "CFO",
    image: "/images/team/thibault.jpg",
    bio: [
      "Thibault brings financial expertise to RAVOK's venture studio model, ensuring that every SPV is structured for both creator protection and investor returns.",
      "His work encompasses financial modeling, fund administration, and the development of transparent profit participation structures that set RAVOK apart from traditional production companies.",
    ],
    background: "Finance professional with experience in venture capital and entertainment industry financial structures.",
  },
  lois: {
    name: "Lois Ungar",
    role: "Strategic Advisor",
    image: "/images/team/lois.png",
    bio: [
      "Lois Ungar brings decades of executive experience from Disney and DreamWorks to RAVOK's advisory board. Her deep understanding of studio operations and content strategy provides invaluable guidance as RAVOK builds its portfolio.",
      "As a strategic advisor, she helps shape RAVOK's approach to development, distribution partnerships, and talent relationships.",
    ],
    background: "Former Disney and DreamWorks executive with extensive experience in content development and studio operations.",
  },
  pye: {
    name: "Pye Eshraghian",
    role: "Board Advisor",
    image: "/images/team/pye.jpg",
    bio: [
      "Pye brings a unique perspective to RAVOK's board, combining business acumen with strategic insight to help guide the company's growth trajectory.",
    ],
    background: "Experienced business advisor and board member.",
  },
};

export default function TeamMemberPage() {
  const params = useParams();
  const slug = params.slug as string;
  const member = TEAM_MEMBERS[slug];

  if (!member) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-6 pt-32 pb-24 text-center">
          <h1 className="font-heading text-4xl text-white mb-4">Team Member Not Found</h1>
          <Link href="/about-us" className="font-sans text-ravok-gold hover:text-ravok-beige transition-colors">
            ← Back to About Us
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/about-us"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-ravok-slate hover:text-ravok-gold transition-colors mb-12"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to About Us
          </Link>
        </motion.div>

        {/* Hero */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-16 items-start mb-16">
          {/* Photo */}
          <motion.div
            className="mx-auto lg:mx-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-full p-1 ring-2 ring-ravok-gold ring-offset-4 ring-offset-black shadow-[0_0_48px_rgba(169,129,71,0.12)]">
              <div className="w-60 h-60 rounded-full overflow-hidden bg-white/10 flex items-center justify-center relative">
                <span className="w-full h-full flex items-center justify-center text-ravok-gold/60 font-heading text-6xl">
                  {member.name.charAt(0)}
                </span>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ravok-slate mb-2">
              {member.role}
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">
              {member.name}
            </h1>
            <div className="h-0.5 w-16 bg-ravok-gold mb-8" />

            {member.bio.map((paragraph, i) => (
              <p key={i} className="font-sans text-base text-gray-300 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>

        {/* Background */}
        <motion.div
          className="border-t border-white/10 pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl text-ravok-gold mb-4">Background</h2>
          <p className="font-sans text-base text-gray-300 leading-relaxed max-w-3xl">
            {member.background}
          </p>
        </motion.div>

        {/* Other team members */}
        <motion.div
          className="mt-20 border-t border-white/10 pt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl text-white mb-8">Other Team Members</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {Object.entries(TEAM_MEMBERS)
              .filter(([key]) => key !== slug)
              .map(([key, m]) => (
                <Link
                  key={key}
                  href={`/team/${key}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-ravok-gold/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center relative shrink-0">
                    <span className="text-ravok-gold/60 font-heading text-lg">{m.name.charAt(0)}</span>
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover absolute inset-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div>
                    <p className="font-heading text-white group-hover:text-ravok-gold transition-colors">{m.name}</p>
                    <p className="font-sans text-xs text-ravok-slate">{m.role}</p>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
