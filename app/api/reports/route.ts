import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Reports list requires admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
  }

  const restaurantId = request.nextUrl.searchParams.get("restaurantId");

  let query = supabase
    .from("reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(100);

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ data: null, error: "Failed to fetch reports" }, { status: 500 });
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

  if (!restaurantId || typeof restaurantId !== "string") {
    return NextResponse.json(
      { data: null, error: "restaurantId is required" },
      { status: 400 }
    );
  }

  const validReportTypes = ["closed", "relocated", "wrong_veg_type", "hidden_ingredients", "wrong_hours", "wrong_address", "other"];
  if (!reportType || !validReportTypes.includes(reportType)) {
    return NextResponse.json(
      { data: null, error: "Invalid reportType" },
      { status: 400 }
    );
  }

  const safeDescription = typeof description === "string" ? description.trim().slice(0, 2000) : null;
  const safeIngredients = Array.isArray(hiddenIngredients)
    ? hiddenIngredients.filter((i: unknown) => typeof i === "string").slice(0, 20)
    : [];

  const { data, error } = await supabase
    .from("reports")
    .insert({
      restaurant_id: restaurantId,
      user_id: user.id,
      report_type: reportType,
      description: safeDescription,
      hidden_ingredients: safeIngredients,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: "Failed to create report" }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
