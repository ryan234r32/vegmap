/**
 * Fetch cover photos for all restaurants via Google Places API (New).
 *
 * For each restaurant with a google_place_id, fetches place details to get
 * the first photo reference, then resolves the photo URL to a public
 * lh3.googleusercontent.com URL (no API key needed in the stored URL).
 *
 * Usage:
 *   npx tsx scripts/fetch-photos.ts              # Fetch all missing photos
 *   npx tsx scripts/fetch-photos.ts --all        # Re-fetch all photos
 *   npx tsx scripts/fetch-photos.ts --dry-run    # Preview without writing
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const placesApiKey = process.env.GOOGLE_PLACES_API_KEY!;

async function getPhotoUrl(placeId: string): Promise<string | null> {
  // Step 1: Get place details with photos field
  const detailsRes = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": placesApiKey,
        "X-Goog-FieldMask": "photos",
      },
    }
  );

  if (!detailsRes.ok) return null;

  const details = await detailsRes.json();
  const photoName = details.photos?.[0]?.name;
  if (!photoName) return null;

  // Step 2: Fetch the photo media URL (follow redirect to get public URL)
  const photoRes = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`,
    {
      headers: {
        "X-Goog-Api-Key": placesApiKey,
      },
    }
  );

  if (!photoRes.ok) return null;

  const photoData = await photoRes.json();
  return photoData.photoUri ?? null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fetchAll = args.includes("--all");

  if (!supabaseUrl || !serviceRoleKey || !placesApiKey) {
    console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_PLACES_API_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Get restaurants that need photos
  let query = supabase
    .from("restaurants")
    .select("id, name_en, google_place_id, cover_image_url")
    .eq("is_active", true)
    .not("google_place_id", "is", null);

  if (!fetchAll) {
    query = query.is("cover_image_url", null);
  }

  const { data: restaurants, error } = await query;

  if (error) {
    console.error("Failed to fetch restaurants:", error.message);
    process.exit(1);
  }

  console.log(`Found ${restaurants?.length ?? 0} restaurants needing photos.`);
  if (dryRun) console.log("*** DRY RUN — no data will be written ***\n");

  let fetched = 0;
  let skipped = 0;
  let errors = 0;
  const total = restaurants?.length ?? 0;

  for (let i = 0; i < total; i++) {
    const r = restaurants![i];
    const pct = Math.round(((i + 1) / total) * 100);
    process.stdout.write(`  [${pct}%] ${r.name_en} → `);

    try {
      const photoUrl = await getPhotoUrl(r.google_place_id);

      if (!photoUrl) {
        console.log("no photo");
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(`would set: ${photoUrl.substring(0, 60)}...`);
        fetched++;
        continue;
      }

      const { error: updateError } = await supabase
        .from("restaurants")
        .update({ cover_image_url: photoUrl })
        .eq("id", r.id);

      if (updateError) {
        console.log(`ERROR: ${updateError.message}`);
        errors++;
      } else {
        console.log("✓");
        fetched++;
      }
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
      errors++;
    }

    // Rate limit: 100ms between requests (2 API calls per restaurant)
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n${"=".repeat(40)}`);
  console.log(`  Photos fetched:  ${fetched}`);
  console.log(`  No photo found:  ${skipped}`);
  console.log(`  Errors:          ${errors}`);
  console.log(`  Total processed: ${total}`);
}

main().catch(console.error);
