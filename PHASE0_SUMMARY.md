# Phase 0 Foundation — Complete

**Commit:** `518e304` — `feat(phase0): Complete frontend foundation layer`
**Branch:** `dev` → `origin/dev` (pushed)
**Date:** April 3, 2026
**Files Created:** 33 new files (2,142 lines)

---

## What Was Built

### 1. HTTP Client Layer (`lib/api/client.ts`)
- Axios-based singleton HTTP client
- Cookie-based Sanctum auth support (`withCredentials: true`)
- Request interceptor: Attaches auth token from localStorage
- Response interceptor: Handles 401 errors, transforms Axios errors to `AppError`
- Static methods: `get`, `post`, `put`, `patch`, `delete`
- Auth token management: `setAuthToken`, `getAuthToken`, `clearAuth`

### 2. Typed API Endpoints (`lib/api/v1/`)
**Files:**
- `auth.ts` — Login, register, logout, getCurrentUser, resetPassword
- `ventures.ts` — Public + Portal + Admin CRUD for ventures
- `documents.ts` — Portal document listing, download; Admin upload, delete
- `articles.ts` — Public listing by slug; Admin CRUD + publish
- `confessions.ts` — Public feed, submit; Admin moderation (approve/reject/feature)
- `public.ts` — Contact form submission, waitlist submission

**Pattern:** Every endpoint is typed end-to-end with request/response types from `lib/types/api.ts`

### 3. Custom Hooks Layer (`lib/hooks/`)
- **`useApi.ts`** — Generic API execution hook with loading/error state and callbacks
- **`useForm.ts`** — Form state management (values, errors, touched, submit handling)
- **`useAuth.ts`** — Authentication state (user, isAuthenticated, login, register, logout)
- **`useScroll.ts`** — Scroll position tracking + `useScrollToTop()` helper

### 4. React Context Providers (`lib/context/`)
- **`AuthContext.tsx`** — Global auth state + `ProtectedRoute` component
- **`UIContext.tsx`** — Toast notifications + dark mode + menu state + `useToast()` hook
- **`PortalContext.tsx`** — Portal state (selected venture, document filters, cached data)

### 5. TypeScript Type System (`lib/types/`)
- **`entities.ts`** — Business models (User, Venture, Document, Update, Article, Confession, Contact, Waitlist, etc.)
- **`api.ts`** — API request/response contracts (LoginRequest, LoginResponse, PaginatedResponse<T>, etc.)
- **`forms.ts`** — Form-specific data types (LoginFormData, RegisterFormData, ContactFormData, etc.)
- **`ui.ts`** — React component prop types (ButtonProps, InputProps, CardProps, etc.)
- **`common.ts`** — Utility types (PaginationParams, ApiErrorResponse, Result<T>, ListResponse<T>)

### 6. Configuration (`lib/config/`)
- **`constants.ts`** — Single source of truth for enums (VENTURES.TYPES, DOCUMENTS.CATEGORIES, USER_ROLES, ROUTES object with all pages, SITE_CONFIG)
- **`endpoints.ts`** — API endpoint paths organized by section (AUTH, PUBLIC, PORTAL, ADMIN) + `getApiUrl()` helper

### 7. Validation Schemas (`lib/validation/schemas.ts`)
Using Zod for type-safe form validation:
- `loginSchema` — Email + password
- `registerSchema` — Name + email + password + confirmation + T&C agreement
- `contactSchema` — Name + email + partner_type + message
- `waitlistSchema` — Name + email + logline + portfolio_url
- `confessionSchema` — Body (20-5000 chars) + category
- `articleSchema` — Title + slug + body + status + metadata

### 8. Error Handling (`lib/error/AppError.ts`)
- Custom `AppError` class extending Error
- Type guards: `isValidationError()`, `isNotFoundError()`, `isUnauthorizedError()`, etc.
- Validation error extraction: `getValidationErrors()` returns field-level errors

### 9. Utility Functions (`lib/utils/`)
- **`string.ts`** — capitalize, slug, truncate, camelToTitleCase, pluralize, removeMarkdown, getInitials
- **`date.ts`** — formatDate, formatRelativeTime, isToday, isFuture, isPast, getDateRange
- **`format.ts`** — formatCurrency, formatNumber, formatFileSize, formatPercentage, maskEmail, maskPhone, toTitleCase
- **`array.ts`** — chunk, unique, flatten, groupBy, sortBy, findIndex, remove, sample, shuffle, paginate
- **`object.ts`** — pick, omit, merge, deepMerge, hasKey, isEmpty, invert, values, entries, mapValues

---

## Architecture Benefits

### Token Efficiency
- Centralized type definitions prevent duplication across files
- Barrel exports (`index.ts` files) enable clean imports: `import { useAuth } from 'lib/hooks'`
- API client is a singleton, not instantiated per component
- Constants are imported once, referenced everywhere

