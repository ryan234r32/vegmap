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

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      restaurant_id: body.restaurant_id,
      user_id: user.id,
      overall_rating: body.overall_rating,
      food_rating: body.food_rating || null,
      service_rating: body.service_rating || null,
      value_rating: body.value_rating || null,
      english_friendly_rating: body.english_friendly_rating || null,
      title: body.title || null,
      body: body.body || null,
      visit_date: body.visit_date || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
