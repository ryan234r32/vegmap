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
- [x] Seed data script (10 demo restaurants)
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

## Phase 2: Data + Trust + Communication ✅

### Step 1: 52 Real Restaurant Seed Data ✅
- [x] Researched 16+ web sources for real restaurant data
- [x] 52 verified restaurants across all 12 Taipei districts
- [x] District breakdown: Da'an 18, Zhongshan 8, Songshan 5, Zhongzheng 5, Xinyi 4, Shilin 3, Wanhua 2, Datong 2, Beitou 2, Neihu 1, Nangang 1, Wenshan 1
- [x] Includes 3 Michelin-recognized restaurants (Serenity, Clavius, Yangming Spring)
- [x] All data verified from multiple sources (Michelin Guide, HappyCow, TripAdvisor, blogs)

### Step 2: Diet Communication Card ✅
- [x] `/tools/diet-card` page with SEO metadata
- [x] 6 diet types (vegan, ovo-lacto, lacto, ovo, pescatarian, no-five-pungent)
- [x] 6 allergen options (gluten, nuts, soy, sesame, mushroom, MSG)
- [x] Bilingual card generator (Chinese text for restaurant staff + English)
- [x] 10 common hidden animal ingredients with descriptions
- [x] 8 useful dining phrases in Chinese/English
- [x] Taiwan 5-category vegetarian label guide
- [x] Link from every restaurant detail page

### Step 3: Google Places Import Pipeline ✅
- [x] `scripts/import-restaurants.ts` — full CLI import tool
- [x] Searches all 12 Taipei districts with 3 query templates each
- [x] Auto-dedup by google_place_id
- [x] GPT-4o-mini batch translation + vegetarian type inference
- [x] Dry-run mode, single-district mode, resume capability
- [x] Taipei bounding box validation
- [x] Requires API keys (GOOGLE_PLACES_API_KEY + SUPABASE keys)

### Step 4: Community Trust System ✅
- [x] `supabase/migrations/002_reports.sql` — reports table with RLS
- [x] 7 report types (closed, relocated, wrong_veg_type, hidden_ingredients, etc.)
- [x] `/api/reports` route (GET + POST, auth-protected)
- [x] Report Issue button on restaurant detail page
- [x] Hidden ingredients checklist (10 common culprits)
- [x] Trust Badge component (Verified / Needs Review)
- [x] Badge integrated into restaurant cards

### Step 5: English Friendly Scoring ✅
- [x] "English Friendly" sort option in restaurant filters
- [x] Updated RestaurantFilters type

---

## What's Needed to Go Live with Data

1. **Create Supabase project** → Run both migration SQL files → Enable PostGIS
2. **Set env vars in Vercel** (Supabase URL/keys, Google Maps API key, OpenAI key)
3. **Run seed script**: `npm run seed` → 52 restaurants instantly
4. **Run import script**: `npx tsx scripts/import-restaurants.ts` → 500+ restaurants
5. **Enable Google OAuth** in Supabase Auth settings

---

## Phase 3: Enhancement ✅

### Favorites System ✅
- [x] `useFavorites` hook with optimistic updates
- [x] Heart button wired to API on restaurant detail page
- [x] `/favorites` page with auth gate and empty states
- [x] Favorites link in header dropdown menu

### Map Marker Clustering ✅
- [x] `@googlemaps/markerclusterer` integration
- [x] Custom green cluster renderer with dynamic sizing
- [x] Clustered markers replace individual AdvancedMarkers

### Dark Mode ✅
- [x] `next-themes` ThemeProvider integrated into root layout
- [x] Theme toggle button (sun/moon) in header
- [x] Dark mode CSS variables already in globals.css
- [x] System preference detection

### PWA Manifest ✅
- [x] `public/manifest.json` with app metadata
- [x] SVG icons (192x192, 512x512)
- [x] Apple Web App meta tags
- [x] Standalone display mode

### Full-Text Search with Autocomplete ✅
- [x] `SearchAutocomplete` component with debounced live suggestions
- [x] Dropdown shows matching restaurants with district and Chinese name
- [x] Click-through to restaurant detail from suggestions
- [x] Clear button and "Search all" option
- [x] Integrated into filter bar (replaced plain Input)

