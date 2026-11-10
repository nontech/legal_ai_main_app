import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { captureServerEvent } from "@/lib/analytics/server";

export async function POST(request: Request) {
    try {
        const supabase = await getSupabaseServerClient();
        const { data: userRes } = await supabase.auth.getUser();
        const userId = userRes?.user?.id;

        // Sign out user
        const { error } = await supabase.auth.signOut();
        if (userId) {
            await captureServerEvent(userId, "logged_out", {});
        }

        if (error) {
            console.error("Sign out error:", error);
            // Still return success as we want to clear client-side
        }

        return NextResponse.json(
            { ok: true, message: "Signed out successfully" },
            { status: 200 }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
