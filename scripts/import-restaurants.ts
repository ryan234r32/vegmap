/**
 * Full Taipei Vegetarian Restaurant Import Pipeline
 *
 * Searches all 12 Taipei districts via Google Places Text Search (New API),
 * translates names with GPT-4o-mini, infers vegetarian type, and upserts to Supabase.
 *
 * Usage:
 *   npx tsx scripts/import-restaurants.ts              # Full import
 *   npx tsx scripts/import-restaurants.ts --dry-run     # Preview without writing
 *   npx tsx scripts/import-restaurants.ts --district 大安  # Single district
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_PLACES_API_KEY
 *   OPENAI_API_KEY (optional, for translation)
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const placesApiKey = process.env.GOOGLE_PLACES_API_KEY!;
const openaiKey = process.env.OPENAI_API_KEY;

const DISTRICTS = [
  { en: "Da'an", zh: "大安" },
  { en: "Zhongshan", zh: "中山" },
  { en: "Xinyi", zh: "信義" },
  { en: "Zhongzheng", zh: "中正" },
  { en: "Songshan", zh: "松山" },
  { en: "Wanhua", zh: "萬華" },
  { en: "Datong", zh: "大同" },
  { en: "Shilin", zh: "士林" },
  { en: "Beitou", zh: "北投" },
  { en: "Neihu", zh: "內湖" },
  { en: "Nangang", zh: "南港" },
  { en: "Wenshan", zh: "文山" },
];

const SEARCH_TEMPLATES = [
  // Core vegetarian searches (Chinese)
  "素食餐廳 {zh}區 台北",
  "蔬食 {zh}區 台北",
  "素食 {zh}區 台北市",
  // Specific sub-categories
  "素食自助餐 {zh}區",
  "全素 {zh}區 台北",
  "素食小吃 {zh}區",
  "蔬食咖啡 {zh}區",
  "素食早餐 {zh}區",
  // English searches (use English district names)
  "vegan restaurant {en} Taipei",
  "vegetarian {en} Taipei",
];

// Taipei bounding box for validation
const TAIPEI_BOUNDS = {
  minLat: 24.96,
  maxLat: 25.22,
  minLng: 121.43,
  maxLng: 121.67,
};

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.googleMapsUri",
  "places.websiteUri",
  "places.internationalPhoneNumber",
  "places.priceLevel",
].join(",");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function isInTaipei(lat: number, lng: number): boolean {
  return (
    lat >= TAIPEI_BOUNDS.minLat &&
    lat <= TAIPEI_BOUNDS.maxLat &&
    lng >= TAIPEI_BOUNDS.minLng &&
    lng <= TAIPEI_BOUNDS.maxLng
  );
}

function inferPriceRange(priceLevel?: string): string {
  switch (priceLevel) {
    case "PRICE_LEVEL_FREE":
    case "PRICE_LEVEL_INEXPENSIVE":
      return "$";
    case "PRICE_LEVEL_MODERATE":
      return "$$";
    case "PRICE_LEVEL_EXPENSIVE":
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return "$$$";
    default:
      return "$$";
  }
}

async function translateAndClassify(
  nameZh: string,
  addressZh: string
): Promise<{
  nameEn: string;
  vegTypes: string[];
  descriptionEn: string;
}> {
  if (!openaiKey) {
    return {
      nameEn: nameZh,
      vegTypes: ["vegetarian_friendly"],
      descriptionEn: "",
    };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You translate and classify Taiwanese vegetarian restaurants.
Given a Chinese restaurant name and address, return JSON:
{
  "name_en": "Natural English name (not literal translation)",
  "veg_types": ["vegan" | "ovo_lacto" | "five_spice" | "vegetarian_friendly"],
  "description_en": "1-2 sentence description of likely cuisine and style"
}

Classification rules:
- If name contains 全素/純素/vegan → ["vegan"]
- If name contains 蔬食/素食 without further specification → ["ovo_lacto", "vegan"]
- If name contains 愛家 (Loving Hut) → ["vegan", "five_spice"]
- If it's a general restaurant with veg options → ["vegetarian_friendly"]
- Default to ["ovo_lacto"] if unsure but clearly vegetarian

Return ONLY valid JSON, no markdown.`,
          },
          {
            role: "user",
            content: `Name: ${nameZh}\nAddress: ${addressZh}`,
          },
        ],
        max_tokens: 200,
        temperature: 0,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(content);

    return {
      nameEn: parsed.name_en || nameZh,
      vegTypes: parsed.veg_types || ["vegetarian_friendly"],
      descriptionEn: parsed.description_en || "",
    };
  } catch {
    return {
      nameEn: nameZh,
      vegTypes: ["vegetarian_friendly"],
      descriptionEn: "",
    };
  }
}

async function searchPlaces(query: string): Promise<unknown[]> {
  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": placesApiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "zh-TW",
        maxResultCount: 20,
      }),
    }
  );

  const data = await res.json();
  return data.places ?? [];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const districtArg = args.find((_, i, a) => a[i - 1] === "--district");

  // Validate env
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
    process.exit(1);
  }
  if (!placesApiKey) {
    console.error("Missing: GOOGLE_PLACES_API_KEY");
    process.exit(1);
  }

  if (dryRun) console.log("*** DRY RUN — no data will be written ***\n");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Get existing google_place_ids for dedup
  const { data: existing } = await supabase
    .from("restaurants")
    .select("google_place_id")
    .not("google_place_id", "is", null);
  const existingIds = new Set(
    (existing ?? []).map((r) => r.google_place_id).filter(Boolean)
  );
  console.log(`Found ${existingIds.size} existing restaurants in DB.\n`);

  // Filter districts
  const districts = districtArg
    ? DISTRICTS.filter((d) => d.zh === districtArg || d.en === districtArg)
    : DISTRICTS;

  if (districts.length === 0) {
    console.error(`District "${districtArg}" not found.`);
    process.exit(1);
  }

  const allPlaces = new Map<string, Record<string, unknown>>();
  let apiCalls = 0;

  // Search each district with multiple queries
  const totalSearches = districts.length * SEARCH_TEMPLATES.length;
  let searchCount = 0;

  for (const district of districts) {
    console.log(`\n=== ${district.en} (${district.zh}) ===`);
    const beforeCount = allPlaces.size;

    for (const template of SEARCH_TEMPLATES) {
      searchCount++;
      const query = template
        .replace("{zh}", district.zh)
        .replace("{en}", district.en);
      const pct = Math.round((searchCount / totalSearches) * 100);
      process.stdout.write(`  [${pct}%] Searching: "${query}" ... `);

      try {
        const places = await searchPlaces(query);
        apiCalls++;
        let newInBatch = 0;

        for (const place of places as Record<string, unknown>[]) {
          const id = place.id as string;
          if (!id || allPlaces.has(id)) continue;

          const loc = place.location as
            | { latitude: number; longitude: number }
            | undefined;
          if (loc && !isInTaipei(loc.latitude, loc.longitude)) continue;

          (place as Record<string, unknown>).__district = district;
          allPlaces.set(id, place);
          newInBatch++;
        }

        console.log(`${places.length} results, ${newInBatch} new`);
      } catch (err) {
        console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
      }

      // Rate limit: 150ms between requests
      await new Promise((r) => setTimeout(r, 150));
    }

    const districtNew = allPlaces.size - beforeCount;
    console.log(`  → ${district.en} total: ${districtNew} unique places found`);
  }

  console.log(`\n=== Summary ===`);
  console.log(`API calls: ${apiCalls}`);
  console.log(`Total unique places found: ${allPlaces.size}`);
  console.log(
    `Already in DB: ${[...allPlaces.keys()].filter((id) => existingIds.has(id)).length}`
  );
  const newPlaces = [...allPlaces.entries()].filter(
    ([id]) => !existingIds.has(id)
  );
  console.log(`New to import: ${newPlaces.length}\n`);

  if (dryRun) {
    console.log("Places that would be imported:");
    for (const [, place] of newPlaces) {
      const name = (place.displayName as { text: string })?.text ?? "Unknown";
      const dist = (place.__district as { en: string }).en;
      console.log(`  - ${name} (${dist})`);
    }
    console.log(`\nDry run complete. ${newPlaces.length} places would be imported.`);
    return;
  }

  // Import new places
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const total = newPlaces.length;
  const districtStats: Record<string, number> = {};

  console.log(`Importing ${total} new restaurants...\n`);

  for (let i = 0; i < newPlaces.length; i++) {
    const [id, place] = newPlaces[i];
    const nameZh = (place.displayName as { text: string })?.text ?? "";
    const addressZh = (place.formattedAddress as string) ?? "";
    const loc = place.location as { latitude: number; longitude: number };
    const district = place.__district as { en: string; zh: string };
    const pct = Math.round(((i + 1) / total) * 100);

    process.stdout.write(`  [${pct}%] ${nameZh} → `);

    // Translate and classify
    const { nameEn, vegTypes, descriptionEn } = await translateAndClassify(
      nameZh,
      addressZh
    );

    const slug =
      slugify(nameEn || nameZh) + "-" + (id?.slice(-6) ?? "");

    const { error } = await supabase.from("restaurants").upsert(
      {
        google_place_id: id,
        name_en: nameEn,
        name_zh: nameZh,
        slug,
        description_en: descriptionEn || null,
        address_zh: addressZh,
        city: "Taipei",
        district: district.en,
        location: loc ? `POINT(${loc.longitude} ${loc.latitude})` : null,
        phone: (place.internationalPhoneNumber as string) ?? null,
        website: (place.websiteUri as string) ?? null,
        google_rating: (place.rating as number) ?? null,
        google_maps_url: (place.googleMapsUri as string) ?? null,
        price_range: inferPriceRange(place.priceLevel as string),
        vegetarian_types: vegTypes,
        is_active: true,
      },
      { onConflict: "google_place_id" }
    );

    if (error) {
      console.log(`ERROR: ${error.message}`);
      errors++;
    } else {
      console.log(`${nameEn} [${vegTypes.join(", ")}] (${district.en})`);
      imported++;
      districtStats[district.en] = (districtStats[district.en] ?? 0) + 1;
    }

    // Rate limit for OpenAI
    await new Promise((r) => setTimeout(r, 50));
  }

  // Final summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`  IMPORT COMPLETE`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  New imported:  ${imported}`);
  console.log(`  Already in DB: ${existingIds.size}`);
  console.log(`  Skipped:       ${skipped}`);
  console.log(`  Errors:        ${errors}`);
  console.log(`  API calls:     ${apiCalls}`);
  console.log(`  Total in DB:   ~${existingIds.size + imported}`);
  console.log();

  if (Object.keys(districtStats).length > 0) {
    console.log(`  By district:`);
    const sorted = Object.entries(districtStats).sort(([, a], [, b]) => b - a);
    for (const [dist, count] of sorted) {
      console.log(`    ${dist.padEnd(12)} ${count}`);
    }
  }
}

main().catch(console.error);
