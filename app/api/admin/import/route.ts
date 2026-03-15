import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // Verify admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json(
      { data: null, error: "Admin access required" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { query: searchQuery, district } = body;

  const placesApiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!placesApiKey) {
    return NextResponse.json(
      { data: null, error: "Google Places API key not configured" },
      { status: 500 }
    );
  }

  try {
    const textQuery = searchQuery ?? `素食餐廳 ${district ?? "台北"}`;

    // Google Places Text Search (New API)
    const searchResponse = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": placesApiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.websiteUri,places.internationalPhoneNumber,places.currentOpeningHours,places.priceLevel",
        },
        body: JSON.stringify({
          textQuery,
          languageCode: "zh-TW",
          maxResultCount: 20,
        }),
      }
    );

    const searchData = await searchResponse.json();
    const places = searchData.places ?? [];

    const adminClient = createAdminClient();
    const imported: string[] = [];
    const skipped: string[] = [];

    for (const place of places) {
      const nameZh = place.displayName?.text ?? "";
      const slug = nameZh
        .replace(/[^\w\s\u4e00-\u9fff]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .slice(0, 80) || `restaurant-${place.id?.slice(-8)}`;

      // Translate name using OpenAI
      let nameEn = nameZh;
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        try {
          const translateRes = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
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
                    content:
                      "Translate this Chinese restaurant name to natural English. Return ONLY the English name, nothing else.",
                  },
                  { role: "user", content: nameZh },
                ],
                max_tokens: 50,
                temperature: 0,
              }),
            }
          );
          const translateData = await translateRes.json();
          nameEn =
            translateData.choices?.[0]?.message?.content?.trim() ?? nameZh;
        } catch {
          // Use Chinese name as fallback
        }
      }

      const lat = place.location?.latitude;
      const lng = place.location?.longitude;

      const { error } = await adminClient.from("restaurants").upsert(
        {
          google_place_id: place.id,
          name_en: nameEn,
          name_zh: nameZh,
          slug: slug + "-" + (place.id?.slice(-6) ?? ""),
          address_zh: place.formattedAddress,
          city: "Taipei",
          district: district ?? null,
          location: lat && lng ? `POINT(${lng} ${lat})` : null,
          phone: place.internationalPhoneNumber ?? null,
          website: place.websiteUri ?? null,
          google_rating: place.rating ?? null,
          google_maps_url: place.googleMapsUri ?? null,
          vegetarian_types: ["vegetarian_friendly"],
          is_active: true,
        },
        { onConflict: "google_place_id" }
      );

      if (error) {
        skipped.push(`${nameZh}: ${error.message}`);
      } else {
        imported.push(nameEn);
      }
    }

    return NextResponse.json({
      data: {
        total: places.length,
        imported: imported.length,
        skipped: skipped.length,
        importedNames: imported,
        skippedDetails: skipped,
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
