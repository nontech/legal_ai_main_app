import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
    try {
        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr || !userRes?.user) {
            return NextResponse.json(
                { ok: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            ok: true,
            email: userRes.user.email,
            id: userRes.user.id,
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
