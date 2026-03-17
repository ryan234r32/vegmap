import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transformRestaurantLocations } from "@/lib/geo";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin ? user : null;
}

// GET pending restaurants (is_active = false)
export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);

  if (!admin) {
    return NextResponse.json({ data: null, error: "Admin access required" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  const transformed = transformRestaurantLocations(data ?? []);
  return NextResponse.json({ data: transformed, error: null });
}

// PATCH — approve or reject a restaurant submission
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);

  if (!admin) {
    return NextResponse.json({ data: null, error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { restaurantId, action } = body;

  if (!restaurantId || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { data: null, error: "restaurantId and action (approve|reject) required" },
      { status: 400 }
    );
  }

  if (action === "approve") {
    const { data, error } = await supabase
      .from("restaurants")
      .update({ is_active: true })
      .eq("id", restaurantId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data, error: null });
  }

  // Reject = delete
  const { error } = await supabase
    .from("restaurants")
    .delete()
    .eq("id", restaurantId);

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: null, error: null });
}
