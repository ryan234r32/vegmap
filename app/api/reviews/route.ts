import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json(
      { data: null, error: "restaurantId is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*, profile:profiles(*), photos:review_photos(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null });
}

export async function POST(request: NextRequest) {
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

  const body = await request.json();

  // Validate required fields
  if (!body.restaurant_id || typeof body.restaurant_id !== "string") {
    return NextResponse.json(
      { data: null, error: "restaurant_id is required" },
      { status: 400 }
    );
  }

  const overallRating = Number(body.overall_rating);
  if (!Number.isInteger(overallRating) || overallRating < 1 || overallRating > 5) {
    return NextResponse.json(
      { data: null, error: "overall_rating must be an integer between 1 and 5" },
      { status: 400 }
    );
  }

  // Clamp optional ratings to 1-5
  const clampRating = (v: unknown): number | null => {
    if (v == null) return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 5) return null;
    return n;
  };

  // Sanitize text fields
  const sanitizeText = (v: unknown, maxLen: number): string | null => {
    if (v == null || typeof v !== "string") return null;
    return v.trim().slice(0, maxLen) || null;
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      restaurant_id: body.restaurant_id,
      user_id: user.id,
      overall_rating: overallRating,
      food_rating: clampRating(body.food_rating),
      service_rating: clampRating(body.service_rating),
      value_rating: clampRating(body.value_rating),
      english_friendly_rating: clampRating(body.english_friendly_rating),
      title: sanitizeText(body.title, 200),
      body: sanitizeText(body.body, 5000),
      visit_date: body.visit_date || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