### Type Safety
- End-to-end TypeScript from API response → component props
- Discriminated unions for status/type fields (e.g., `VentureStatus` = `'concept' | 'development' | ...`)
- Zod schemas validate forms AND match backend expectations
- React Context provides typed state without prop-drilling

### Scalability
- **Adding a new API endpoint?** Create a function in `lib/api/v1/[domain].ts`, add types to `lib/types/`
- **Adding a new page?** Add route to `ROUTES` constant, wrap with `ProtectedRoute` if needed
- **Adding form validation?** Create schema in `lib/validation/schemas.ts`
- **Adding utility?** Add function to appropriate `lib/utils/[domain].ts`

### Developer Experience (for Claude Code)
- No hunting for types — all in `lib/types/`
- No hunting for API endpoints — all in `lib/api/v1/`
- No hunting for constants — all in `lib/config/constants.ts`
- No hunting for hooks — all in `lib/hooks/`
- **Context clutter reduced:** Each Claude Code session imports from `lib/` not the entire codebase

---

## Next Steps (Phase 0 Continuation)

### Immediate (Still Phase 0)
1. Create Next.js App Router route groups:
   - `app/(public)/` — Public pages
   - `app/(auth)/` — Login/register
   - `app/(portal)/` — Investor portal (protected)
   - `app/(admin)/` — Admin dashboard (protected)

2. Reorganize existing components into atomic design:
   - `components/atoms/` — Button, Input, Badge, etc.
   - `components/molecules/` — FormField, Card, Modal, etc.
   - `components/organisms/` — Header, Footer, etc.
   - `components/layouts/` — PublicLayout, PortalLayout, AdminLayout

3. Create wrapper root layout (`app/layout.tsx`) that wraps all routes with:
   - `AuthProvider` (from `lib/context`)
   - `UIProvider` (from `lib/context`)
   - `PortalProvider` (from `lib/context`)

### Phase 1 Ready
- Rebrand public site with brand tokens from `ravok-master-plan/01-brand-identity/`
- Build homepage using foundation (Header, Hero, etc. as atomic components)
- All API calls use `lib/api/v1/` endpoints with types from `lib/types/`

---

## How to Use This Foundation in Future Claude Code Sessions

When you start a new session, import from `lib/`:

```typescript
// Components
import { useAuth } from 'lib/hooks'
import { useAuthContext, ProtectedRoute } from 'lib/context'
import { useToast } from 'lib/context/UIContext'

// API calls
import { authApi, venturesApi, documentsApi } from 'lib/api/v1'

// Types
import { Venture, Document, AuthUser } from 'lib/types'

// Config
import { ROUTES, VENTURES } from 'lib/config/constants'
import { API_ENDPOINTS } from 'lib/config/endpoints'

// Utilities
import { formatDate, slug, groupBy } from 'lib/utils'

// Validation
import { loginSchema } from 'lib/validation/schemas'
```

No need to read 2000-line CONTEXT files to understand where things are. Everything is organized, typed, and ready to build.

---

## Files Created Summary

```
lib/
├── api/
│   ├── client.ts
│   └── v1/
│       ├── auth.ts
│       ├── ventures.ts
│       ├── documents.ts
│       ├── articles.ts
│       ├── confessions.ts
│       ├── public.ts
│       └── index.ts
├── config/
│   ├── constants.ts
│   └── endpoints.ts
├── context/
│   ├── AuthContext.tsx
│   ├── UIContext.tsx
│   ├── PortalContext.tsx
│   └── index.ts
├── error/
│   └── AppError.ts
├── hooks/
│   ├── useApi.ts
│   ├── useForm.ts
│   ├── useAuth.ts
│   ├── useScroll.ts
│   └── index.ts
├── types/
│   ├── index.ts
│   ├── entities.ts
│   ├── api.ts
│   ├── forms.ts
│   ├── ui.ts
│   └── common.ts
├── utils/
│   ├── string.ts
│   ├── date.ts
│   ├── format.ts
│   ├── array.ts
│   ├── object.ts
│   └── index.ts
└── validation/
    └── schemas.ts
```

**Total:** 33 files, 2,142 lines
**Ready for:** Phase 1 Rebrand + Public Site

---

## Verification

✅ All files created in `/sessions/gallant-vibrant-cray/ravfront-work/`
✅ All files staged and committed
✅ Commit pushed to `origin/dev`
✅ No secrets exposed (PAT stored in env)
✅ TypeScript strict mode compatible
✅ Zod validation ready for forms
✅ Sanctum cookie auth ready
✅ PostgreSQL ready (Railway)
✅ Vercel deployment ready

**Ready to build Phase 1: Rebrand + Public Site**
