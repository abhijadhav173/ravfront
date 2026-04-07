/**
 * RAVOK Studios — Typography System
 * Reflects the ACTUAL fonts and scale used on production (main branch).
 *
 * Fonts loaded in layout.tsx via next/font/google:
 *   Cormorant Garamond (--font-cormorant) → font-heading
 *   Kanit (--font-kanit) → body default
 *   Instrument Sans (--font-instrument) → font-sans
 */

export const fontFamilies = {
  heading: 'var(--font-cormorant)',  // Cormorant Garamond — all headings, quotes
  body: 'var(--font-kanit)',         // Kanit — base body text
  sans: 'var(--font-instrument)',    // Instrument Sans — UI, eyebrows, body copy
} as const;

/**
 * Typography scale — Tailwind classes used consistently across main.
 * Use these as reference when building new pages.
 */
export const typeScale = {
  /** Hero / section main headings */
  display: 'text-5xl lg:text-7xl font-heading',
  /** Sub-section headings */
  h2: 'text-4xl lg:text-6xl font-heading',
  /** Card titles, smaller headings */
  h3: 'text-xl font-heading',
  /** Eyebrow / label text */
  eyebrow: 'text-xs font-sans tracking-widest uppercase',
  /** Standard body copy */
  body: 'text-sm font-sans',
  /** Larger body copy */
  bodyLarge: 'text-base lg:text-lg font-sans',
  /** Small labels (footer, card metadata) */
  label: 'text-[10px] uppercase tracking-wider',
  /** Quote / emphasis text */
  quote: 'text-xl lg:text-2xl font-heading italic text-ravok-gold',
} as const;

export const fontWeights = {
  thin: 300,      // Cormorant display headings
  regular: 400,   // Default
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
