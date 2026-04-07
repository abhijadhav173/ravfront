/**
 * RAVOK Studios — Design Tokens
 * TypeScript mirror of CSS variables from globals.css @theme block.
 * These reflect the ACTUAL production design on main.
 */

// --- Colors (matches globals.css @theme) ---

export const colors = {
  background: '#000000',
  foreground: '#ffffff',

  ravokGold: '#A98147',
  ravokBeige: '#F3E4B9',
  ravokSlate: '#98958C',

  // Common hardcoded colors used in section components
  sectionBg: '#1C1B14',
  black: '#000000',
  white: '#ffffff',
} as const;

// --- Breakpoints (Tailwind defaults) ---

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// --- Spacing (consistent patterns from existing sections) ---

export const spacing = {
  sectionPadding: {
    y: 'py-24 lg:py-32',
    x: 'px-6',
  },
  container: 'container mx-auto',
  gap: {
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-16',
  },
} as const;

// --- Z-Index (from homepage stacking sections) ---

export const zIndex = {
  stickySection1: 10,
  stickySection2: 20,
  stickySection3: 30,
  stickySection4: 40,
  stickySection5: 50,
  footer: 60,
  mobileMenu: 90,
  navbar: 100,
  cursor: 9999,
} as const;

// --- Border Radius ---

export const radius = {
  sectionTop: 'rounded-t-3xl',
  card: 'rounded-lg',
  cardLarge: 'rounded-2xl',
  button: 'rounded-full',
} as const;
