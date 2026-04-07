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
│   ├── app/                          # Pages (Next.js App Router)
│   │   ├── page.tsx                  #   Home
│   │   ├── about-us/                 #   About Us
│   │   ├── our-model/                #   Our Model
│   │   ├── contact-us/               #   Contact
│   │   ├── form/[type]/              #   Creator forms (writer/director/producer)
│   │   ├── (public)/                 #   Route group
│   │   │   ├── insights/             #     Blog + Confessions
│   │   │   └── confessions/          #     Confession submission
│   │   ├── investor/                 #   Investor Portal (protected)
│   │   ├── admin/                    #   Admin CMS (protected)
│   │   ├── login/
│   │   ├── register/
│   │   ├── terms-and-conditions/
│   │   └── privacy-policy/
│   │
│   ├── components/                   # UI PIECES
│   │   ├── layout/                   #   Navbar, Footer
│   │   ├── sections/                 #   Homepage sections (Hero, Philosophy, etc.)
│   │   ├── ui/                       #   shadcn primitives (Button, Card, Input)
│   │   └── shared/                   #   FadeIn, CustomCursor
│   │
│   ├── features/                     # PAGE FEATURES (own components + API + types)
│   │   ├── blog/                     #   Article cards, grid, API, types
│   │   ├── confessions/              #   Confession wall, cards, API, types
│   │   ├── investor/                 #   Dashboard shell, portal components
│   │   ├── forms/                    #   Pitch Us form logic
│   │   ├── portfolio/                #   Venture cards (future)
│   │   ├── team/                     #   Team member pages (future)
│   │   └── newsletter/               #   Signup form (future)
│   │
│   ├── lib/                          # SHARED LOGIC
│   │   ├── api/                      #   HTTP client + endpoint modules
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── config/                   #   Routes, analytics config
│   │   └── context/                  #   Auth context
│   │
│   ├── design-system/                # VISUAL IDENTITY
│   │   ├── tokens.ts                 #   Colors, breakpoints, spacing
│   │   ├── typography.ts             #   Fonts, type scale
│   │   ├── animations.ts             #   Framer Motion presets
│   │   ├── wireframe.ts              #   Wireframe illustration constants
│   │   ├── rendering.ts              #   4-layer rendering stack
│   │   └── pages/                    #   Per-page design specs
│   │
│   └── styles/
│       └── globals.css
│
├── backend/                          # LARAVEL API (Railway)
│
├── public/                           # STATIC ASSETS (images, fonts)
│
├── CLAUDE.md                         # AI assistant instructions
├── README.md                         # This file
└── [config files]                    # package.json, tsconfig, next.config, etc.
```

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
| Blog articles | `src/app/(public)/insights/` + `src/features/blog/` |
| Confessions | `src/features/confessions/` |
| Creator forms | `src/app/form/` + `src/features/forms/` |
| Contact page | `src/app/contact-us/` |
| Investor portal | `src/app/investor/` + `src/features/investor/` |
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
