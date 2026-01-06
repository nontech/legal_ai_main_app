import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { ok: false, error: "Email is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        // Get the base URL for redirect
        const origin = request.headers.get("origin") || "https://thelawthing.com";

        // Send password reset email
        // Redirect directly to reset-password page - Supabase will append the code parameter
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/reset-password`,
        });

        if (error) {
            console.error("Password reset error:", error);
            return NextResponse.json(
                { ok: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { ok: true, message: "Password reset email sent" },
            { status: 200 }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Forgot password error:", message);
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

