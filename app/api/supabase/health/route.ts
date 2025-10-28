import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
    try {
        const supabase = await getSupabaseServerClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            return NextResponse.json(
                { ok: false, error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json({ ok: true, hasSession: Boolean(data.session) });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}


