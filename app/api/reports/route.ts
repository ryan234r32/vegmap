import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const restaurantId = request.nextUrl.searchParams.get("restaurantId");

  let query = supabase
    .from("reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

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
      { data: null, error: "Must be logged in to report an issue" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { restaurantId, reportType, description, hiddenIngredients } = body;

  if (!restaurantId || !reportType) {
    return NextResponse.json(
      { data: null, error: "restaurantId and reportType are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      restaurant_id: restaurantId,
      user_id: user.id,
      report_type: reportType,
      description: description || null,
      hidden_ingredients: hiddenIngredients || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
