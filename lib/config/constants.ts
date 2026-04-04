/**
 * Magic numbers, string literals, and business constants
 */

export const VENTURES = {
  TYPES: {
    FILM_SPV: 'film_spv',
    PRODUCTION_LABEL: 'production_label',
    TECH_VENTURE: 'tech_venture',
  },
  STATUSES: {
    CONCEPT: 'concept',
    DEVELOPMENT: 'development',
    FINANCING: 'financing',
    PRODUCTION: 'production',
    DISTRIBUTION: 'distribution',
    RELEASED: 'released',
    EXITED: 'exited',
  },
}

export const DOCUMENTS = {
  CATEGORIES: {
    PITCH_DECK: 'pitch_deck',
    FINANCIAL: 'financial',
    LEGAL: 'legal',
    QUARTERLY: 'quarterly',
    BOARD: 'board',
    DILIGENCE: 'diligence',
    GENERAL: 'general',
  },
  VISIBILITY: {
    ALL_INVESTORS: 'all_investors',
    SPECIFIC: 'specific',
    PARTNERS: 'partners',
  },
}

export const CONFESSIONS = {
  CATEGORIES: {
    TIP: 'tip',
    WARNING: 'warning',
    CONFESSION: 'confession',
    QUESTION: 'question',
  },
  STATUSES: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    FEATURED: 'featured',
  },
}

export const PARTNER_TYPES = {
  CO_PRODUCER: 'co_producer',
  FINANCIER: 'financier',
  DISTRIBUTOR: 'distributor',
  OPERATOR: 'operator',
  CREATOR: 'creator',
  OTHER: 'other',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  INVESTOR: 'investor',
  PARTNER: 'partner',
  USER: 'user',
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  ARTICLES_PAGE_SIZE: 12,
  CONFESSIONS_PAGE_SIZE: 15,
}

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    MODEL: '/model',
    PORTFOLIO: '/portfolio',
    INSIGHTS: '/insights',
    CREATORS: '/creators',
    PARTNERS: '/partners',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',
    LEGAL: {
      TERMS: '/legal/terms',
      PRIVACY: '/legal/privacy',
    },
  },
  PORTAL: {
    ROOT: '/portal',
    DASHBOARD: '/portal/dashboard',
    VENTURES: '/portal/ventures',
    DOCUMENTS: '/portal/documents',
    UPDATES: '/portal/updates',
    PROFILE: '/portal/profile',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    VENTURES: '/admin/manage-ventures',
    DOCUMENTS: '/admin/manage-documents',
    USERS: '/admin/manage-users',
    CONTENT: '/admin/manage-content',
  },
}

export const SITE_CONFIG = {
  NAME: 'RAVOK Studios',
  DESCRIPTION: 'The first venture studio turning filmmakers into founders',
  DOMAIN: 'ravokstudios.com',
  SOCIAL: {
    TWITTER: 'https://twitter.com/ravokstudios',
    LINKEDIN: 'https://linkedin.com/company/ravok-studios',
    INSTAGRAM: 'https://instagram.com/ravokstudios',
  },
}
