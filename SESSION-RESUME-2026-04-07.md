# Session Resume — 2026-04-07

## What Was Done
- **V2 restructure complete**: All frontend code moved into `src/` with clean organization
- Moved `app/`, `components/`, `lib/` into `src/`
- Split components: `layout/` (Navbar, Footer), `sections/` (homepage), `shared/` (FadeIn, CustomCursor), `ui/` (shadcn)
- Colocated page-specific code with pages (no `features/` folder):
  - `insights/_components/` — ConfessionWall, ConfessionCard
  - `insights/_api/` — articles.ts, confessions.ts
  - `insights/_types/` — article + confession types
  - `admin/_components/` — RichTextEditor, DashboardShell
  - `investor/_components/` — DashboardShell
- Moved design-system to `src/design-system/`
- Removed `_archive/`, `ravok-master-plan/`, `design/` from repo
- Updated all import paths, `tsconfig.json`, `components.json`
- Updated `README.md` with clean structure + "How To Find Anything" table
- Updated `CLAUDE.md` with new repo structure
- Build passes clean (41 pages)
- Committed and pushed to `v2` branch

## What's Next
- **Part 2: New pages**
  - Create `/team/[slug]` route with individual team member pages
  - Create `/portfolio` route with expandable venture cards
  - Rename `/form` → `/pitch-us` with overview, guide, FAQ landing page
  - Add newsletter signup to Footer
  - Add Vercel Analytics + Speed Insights to layout
- **Part 3: Backend migrations**
  - `subscribers` table (newsletter)
  - `ventures` table (portfolio data)
  - `team_members` table (team page data)
  - Newsletter API endpoint (`POST /api/newsletter/subscribe`)

## Exact Resume Point
Task: Part 2 of the approved restructure plan — new pages
Start with: `/team/[slug]` route or `/portfolio` page (Amanda's choice)
Context: Repo is clean and restructured. Build passes. Ready to add new pages.

## Blockers
- None — ready to proceed with Part 2

## Files Modified This Session
- `tsconfig.json` — path alias `@/*` → `./src/*`, exclude updated
- `components.json` — ui alias → `@/components/ui`, css → `src/styles/globals.css`
- `src/app/layout.tsx` — globals.css import updated
- `src/app/page.tsx` — imports from `@/components/sections`
- `src/app/(public)/insights/page.tsx` — ConfessionWall import → local `_components/`
- `src/app/admin/posts/add/page.tsx` — RichTextEditor import → `@/app/admin/_components/`
- `src/app/admin/posts/edit/page.tsx` — RichTextEditor import → `@/app/admin/_components/`
- `src/app/admin/layout.tsx` — DashboardShell import → `./_components/`
- `src/app/investor/layout.tsx` — DashboardShell import → `./_components/`
- All `@/lib/ui/` imports → `@/components/ui/` (across ~25 files)
- All `@/components/Navbar` → `@/components/layout/Navbar` (across ~15 files)
- All `@/components/Footer` → `@/components/layout/Footer`
- `README.md` — complete rewrite with new structure
- `CLAUDE.md` — updated repo structure, removed stale sections
