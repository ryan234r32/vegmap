# VegMap — Lessons Learned

## 2026-03-16: Initial Build

### shadcn/ui v4 Breaking Changes
- **Problem**: shadcn/ui v4 uses `@base-ui/react` instead of `@radix-ui/react`
- **Impact**: `asChild` prop doesn't exist on Trigger/Item components
- **Fix**: Render children directly inside trigger components instead of wrapping with `asChild`
- **Rule**: Always check the generated shadcn component source before using Radix-era patterns

### Supabase Client Build-Time Validation
- **Problem**: `@supabase/ssr` validates URL and API key format even during SSG prerendering
- **Impact**: Empty env vars or placeholder text causes build failures
- **Fix**: Use `||` (not `??`) with properly formatted JWT placeholder strings
- **Rule**: Supabase URL must be valid HTTPS URL, anon key must look like a JWT

### base-ui Select onValueChange Signature
- **Problem**: base-ui Select `onValueChange` passes `string | null`, not just `string`
- **Impact**: TypeScript errors when assigning to `string | undefined` type fields
- **Fix**: Don't annotate parameter type — let it infer `string | null` and handle null case

### Next.js 16 Middleware Deprecation
- **Note**: `middleware.ts` file convention is deprecated in favor of `proxy`
- **Impact**: Warning only, still works. Will need migration later.

## 2026-03-16: Real Restaurant Data Collection

### Web Scraping Limitations
- **Problem**: Most restaurant aggregators (HappyCow, TripAdvisor, Yelp, Google) block automated fetches via WAF or CAPTCHAs
- **Impact**: Cannot directly scrape structured restaurant data
- **Fix**: Use WebSearch to find data across multiple blog posts, review sites, and official pages, then cross-reference
- **Rule**: Always verify addresses against at least 2 sources. Michelin Guide and Yelp listing pages tend to be accessible.

### Taipei Restaurant Data Sources (ranked by reliability)
1. **Michelin Guide Taiwan** — Most detailed, includes full addresses and descriptions
2. **Individual restaurant websites** — Official addresses and phone numbers
3. **Yelp listings** — Good for Chinese addresses and photos
4. **Food blog posts** (taiwanobsessed.com, itravelforveganfood.com) — Good for English descriptions
5. **ifoodie.tw / vegemap.merit-times.com** — Best for Chinese-language data

### Restaurant Closure Risk
- **Problem**: Taipei's vegan scene changes rapidly; restaurants open and close frequently
- **Impact**: About Animals (closed), Blossom Rena (closed), Flourish (possibly closed)
- **Fix**: Only include restaurants verified as open from 2025+ sources; mark is_active accordingly
- **Rule**: Check HappyCow "CLOSED" status before including a restaurant

## 2026-03-16: Phase 3 Enhancements

### React 19 useRef Requires Initial Value
- **Problem**: `useRef<T>()` without argument errors in React 19 strict mode
- **Impact**: TypeScript build failure
- **Fix**: Always pass initial value: `useRef<T>(null)` or `useRef<T>(undefined)`

### Map Name Collision with google-maps Map Component
- **Problem**: Using JS `Map` in same file as `@vis.gl/react-google-maps` `Map` component causes collision
- **Fix**: Use `globalThis.Map` for the JS Map constructor when both are in scope

### @googlemaps/markerclusterer with @vis.gl/react-google-maps
- **Pattern**: Create a child component that uses `useMap()` to get map instance, then initialize MarkerClusterer with programmatic markers (not React AdvancedMarker components)
- **Note**: Clustered markers must be created via `google.maps.marker.AdvancedMarkerElement` constructor, not JSX
