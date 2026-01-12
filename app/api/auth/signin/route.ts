import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    try {
        const { email, password, caseId } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { ok: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        // Sign in user
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            return NextResponse.json(
                { ok: false, error: signInError.message },
                { status: 401 }
            );
        }

        const userId = signInData?.user?.id;
        if (!userId) {
            return NextResponse.json(
                { ok: false, error: "Failed to sign in user" },
                { status: 500 }
            );
        }

        // If caseId provided, link case to user using admin client
        // Only claim ownership if the case is unowned (owner_id is null)
        if (caseId) {
            try {
                const adminClient = getSupabaseAdminClient();
                const { error: updateError } = await adminClient
                    .from("cases")
                    .update({ owner_id: userId })
                    .eq("id", caseId)
                    .is("owner_id", null);

                if (updateError) {
                    console.error("Error linking case to user:", updateError);
                }
            } catch (e) {
                console.error("Admin client error:", e);
            }
        }

        return NextResponse.json(
            { ok: true, user: signInData.user, email: signInData.user?.email, caseId },
            { status: 200 }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
