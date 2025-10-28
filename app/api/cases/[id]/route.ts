import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: caseId } = await params;

    if (!caseId) {
      return NextResponse.json(
        { ok: false, error: "Case ID is required" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServerClient();

    // Fetch the case - allows viewing case data for populating forms
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", caseId)
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
