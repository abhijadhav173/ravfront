/**
 * API endpoint paths — single source of truth
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    LOGOUT: '/api/logout',
    USER: '/api/user',
    PASSWORD_RESET: '/api/password-reset',
  },

  // Public
  PUBLIC: {
    CONTACT: '/api/contact',
    WAITLIST: '/api/waitlist',
    ARTICLES: '/api/articles',
    ARTICLE_BY_SLUG: (slug: string) => `/api/articles/${slug}`,
    VENTURES: '/api/ventures/public',
    VENTURE_BY_ID: (id: number) => `/api/ventures/${id}`,
    CONFESSIONS: '/api/confessions',
    CONFESSIONS_FEATURED: '/api/confessions/featured',
  },

  // Investor Portal
  PORTAL: {
    DASHBOARD: '/api/portal/dashboard',
    VENTURES: '/api/portal/ventures',
    VENTURE_BY_ID: (id: number) => `/api/portal/ventures/${id}`,
    DOCUMENTS: '/api/portal/documents',
    DOCUMENT_DOWNLOAD: (id: number) => `/api/portal/documents/${id}/download`,
    UPDATES: '/api/portal/updates',
    UPDATE_BY_ID: (id: number) => `/api/portal/updates/${id}`,
  },

  // Admin
  ADMIN: {
    VENTURES: '/api/admin/ventures',
    VENTURE_BY_ID: (id: number) => `/api/admin/ventures/${id}`,
    DOCUMENTS: '/api/admin/documents',
    DOCUMENT_BY_ID: (id: number) => `/api/admin/documents/${id}`,
    UPDATES: '/api/admin/updates',
    UPDATE_BY_ID: (id: number) => `/api/admin/updates/${id}`,
    ARTICLES: '/api/admin/articles',
    ARTICLE_BY_ID: (id: number) => `/api/admin/articles/${id}`,
    CONFESSIONS: '/api/admin/confessions',
    CONFESSION_BY_ID: (id: number) => `/api/admin/confessions/${id}`,
    USERS: '/api/admin/users',
    USER_ROLE: (id: number) => `/api/admin/users/${id}/role`,
    CONTACTS: '/api/admin/contacts',
    WAITLIST: '/api/admin/waitlist',
    AUDIT_LOG: '/api/admin/audit-log',
  },
}

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  return `${baseUrl}${endpoint}`
}
