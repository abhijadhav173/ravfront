"use client";

/**
 * Footer — CMS-driven (v11).
 *
 * Reads `content.footer` if passed; falls back to hard-coded defaults
 * (matching the prior in-place Footer copy) when not. Editable in-page:
 *   - logoImage (Change/Remove via EditableImage)
 *   - linkGroups: each group's title + each link's label + href
 *   - socialLinks: per-icon URL
 *   - copyright text
 *   - email address (visually hidden in this layout but editable via /admin)
 *
 * Backwards-compat: if old data only has the flat `links[]`, it is
 * shown as a single column titled "Links".
 */

import { Instagram, Linkedin, Facebook, Twitter, ArrowUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DEFAULT_HOME_CONTENT, type HomeContent, type FooterSocialIcon } from "@/lib/site-content";
import { EditableText, EditableImage, FloatingElementsLayer } from "@/lib/edit-mode";

type FooterProps = { content?: HomeContent["footer"] };

export default function Footer({ content }: FooterProps = {}) {
    const f = content ?? DEFAULT_HOME_CONTENT.footer;

    // Resolve link groups: prefer linkGroups; fall back to flat links[] under one column
    const groups =
        f.linkGroups && f.linkGroups.length > 0
            ? f.linkGroups
            : f.links.length > 0
            ? [{ title: "Links", links: f.links }]
            : [];

    const socials = f.socialLinks ?? [];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <footer
            id="contact"
            className="bg-[var(--ds-bg)] text-[var(--ds-ink)] border-t border-[var(--ds-border)] font-sans relative"
        >
            <FloatingElementsLayer
                decorations={f.decorations ?? []}
                path="footer.decorations"
            />

            <div className="flex flex-col lg:flex-row min-h-[400px] relative z-10">
                {/* Background image */}
                {f.backgroundImage && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <EditableImage
                            path="footer.backgroundImage"
                            value={f.backgroundImage}
                            wrapperClassName="absolute inset-0"
                        >
                            {(src) => (
                                <img
                                    src={src}
                                    alt="Partners Background"
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                                />
                            )}
                        </EditableImage>
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ds-bg)] via-[rgba(28,28,26,0.8)] to-transparent" />
                    </div>
                )}

                {/* Logo */}
                <motion.div
                    className="w-full lg:w-[35%] border-r border-[var(--ds-border)] flex items-center justify-center p-12 lg:p-0 relative z-10"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/" className="group">
                        {f.logoImage ? (
                            <EditableImage path="footer.logoImage" value={f.logoImage}>
                                {(src) => (
                                    <motion.img
                                        src={src}
                                        alt="RAVOK"
                                        className="h-16 lg:h-24 w-auto object-contain opacity-80"
                                        whileHover={{ opacity: 1, scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </EditableImage>
                        ) : (
                            <EditableText
                                path="footer.logoText"
                                value={f.logoText}
                                as="span"
                                className="font-heading italic text-[2rem]"
                            />
                        )}
                    </Link>
                </motion.div>

                {/* Right side */}
                <motion.div
                    className="w-full lg:w-[65%] p-12 lg:p-24 relative z-10 flex flex-col justify-between"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8"
                        style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(4, groups.length || 1))}, minmax(0, 1fr))` }}
                    >
                        {groups.map((group, gi) => (
                            <motion.div key={gi} className="space-y-6" variants={itemVariants}>
                                <EditableText
                                    path={
                                        f.linkGroups && f.linkGroups.length > 0
                                            ? `footer.linkGroups.${gi}.title`
                                            : `footer.linkGroups.0.title`
                                    }
                                    value={group.title}
                                    as="h4"
                                    className="text-ravok-gold text-xl font-heading tracking-wide"
                                />
                                <nav className="flex flex-col space-y-4 text-sm text-[var(--ds-ink-dim)] font-light tracking-wide">
                                    {group.links.map((link, li) => (
                                        <Link
                                            key={li}
                                            href={link.href}
                                            className="group relative inline-block w-fit"
                                        >
                                            <span className="group-hover:text-[var(--ds-ink)] transition-colors duration-300">
                                                <EditableText
                                                    path={`footer.linkGroups.${gi}.links.${li}.label`}
                                                    value={link.label}
                                                    inline={false}
                                                />
                                            </span>
                                            <motion.span className="absolute -bottom-1 left-0 w-0 h-px bg-ravok-gold group-hover:w-full transition-all duration-300" />
                                        </Link>
                                    ))}
                                </nav>
                                {gi === groups.length - 1 && socials.length > 0 && (
                                    <>
                                        <h4 className="text-ravok-gold text-xl font-heading tracking-wide pt-4">
                                            Follow Us
                                        </h4>
                                        <div className="flex gap-4">
                                            {socials.map((s, i) => (
                                                <motion.a
                                                    key={i}
                                                    href={s.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--ds-ink-dim)]"
                                                    whileHover={{ scale: 1.2, color: "var(--color-ravok-gold)", rotate: 5 }}
                                                    transition={{ duration: 0.2 }}
                                                    aria-label={s.icon}
                                                >
                                                    <SocialIcon icon={s.icon} />
                                                </motion.a>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="absolute bottom-12 right-12 lg:right-24 z-10"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <motion.button
                            onClick={scrollToTop}
                            className="w-10 h-10 rounded-full border border-[var(--ds-border-strong)] flex items-center justify-center group bg-[rgba(28,28,26,0.2)] backdrop-blur-sm"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Scroll to top"
                        >
                            <div className="w-1.5 h-1.5 bg-[var(--ds-ink)] rounded-full group-hover:bg-ravok-gold transition-colors" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Copyright bar */}
            <motion.div
                className="border-t border-[var(--ds-border)] py-6 text-center relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <EditableText
                    path="footer.copyright"
                    value={f.copyright}
                    as="p"
                    className="text-[10px] text-[var(--ds-ink-muted)] font-sans tracking-widest uppercase"
                />
            </motion.div>

            {/* Floating scroll-to-top */}
            <motion.div
                className="fixed bottom-4 right-4 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <motion.button
                    onClick={scrollToTop}
                    className="w-10 h-10 bg-[rgba(232,228,218,0.08)] backdrop-blur-sm border border-[var(--ds-border-strong)] flex items-center justify-center rounded-full"
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(169, 129, 71, 0.2)",
                        borderColor: "var(--color-ravok-gold)",
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowUp className="w-4 h-4" />
                </motion.button>
            </motion.div>
        </footer>
    );
}

function SocialIcon({ icon }: { icon: FooterSocialIcon }) {
    const className = "w-5 h-5";
    switch (icon) {
        case "instagram":
            return <Instagram className={className} />;
        case "linkedin":
            return <Linkedin className={className} />;
        case "facebook":
            return <Facebook className={className} />;
        case "twitter":
            return <Twitter className={className} />;
    }
}
