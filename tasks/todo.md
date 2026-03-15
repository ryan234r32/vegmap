# VegMap — Task Tracker

## Phase 1: Core Map + Restaurant List ✅

### Step 0: Setup ✅
- [x] Project-level CLAUDE.md
- [x] Git init + tasks directory
- [x] Next.js 16 project init (TypeScript + Tailwind v4 + App Router)
- [x] Install dependencies (Supabase SSR, Google Maps, shadcn/ui v4)
- [x] shadcn/ui setup (14 components)
- [x] .env.local + .env.example
- [x] Base directory structure
- [x] Supabase migration SQL (full schema with PostGIS, RLS, triggers)
- [x] Core lib files (supabase client/server/admin, types, constants, hooks)
- [x] Seed data script (10 Taipei restaurants)
- [x] Initial commit + push to GitHub

### Step 1: Map + Data ✅
- [x] Google Maps integration + custom markers (with fallback for missing API key)
- [x] Restaurant list page + filters (veg type, district, price, search, sort)
- [x] Restaurant detail page (SSR + SEO metadata)
- [x] Nearby restaurant geo query (PostGIS RPC function)
- [x] RWD mobile layout (responsive grid, mobile sheet menu)
- [x] User location "Near Me" button

### Step 2: Auth + Reviews ✅
- [x] Supabase Auth (Google OAuth + Email)
- [x] Auth callback route
- [x] Login/signup page
- [x] User profile page
- [x] Review form (overall + sub-ratings + English Friendly)
- [x] Review display with helpful votes
- [x] Star rating component (interactive + display modes)

### Step 3: Admin + SEO ✅
- [x] Google Places import API route (admin-only)
- [x] AI menu translation pipeline (GPT-4o-mini Vision OCR)
- [x] SEO: meta tags, OG tags, sitemap.xml, robots.txt
- [x] JSON-LD structured data (Restaurant schema)
- [x] Menu display component with translation status badges

### Step 4: Deployment ✅
- [x] GitHub repo created (ryan234r32/vegmap)
- [x] Vercel deployment successful
- [x] Production URL: https://vegmap-nu.vercel.app

---

## What's Needed to Go Live with Data

1. **Create Supabase project** → Run migration SQL → Enable PostGIS
2. **Set env vars in Vercel** (Supabase URL/keys, Google Maps API key, OpenAI key)
3. **Run seed script** or **use admin import** to populate restaurants
4. **Enable Google OAuth** in Supabase Auth settings

---

## Phase 2: Enhancement (Next)
- [ ] Favorites button connected to API
- [ ] Menu photo upload UI
- [ ] Community correction "Suggest correction" workflow
- [ ] Full-text search with autocomplete
- [ ] PWA manifest for mobile
- [ ] User-submitted restaurants
- [ ] Map marker clustering for dense areas
- [ ] Dark mode toggle

---

## Review Notes
- Build passes cleanly on Next.js 16.1.6 + Turbopack
- shadcn/ui v4 uses @base-ui/react (not Radix) — no asChild prop
- Supabase client needs valid-looking JWT placeholders for build-time SSG
- All 17 routes generated successfully (12 static + 5 dynamic + middleware)
