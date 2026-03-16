# VegMap - 蔬適地圖

## Project Overview
English-first web app helping foreigners find vegetarian restaurants in Taipei with AI-translated menus. Deployed at https://vegmap-nu.vercel.app. Phase 1 (core map + restaurant list) is complete.

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, TypeScript 5, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui v4 (uses `@base-ui/react`, NOT Radix)
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Auth**: Supabase Auth (Google OAuth + Email/Password)
- **Maps**: Google Maps JS API via `@vis.gl/react-google-maps`
- **AI**: OpenAI GPT-4o-mini (menu translation + OCR)
- **Hosting**: Vercel (Free tier)

## Key Architecture Decisions
- Google Places API only at **import time** (admin route), never runtime — cost control
- Restaurant pages use SSR with `generateMetadata` for SEO + JSON-LD structured data
- All API keys server-side only — no `NEXT_PUBLIC_` for secrets
- PostGIS `nearby_restaurants()` RPC function for geo queries
- Server Components by default; `"use client"` only for interactive hooks
- Supabase RLS policies enforce row-level access (20+ policies)
- Supabase client needs valid-looking JWT placeholder for SSG builds (use `||`, not `??`)

## Development Commands
```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run seed         # Seed demo restaurants via scripts/seed-data.ts
npx supabase start   # Local Supabase (if using local dev)
```

## Directory Conventions
- `app/` — Next.js App Router pages and API routes
- `app/api/` — API routes: restaurants, nearby, reviews, favorites, menus/translate, admin/import
- `components/ui/` — shadcn/ui v4 components (auto-generated, do not manually edit)
- `components/map/` — Google Maps components (AdvancedMarker, InfoWindow)
- `components/restaurant/` — Restaurant cards, filters, veg-type badges, star rating, JSON-LD
- `components/review/` — Review card + review form
- `components/menu/` — Menu display with translation status
- `components/layout/` — Header (sticky, mobile sheet) + Footer
- `lib/supabase/` — Client configs: client.ts (browser), server.ts (SSR), admin.ts (service role), middleware.ts
- `lib/hooks/` — use-auth, use-geolocation, use-restaurants
- `lib/types.ts` — All TypeScript interfaces (Restaurant, Profile, Review, Menu, etc.)
- `constants/` — VEGETARIAN_TYPES, PRICE_RANGES, TAIPEI_DISTRICTS, CUISINE_TAGS, map defaults
- `supabase/migrations/` — SQL schema (9 tables, triggers, PostGIS functions, RLS)
- `scripts/` — One-off scripts (seed-data.ts)

## Coding Standards
- All user-facing text in **English** (this is an English-first app)
- Code comments in English
- TypeScript strict mode
- Prefer server components; use `"use client"` only when needed
- Supabase queries: use typed client
- API routes: validate input, return consistent `{ data, error }` JSON shape
- shadcn/ui v4: no `asChild` prop — render children directly inside trigger components
- base-ui Select: `onValueChange` passes `string | null` — handle null case

## Database Schema (9 tables)
- **restaurants** — Core entity (name_en, name_zh, slug, location GEOGRAPHY, vegetarian_types[], avg_rating, review_count)
- **profiles** — Extends auth.users (display_name, avatar_url, is_admin)
- **reviews** — Ratings (overall, food, service, value, english_friendly) + body + helpful_count
- **review_photos** — Photos attached to reviews
- **menus** — Translated menu items (JSONB), translation_status enum
- **menu_contributions** — Community corrections (pending/approved/rejected)
- **favorite_lists** — User lists (public/private)
- **favorite_items** — Items in favorite lists
- **helpful_votes** — Prevents duplicate votes
- Triggers auto-update: avg_rating, review_count, helpful_count, updated_at, profile creation
- Vegetarian types enum: vegan, ovo_lacto, lacto, ovo, five_spice, vegetarian_friendly

## Known Gotchas
- shadcn/ui v4 uses `@base-ui/react` not `@radix-ui/react` — no `asChild` pattern
- Supabase SSG: client needs valid-format URL + JWT placeholder or build fails
- `middleware.ts` is deprecated in Next.js 16 (warning only, still works)
