import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function PATCH(request: Request) {
    try {
        const { caseId, field, value } = await request.json();

        if (!caseId || !field) {
            return NextResponse.json(
                { ok: false, error: "caseId and field are required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr && userErr.message !== "Auth session missing!") {
            return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
        }

        if (!userRes?.user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        // Build update object dynamically
        const updateData: Record<string, any> = {};
        updateData[field] = value;

        const { data, error } = await supabase
            .from("cases")
            .update(updateData)
            .eq("id", caseId)
            .eq("owner_id", userRes.user.id)
            .select();

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { ok: false, error: "Case not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true, case: data[0] }, { status: 200 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
