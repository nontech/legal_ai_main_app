import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jurisdiction_id = searchParams.get("jurisdiction_id");

    if (!jurisdiction_id) {
      return NextResponse.json(
        { ok: false, error: "jurisdiction_id query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseCMSClient();
    const { data, error } = await supabase
      .from("judge")
      .select("judge_info")
      .eq("jurisdiction_id", jurisdiction_id)
      .eq("is_active", true);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const judges = data?.map(item => item.judge_info) || [];
    return NextResponse.json({ ok: true, data: judges });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

