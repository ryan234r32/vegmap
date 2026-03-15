import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

  const { data, error } = await supabase
    .from("favorite_lists")
    .select("*, items:favorite_items(*, restaurant:restaurants(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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

  // Add restaurant to favorites (create default list if needed)
  if (body.restaurant_id) {
    // Get or create default list
    let { data: list } = await supabase
      .from("favorite_lists")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", "My Favorites")
      .single();

    if (!list) {
      const { data: newList } = await supabase
        .from("favorite_lists")
        .insert({
          user_id: user.id,
          name: "My Favorites",
          is_public: false,
        })
        .select("id")
        .single();
      list = newList;
    }

    if (!list) {
      return NextResponse.json(
        { data: null, error: "Failed to create favorites list" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("favorite_items")
      .upsert(
        {
          list_id: list.id,
          restaurant_id: body.restaurant_id,
          note: body.note || null,
        },
        { onConflict: "list_id,restaurant_id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, error: null }, { status: 201 });
  }

  return NextResponse.json(
    { data: null, error: "restaurant_id is required" },
    { status: 400 }
  );
}

export async function DELETE(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json(
      { data: null, error: "restaurantId is required" },
      { status: 400 }
    );
  }

  // Delete from all user's lists
  const { data: lists } = await supabase
    .from("favorite_lists")
    .select("id")
    .eq("user_id", user.id);

  if (lists && lists.length > 0) {
    await supabase
      .from("favorite_items")
      .delete()
      .in(
        "list_id",
        lists.map((l) => l.id)
      )
      .eq("restaurant_id", restaurantId);
  }

  return NextResponse.json({ data: null, error: null });
}