### User-Submitted Restaurants ✅
- [x] `/restaurants/suggest` page with full form
- [x] Auth gate for submissions
- [x] Fields: name (en/zh), address (en/zh), district, price, veg types, website, description
- [x] Success confirmation with "Suggest Another" flow
- [x] Link in footer

---

## Phase 4: Admin + Menu Upload ✅

### Admin Dashboard ✅
- [x] `/admin` page with access control (isAdmin check)
- [x] Stats cards: pending reports, pending restaurants, resolved, dismissed
- [x] Tabs: Reports | Restaurant Submissions | History
- [x] Report management: resolve/dismiss with admin notes
- [x] Restaurant approval: approve (activate) or reject (delete)
- [x] `/api/admin/reports` — GET all + PATCH resolve/dismiss
- [x] `/api/admin/restaurants` — GET pending + PATCH approve/reject
- [x] Admin link in header dropdown (only shown to admins)

### Menu Photo Upload ✅
- [x] `MenuUpload` component with camera/gallery file picker
- [x] Image preview before upload
- [x] Upload to Supabase Storage → trigger AI translation
- [x] Real-time translation status (uploading → translating → done)
- [x] Translated items display with price, veg badge, allergen tags
- [x] Integrated into restaurant detail page (Menu tab)

### Restaurant Submission API ✅
- [x] `POST /api/restaurants` — auth-protected, creates inactive restaurant
- [x] Auto-generates slug from English name
- [x] `is_active: false` until admin approval

---

## Phase 5: PWA + Favorites Sharing ✅

### PWA Offline Support ✅
- [x] Service worker (`public/sw.js`) — network-first for pages, cache-first for static assets
- [x] Offline fallback page (`/offline`) with tips for travelers
- [x] Precaches critical assets (home, offline page, manifest, icons)
- [x] Service worker registration in root layout
- [x] Manifest already linked with icons

### Favorites Enhancement ✅
- [x] List tabs with active list switching
- [x] Create new list inline (name input + create button)
- [x] Share button — Web Share API on mobile, clipboard copy on desktop
- [x] List item count badges

---

## Phase 6: Night Markets + Photos + Quick Links ✅

### Night Market Vegetarian Guide ✅
- [x] `/night-markets` page with SEO metadata targeting "vegetarian night market Taipei"
- [x] 8 Taipei night markets with coordinates (Shilin, Raohe, Ningxia, Tonghua, etc.)
- [x] 10 safe vegetarian street food items with per-market availability
- [x] Warning badges for items with hidden animal ingredients
- [x] Chinese phrases to say at each stall ("Say this:" cards)
- [x] 6 danger items to avoid with reasons
- [x] 8 essential night market phrases (Chinese + English)
- [x] Night Market link in footer

### Restaurant Photo Gallery ✅
- [x] `PhotoGallery` component with grid layout + lightbox
- [x] Multi-photo upload to Supabase Storage
- [x] Photos tab added to restaurant detail page

### Homepage Quick Links ✅
- [x] Browse by District: 12 Taipei districts as clickable pills
- [x] Popular Cuisines: 8 cuisine tags for quick search
- [x] Traveler Tools: links to Diet Card, Night Market Guide, Suggest

---

## Phase 7: Future Ideas
- [ ] Map clustering custom info window for cluster click
- [ ] Email notifications for report status changes
- [ ] Multi-language support (Japanese, Korean)
- [ ] Restaurant opening hours live status

---

## Review Notes
- Build passes cleanly on Next.js 16.1.6 + Turbopack
- shadcn/ui v4 uses @base-ui/react (not Radix) — no asChild prop, Select onValueChange can return null
- Supabase client needs valid-looking JWT placeholders for build-time SSG
- React 19: useRef requires initial value argument
- All 26 routes generated successfully (17 static + 8 dynamic + middleware)
- 52 seed restaurants verified from real sources across all 12 Taipei districts
- Diet card targets SEO keywords: "vegetarian communication card Taiwan"
- `@googlemaps/markerclusterer` used with `@vis.gl/react-google-maps` for clustering
- Dark mode uses next-themes with class strategy and OKLch color system
- Admin APIs use `requireAdmin()` helper that checks profiles.is_admin
- Menu upload falls back to data URL if Supabase Storage bucket not configured
- PWA: service worker uses network-first for pages (cache fallback), cache-first for static assets
- launch.json needs `/bin/zsh -l -c` wrapper for NVM-based Node environments
