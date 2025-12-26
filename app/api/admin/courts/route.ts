import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country_id = searchParams.get("country_id");
    const jurisdiction_id = searchParams.get("jurisdiction_id");

    if (!country_id) {
      return NextResponse.json(
        {
          ok: false,
          error: "country_id query parameter is required",
        },
        { status: 400 }
      );
    }

    if (!jurisdiction_id) {
      return NextResponse.json(
        {
          ok: false,
          error: "jurisdiction_id query parameter is required",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseCMSClient();
    const { data, error } = await supabase
      .from("courts")
      .select(
        "id, country_id, jurisdiction_id, court_level_id, name, official_name"
      )
      .eq("country_id", country_id)
      .eq("jurisdiction_id", jurisdiction_id)
      .order("name");

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
