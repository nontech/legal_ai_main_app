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
      .from("role")
      .select("role_types")
      .eq("country_id", country_id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    // Return the first matching record's role_types, or empty object if none found
    const roleTypeData = data && data.length > 0 ? data[0].role_types : {};

    return NextResponse.json({ ok: true, data: roleTypeData || {} });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

