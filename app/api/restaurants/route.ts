import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transformRestaurantLocations } from "@/lib/geo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();

  let query = supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true);

  const vegTypes = searchParams.get("vegTypes");
  if (vegTypes) {
    query = query.overlaps("vegetarian_types", vegTypes.split(","));
  }

  const district = searchParams.get("district");
  if (district) {
    query = query.eq("district", district);
  }

  const priceRange = searchParams.get("priceRange");
  if (priceRange) {
    query = query.eq("price_range", priceRange);
  }

  const minRating = searchParams.get("minRating");
  if (minRating) {
    query = query.gte("avg_rating", parseFloat(minRating));
  }

  const search = searchParams.get("search")?.slice(0, 100);
  if (search) {
    // Escape special Supabase filter characters to prevent injection
    const safe = search.replace(/[%_\\]/g, "\\$&");
    query = query.or(
      `name_en.ilike.%${safe}%,name_zh.ilike.%${safe}%,description_en.ilike.%${safe}%`
    );
  }

  const sortBy = searchParams.get("sortBy") ?? "rating";
  switch (sortBy) {
    case "rating":
      query = query.order("avg_rating", { ascending: false });
      break;
    case "reviews":
      query = query.order("review_count", { ascending: false });
      break;
    case "name":
      query = query.order("name_en", { ascending: true });
      break;
    default:
      query = query.order("avg_rating", { ascending: false });
  }

  const limit = Math.min(parseInt(searchParams.get("limit") ?? "1000", 10), 1000);
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  const transformed = transformRestaurantLocations(data ?? []);

  return NextResponse.json(
    { data: transformed, error: null },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { data: null, error: "Must be logged in to suggest a restaurant" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { name_en, name_zh, address_en, address_zh, district, price_range, vegetarian_types, website, description_en } = body;

  if (!name_en || !vegetarian_types?.length) {
    return NextResponse.json(
      { data: null, error: "name_en and vegetarian_types are required" },
      { status: 400 }
    );
  }

  const slug = name_en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now().toString(36);

  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      name_en,
      name_zh: name_zh || null,
      slug,
      address_en: address_en || null,
      address_zh: address_zh || null,
      district: district || null,
      price_range: price_range || null,
      vegetarian_types,
      website: website || null,
      description_en: description_en || null,
      is_verified: false,
      is_active: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
