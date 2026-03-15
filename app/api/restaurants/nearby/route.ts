import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "0");
  const lng = parseFloat(searchParams.get("lng") ?? "0");
  const radius = parseInt(searchParams.get("radius") ?? "2000", 10);
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

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

  return NextResponse.json({ data, error: null });
}
