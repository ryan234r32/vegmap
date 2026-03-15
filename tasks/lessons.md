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
