# RAVOK Studios

**The venture studio turning filmmakers into founders.**

Production site: [ravokstudios.com](https://ravokstudios.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Laravel 12, PHP 8.2, Sanctum auth, MySQL |
| UI Components | shadcn/ui |
| Frontend Deploy | Vercel (auto-deploy from `main`) |
| Backend Deploy | Railway |

## Repo Structure

```
ravok-website/
│
├── src/                              # FRONTEND
│   ├── app/                          # PAGES — mirrors the website
│   │   ├── page.tsx                  #   Home
│   │   ├── about-us/                 #   About Us
│   │   ├── our-model/                #   Our Model
│   │   ├── contact-us/               #   Contact
│   │   ├── form/                     #   Creator forms (writer/director/producer)
│   │   ├── (public)/insights/        #   Insights (blog + confessions)
│   │   │   ├── _components/          #     Page-specific components
│   │   │   ├── _api/                 #     Articles + confessions API
│   │   │   └── _types/              #     Types for this page
│   │   ├── investor/                 #   Investor Portal (protected)
│   │   │   └── _components/          #     Dashboard shell
│   │   ├── admin/                    #   Admin CMS (protected)
│   │   │   └── _components/          #     Editor, dashboard shell
│   │   ├── login/ register/          #   Auth
│   │   └── terms / privacy           #   Legal
│   │
│   ├── components/                   # SHARED UI (used across pages)
│   │   ├── layout/                   #   Navbar, Footer
│   │   ├── sections/                 #   Homepage sections (Hero, Philosophy, etc.)
│   │   ├── ui/                       #   shadcn primitives (Button, Card, Input)
│   │   └── shared/                   #   FadeIn, CustomCursor
│   │
│   ├── lib/                          # SHARED LOGIC
│   │   ├── api/                      #   HTTP client + endpoint modules
│   │   ├── hooks/ types/ utils/      #   Reusable across pages
│   │   └── config/ context/          #   Routes, auth
│   │
│   ├── design-system/                # VISUAL IDENTITY
│   │   ├── tokens.ts                 #   Colors, breakpoints, spacing
│   │   ├── typography.ts             #   Fonts, type scale
│   │   ├── animations.ts             #   Framer Motion presets
│   │   └── wireframe.ts / rendering.ts
│   │
│   └── styles/globals.css
│
├── backend/                          # LARAVEL API (Railway)
├── public/                           # STATIC ASSETS (images, fonts)
└── [config files]                    # package.json, tsconfig, next.config, etc.
```

**Rule: each page owns its stuff.** Components, API calls, and types specific to a page live in `_components/`, `_api/`, `_types/` inside that page's folder. Shared stuff goes in `components/` or `lib/`.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production — Vercel auto-deploys from here |
| `v1` | Snapshot of pre-restructure codebase |
| `v2` | Current development — restructured foundation |

## Getting Started

```bash
npm install
cp .env.example .env.local    # Set NEXT_PUBLIC_API_URL
npm run dev                    # http://localhost:3000
```

## How To Find Anything

| "I need to work on..." | Go to... |
|------------------------|----------|
| Homepage | `src/app/page.tsx` + `src/components/sections/` |
| About Us page | `src/app/about-us/` |
| Our Model page | `src/app/our-model/` |
| Insights (blog + confessions) | `src/app/(public)/insights/` (everything is there) |
| Creator forms | `src/app/form/` |
| Contact page | `src/app/contact-us/` |
| Investor portal | `src/app/investor/` |
| Admin CMS | `src/app/admin/` |
| Navbar / Footer | `src/components/layout/` |
| A button or card | `src/components/ui/` |
| Colors / fonts / tokens | `src/design-system/` |
| API calls | `src/lib/api/` |
| Backend routes | `backend/routes/api.php` |

## Team

- **Amanda Aoki Rak** — CEO & Founder, Designer
- **Ali** — Primary Developer
- **Thibault Dominici** — CFO
- **Lois Ungar** — Strategic Advisor
- **Pye Eshraghian** — Board Advisor
