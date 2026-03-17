import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transformRestaurantLocations } from "@/lib/geo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();

  let query = supabase
    .from("restaurants")
    .select("id,name_en,name_zh,slug,district,vegetarian_types,cuisine_tags,price_range,avg_rating,review_count,cover_image_url,location,address_en,is_verified")
    .eq("is_active", true);

  const vegTypes = searchParams.get("vegTypes");
  if (vegTypes) {
    query = query.overlaps("vegetarian_types", vegTypes.split(","));
  }

  const districts = searchParams.get("districts");
  if (districts) {
    const districtList = districts.split(",").filter(Boolean);
    if (districtList.length > 0) {
      query = query.in("district", districtList);
    }
  }

  const priceRanges = searchParams.get("priceRanges");
  if (priceRanges) {
    const priceList = priceRanges.split(",").filter(Boolean);
    if (priceList.length > 0) {
      query = query.in("price_range", priceList);
    }
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
    case "english_friendly":
      query = query.order("english_friendly_avg", { ascending: false, nullsFirst: false });
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
    return NextResponse.json({ data: null, error: "Failed to fetch restaurants" }, { status: 500 });
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

  if (!name_en || typeof name_en !== "string" || name_en.trim().length === 0) {
    return NextResponse.json(
      { data: null, error: "name_en is required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(vegetarian_types) || vegetarian_types.length === 0) {
    return NextResponse.json(
      { data: null, error: "vegetarian_types is required" },
      { status: 400 }
    );
  }

  const trimStr = (v: unknown, max: number): string | null => {
    if (v == null || typeof v !== "string") return null;
    return v.trim().slice(0, max) || null;
  };

  const safeName = name_en.trim().slice(0, 200);
  const slug = safeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now().toString(36);

  const validPrices = ["$", "$$", "$$$", "$$$$"];

  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      name_en: safeName,
      name_zh: trimStr(name_zh, 200),
      slug,
      address_en: trimStr(address_en, 500),
      address_zh: trimStr(address_zh, 500),
      district: trimStr(district, 50),
      price_range: validPrices.includes(price_range) ? price_range : null,
      vegetarian_types: vegetarian_types.slice(0, 6),
      website: trimStr(website, 500),
      description_en: trimStr(description_en, 2000),
      is_verified: false,
      is_active: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: "Failed to create restaurant" }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
