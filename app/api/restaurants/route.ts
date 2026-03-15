import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const search = searchParams.get("search");
  if (search) {
    query = query.or(
      `name_en.ilike.%${search}%,name_zh.ilike.%${search}%,description_en.ilike.%${search}%`
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

  const limit = parseInt(searchParams.get("limit") ?? "100", 10);
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null });
}
