import { NextResponse } from "next/server";
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";

export async function GET() {
  try {
    const supabase = getSupabaseCMSClient();
    const { data, error } = await supabase
      .from("countries")
      .select("id, name")
      .eq("is_active", true)
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

