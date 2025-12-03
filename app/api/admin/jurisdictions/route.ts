import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country_id = searchParams.get("country_id");

    if (!country_id) {
      return NextResponse.json(
        { ok: false, error: "country_id query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseCMSClient();
    const { data, error } = await supabase
      .from("jurisdiction")
      .select("id, country_id, state_province, city, court")
      .eq("country_id", country_id)
      .order("state_province, city");

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

