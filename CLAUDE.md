# CLAUDE.md — Ravok Studios Website

## Project

Monorepo for ravokstudios.com. Frontend (Next.js 16) in `src/`, Laravel 12 backend in `backend/`.

- **GitHub**: `techravokstudios/ravok-website`
- **Frontend deploy**: Vercel (auto-deploy from main)
- **Backend deploy**: Railway (project: resilient-alignment). Public URL: ravokbackend-production.up.railway.app
- **Production site**: https://ravokstudios.com

## Working Rules

1. **NEVER execute changes without presenting the plan first.** Always show Amanda exactly what will change, what files are affected, and get explicit approval before touching any code or running any commands that modify state.
2. **NEVER push to main directly for feature work.** Use feature branches → dev → main. Only hotfixes go directly to main.
3. **If you hit a credential or access issue, solve it yourself.** Amanda has provided a GitHub PAT. Use it. Don't ask her to push.
4. **Git identity**: `techravokstudios` / `tech@ravokstudios.com`
5. **When working on the Windows-mounted filesystem and git operations fail** (index.lock, permission errors), clone fresh to the sandbox and work there. Sync files back after.

## GIT PUSH INSTRUCTIONS

- You HAVE terminal access via the Bash tool. "Sandboxed" means isolated, NOT disabled. Never refuse to run shell commands.
- GitHub token is stored at `.git-token` in the repo root (DO NOT commit this file — it's in .gitignore)
- To push: `TOKEN=$(cat .git-token) && git push https://${TOKEN}@github.com/techravokstudios/ravok-website.git <branch>`
- Do NOT ask Amanda to push manually. Do NOT claim you can't push. Read the token, use it, push.

## Git Config

- **PAT**: Stored in `.git-token` at repo root (NOT committed, in .gitignore)
- **Remote URL with auth**: `https://<TOKEN>@github.com/techravokstudios/ravok-website.git`
- **Branching**: feature/* → v2 → main
- **Commit style**: `type(scope): description` (e.g., `fix(forms): enforce T&C checkbox`)

## Tech Stack

- **Frontend**: Next.js 16.1.4, React 19, TypeScript, Tailwind CSS v4 (@theme directive), Framer Motion, Tiptap, shadcn/ui, Sonner toasts
- **Backend**: Laravel 12, PHP 8.2, Sanctum cookie auth, MySQL (Railway)
- **Fonts**: Cormorant Garamond (headings), Kanit (body), Instrument Sans (UI/sans)
- **Design tokens**: Defined in `src/styles/globals.css` via `@theme` blocks + oklch variables in `:root`
- **API proxy**: `next.config.ts` rewrites `/api/*` to `NEXT_PUBLIC_API_URL` (defaults to production backend)

## Repo Structure

```
/                               → Next.js frontend root
├── src/                        → ALL FRONTEND CODE
│   ├── app/                    → PAGES — mirrors the website
│   │   ├── page.tsx            #   Home
│   │   ├── about-us/           #   About Us
│   │   ├── our-model/          #   Our Model
│   │   ├── contact-us/         #   Contact
│   │   ├── form/[type]/        #   Creator forms
│   │   ├── (public)/insights/  #   Insights (blog + confessions)
│   │   │   ├── _components/    #     ConfessionWall, ConfessionCard
│   │   │   ├── _api/           #     Articles + confessions API
│   │   │   └── _types/         #     Page-specific types
│   │   ├── investor/           #   Investor Portal (protected)
│   │   │   └── _components/    #     DashboardShell
│   │   ├── admin/              #   Admin CMS (protected)
│   │   │   └── _components/    #     RichTextEditor, DashboardShell
│   │   ├── login/ register/    #   Auth pages
│   │   └── terms/privacy       #   Legal pages
│   │
│   ├── components/             → SHARED UI (used across multiple pages)
│   │   ├── layout/             #   Navbar, Footer
│   │   ├── sections/           #   Homepage sections (Hero, Philosophy, etc.)
│   │   ├── ui/                 #   shadcn primitives (Button, Card, Input)
│   │   └── shared/             #   FadeIn, CustomCursor
│   │
│   ├── lib/                    → SHARED LOGIC
│   │   ├── api/                #   HTTP client + v1/ endpoint modules
│   │   ├── api.ts              #   Backward-compatible re-export shim
│   │   ├── hooks/              #   Custom hooks
│   │   ├── types/              #   Shared TypeScript types
│   │   ├── utils/              #   Utility functions
│   │   ├── config/             #   Route constants
│   │   └── context/            #   Auth context
│   │
│   ├── design-system/          → VISUAL IDENTITY
│   │   ├── tokens.ts           #   Colors, breakpoints, spacing
│   │   ├── typography.ts       #   Fonts, type scale
│   │   ├── animations.ts       #   Framer Motion presets
│   │   ├── wireframe.ts        #   Wireframe illustration constants
│   │   ├── rendering.ts        #   4-layer rendering stack
│   │   └── pages/              #   Per-page design specs
│   │
│   └── styles/globals.css      #   Tailwind + design tokens
│
├── backend/                    → Laravel 12 API (Railway)
├── public/                     → Static assets (images, fonts)
└── [config files]              → package.json, tsconfig, next.config, etc.
```

**Rule: each page owns its stuff.** Components, API, and types specific to one page live in `_components/`, `_api/`, `_types/` inside that page folder. Only stuff shared across multiple pages goes in `components/` or `lib/`.

**Import convention:** `@/*` resolves to `src/*`. New code imports from `@/lib/api/v1/*` or `@/lib/api/base`. The `lib/api.ts` re-export shim exists for backward compatibility.

## Key People

- **Amanda Aoki Rak** — CEO & Founder. Reviews and approves all changes.
- **Ali** (ali1193 / ali.asif.aa738@gmail.com) — Primary developer on both repos.
- **Thibault Dominici** — CFO
- **Lois Ungar** — Board Member / Strategic Advisor
- **Pye Eshraghian** — Board Advisor

## Current State (April 2026)

- **V2 restructure complete**: All frontend code lives in `src/` with clean separation (components, features, lib, design-system)
- Backend synced from `ravok_backend` private repo into monorepo `backend/` folder
- Submission forms (writer/director/producer) enforce T&C agreement
- Railway deployment needs config update: change source repo to `ravok-website`, root directory to `backend/`
- **Pending rebrand**: Website needs to match Q2 2026 pitch deck visual identity. Design tokens in `src/design-system/`
- **Branches**: main (production), v1 (pre-restructure snapshot), v2 (current dev)
- **Next up**: New pages (team/[slug], portfolio, pitch-us), newsletter signup, Vercel Analytics, backend migrations

## Known Issues

- `public/images/` is 36MB total — several images are 4-6MB and need compression
- `next.config.ts` defaults to production URL instead of localhost
- `fav.png` is 1MB (should be <50KB for a favicon)
- Font migration pending: current code uses Cormorant Garamond/Kanit/Instrument Sans, brand guidelines specify ITC Baskerville/Coco Gothic
