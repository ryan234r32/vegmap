# VegMap - 蔬適地圖

## Project Overview
English-first web app helping foreigners find vegetarian restaurants in Taipei with AI-translated menus.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Auth**: Supabase Auth (Google OAuth + Email)
- **Maps**: Google Maps JS API + Places API
- **AI**: OpenAI GPT-4o-mini (translation + OCR)
- **Hosting**: Vercel (Free tier)

## Key Architecture Decisions
- Google Places API only at **import time**, never runtime (cost control)
- Restaurant pages use SSG + ISR for SEO
- All API keys server-side only
- PostGIS for geo queries (nearby restaurants)

## Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx supabase start   # Local Supabase (if using local dev)
```

## Directory Conventions
- `app/` — Next.js App Router pages and API routes
- `components/ui/` — shadcn/ui components (do not manually edit)
- `components/map/` — Google Maps components
- `components/restaurant/` — Restaurant-related UI
- `lib/supabase/` — Supabase client configs (client.ts, server.ts, admin.ts)
- `lib/hooks/` — Custom React hooks
- `constants/` — Enums, type maps, static data
- `supabase/migrations/` — SQL migration files
- `scripts/` — One-off scripts (import, seed)

## Coding Standards
- All user-facing text in **English** (this is an English-first app)
- Code comments in English
- Use TypeScript strict mode
- Prefer server components; use `"use client"` only when needed
- Supabase queries: always use typed client with generated types
- API routes: validate input, return consistent JSON shape `{ data, error }`

## Database
- Supabase project with PostGIS enabled
- RLS enabled on all tables
- See `supabase/migrations/` for schema
- Vegetarian types enum: vegan, ovo_lacto, lacto, ovo, five_spice, vegetarian_friendly
