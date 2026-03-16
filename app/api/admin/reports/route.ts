import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

// GET all reports (admin only)
export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);

  if (!admin) {
    return NextResponse.json({ data: null, error: "Admin access required" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*, restaurant:restaurants(id, name_en, name_zh, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null });
}

// PATCH — resolve or dismiss a report
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);

  if (!admin) {
    return NextResponse.json({ data: null, error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { reportId, status, adminNotes } = body;

  if (!reportId || !status || !["resolved", "dismissed"].includes(status)) {
    return NextResponse.json(
      { data: null, error: "reportId and status (resolved|dismissed) required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("reports")
    .update({
      status,
      admin_notes: adminNotes || null,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null });
}
