"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const email = "contact@ravokstudios.com";
const inquiryTypes = [
  { label: "General Inquiries", email },
  { label: "Partnership Inquiries", email },
  { label: "Investor Relations", email },
];

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />

      <section className="min-h-screen flex flex-col justify-center pt-32 pb-24 px-6 lg:px-12">
        <div className="container mx-auto w-full max-w-6xl">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-heading font-thin text-white leading-[1.1] mb-24 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Whether you're a
            <br />
            partner, investor, or
            <br />
            creator—we want to
            <br />
            hear from you.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-xl font-heading font-semibold text-white mb-8">
              Contact Information
            </h2>
            <div className="space-y-6">
              {inquiryTypes.map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="text-ravok-gold font-sans text-sm sm:w-48 shrink-0">
                    {item.label}
                  </span>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-white/70 hover:text-ravok-gold underline underline-offset-2 transition-colors"
                  >
                    {item.email}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
