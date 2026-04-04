# ravok-website

Monorepo for [ravokstudios.com](https://ravokstudios.com) — the official website and investor portal for Ravok Studios.

## Repository Structure

```
ravok-website/
│
├── app/                          # Next.js App Router — pages & routing
│   ├── (public)/                 # Public feature pages (confessions, insights)
│   ├── admin/                    # Admin dashboard (protected)
│   ├── investor/                 # Investor portal (protected)
│   ├── form/[type]/              # Writer/Director/Producer submission forms
│   ├── about-us/
│   ├── our-model/
│   ├── contact-us/
│   └── ...                       # Homepage, legal pages, etc.
│
├── components/                   # React components (organized by purpose)
│   ├── layout/                   # Page chrome — Navbar, Footer
│   ├── sections/                 # Homepage & page sections — Hero, Philosophy, etc.
│   ├── shared/                   # Reusable across features — FadeIn, RichTextEditor
│   ├── confessions/              # Hollywood Confessions feature
│   ├── dashboard/                # Admin/investor dashboard shell
│   └── ui/                       # shadcn/ui primitives — Button, Card, Input, etc.
│
├── lib/                          # Frontend logic (no UI)
│   ├── api/                      # HTTP client + typed API endpoints (v1/)
│   ├── context/                  # React context providers (Auth, UI, Portal)
│   ├── hooks/                    # Custom hooks (useApi, useAuth, useForm, useScroll)
│   ├── types/                    # TypeScript types (entities, API, forms, UI, common)
│   ├── utils/                    # Pure utility functions (string, date, array, etc.)
│   ├── config/                   # Constants, endpoints, routes
│   ├── validation/               # Zod form schemas
│   └── error/                    # AppError class
│
├── public/                       # Static assets (images, fonts)
│
├── backend/                      # Laravel 12 REST API
│   ├── app/                      # Controllers, Models, Mail
│   ├── database/                 # Migrations and seeders
│   ├── routes/                   # API route definitions
│   └── resources/                # Blade email templates
│
├── ravok-master-plan/            # Business specs & build context (00-10)
│
└── .github/                      # PR templates and contribution guidelines
```

## Architecture

| Layer | Technology | Hosted on |
|---|---|---|
| Frontend | Next.js 16 (App Router, TypeScript) | Vercel |
| Backend API | Laravel 12 (Sanctum auth) | Railway |
| Database | PostgreSQL | Railway |
| File storage | Railway volume (`investor-docs`) | Railway |

The frontend communicates with the backend exclusively through the REST API at `/api/*`. Auth uses Laravel Sanctum with cookie-based sessions for the admin/investor portal.

## Getting started

### Prerequisites

- Node.js 20+
- PHP 8.2+
- Composer
- PostgreSQL (or use Railway's dev database)

### Frontend

```bash
# Install dependencies
npm install

# Copy env and fill in your values
cp .env.example .env.local

# Run dev server (http://localhost:3000)
npm run dev
```

**Required env vars:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend

```bash
cd backend

# Install PHP dependencies
composer install

# Copy env and fill in your values
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations + seed admin user
php artisan migrate --seed

# Start local server (http://localhost:8000)
php artisan serve
```

See [`backend/README.md`](./backend/README.md) for full backend setup, environment variables, and deployment instructions.

## Deployment

| Service | Trigger | Notes |
|---|---|---|
| Vercel (frontend) | Push to `main` | Auto-deploys |
| Railway (backend) | Push to `main` | Root dir: `backend/` |

Production environment variables are managed in Vercel and Railway dashboards respectively — never commit `.env` files.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production — both Vercel and Railway deploy from here |
| `dev` | Active development — open PRs against this branch |

## Contributing

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md).
