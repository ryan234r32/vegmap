import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transformRestaurantLocations } from "@/lib/geo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "0");
  const lng = parseFloat(searchParams.get("lng") ?? "0");
  const radius = Math.min(parseInt(searchParams.get("radius") ?? "2000", 10), 10000);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

  if (!lat || !lng) {
    return NextResponse.json(
      { data: null, error: "lat and lng are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("nearby_restaurants", {
    lat,
    lng,
    radius_meters: radius,
    result_limit: limit,
  });

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  const transformed = transformRestaurantLocations(data ?? []);
  return NextResponse.json(
    { data: transformed, error: null },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
  );
}
