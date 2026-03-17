/**
 * Fix missing photos for seed restaurants by searching Google Places.
 *
 * For each restaurant without a cover_image_url or google_place_id,
 * searches Google Places by name + "Taipei vegetarian" to find the place,
 * then fetches the photo URL.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const placesApiKey = process.env.GOOGLE_PLACES_API_KEY!;

async function searchPlace(name: string): Promise<{ placeId: string; photoName: string | null } | null> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": placesApiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
    },
    body: JSON.stringify({
      textQuery: `${name} vegetarian restaurant Taipei`,
      maxResultCount: 1,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const place = data.places?.[0];
  if (!place) return null;

  return {
    placeId: place.id,
    photoName: place.photos?.[0]?.name ?? null,
  };
}

async function getPhotoUrl(photoName: string): Promise<string | null> {
  const res = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`,
    { headers: { "X-Goog-Api-Key": placesApiKey } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.photoUri ?? null;
}

async function main() {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, name_en, name_zh, google_place_id")
    .is("cover_image_url", null)
    .eq("is_active", true);

  if (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }

  console.log(`Found ${restaurants?.length ?? 0} restaurants without photos.\n`);

  let fixed = 0;
  let notFound = 0;
  let errors = 0;

  for (const r of restaurants ?? []) {
    process.stdout.write(`  ${r.name_en} → `);

    try {
      // Search Google Places
      const searchName = r.name_zh ? `${r.name_en} ${r.name_zh}` : r.name_en;
      const result = await searchPlace(searchName);

      if (!result) {
        console.log("not found on Google Places");
        notFound++;
        continue;
      }

      let photoUrl: string | null = null;
      if (result.photoName) {
        photoUrl = await getPhotoUrl(result.photoName);
      }

      // Update restaurant with google_place_id and photo
      const updateData: Record<string, string | null> = {
        google_place_id: result.placeId,
      };
      if (photoUrl) {
        updateData.cover_image_url = photoUrl;
      }

      const { error: updateError } = await supabase
        .from("restaurants")
        .update(updateData)
        .eq("id", r.id);

      if (updateError) {
        console.log(`ERROR: ${updateError.message}`);
        errors++;
      } else {
        console.log(photoUrl ? "✓ photo added" : "✓ place found, no photo");
        fixed++;
      }
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
      errors++;
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n${"=".repeat(40)}`);
  console.log(`  Fixed:      ${fixed}`);
  console.log(`  Not found:  ${notFound}`);
  console.log(`  Errors:     ${errors}`);
  console.log(`  Total:      ${restaurants?.length ?? 0}`);

  // Deactivate any remaining restaurants without photos
  const { data: stillNoPhoto } = await supabase
    .from("restaurants")
    .select("id, name_en")
    .is("cover_image_url", null)
    .eq("is_active", true);

  if (stillNoPhoto && stillNoPhoto.length > 0) {
    console.log(`\nDeactivating ${stillNoPhoto.length} restaurants still without photos...`);
    const { error: deactivateError } = await supabase
      .from("restaurants")
      .update({ is_active: false })
      .in("id", stillNoPhoto.map((r) => r.id));
    console.log(deactivateError ? `ERROR: ${deactivateError.message}` : "Done");
  }
}

main().catch(console.error);
