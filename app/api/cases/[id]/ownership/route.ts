import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id: caseId } = await params;

        if (!caseId) {
            return NextResponse.json(
                { ok: false, error: "Case ID is required", isOwner: false },
                { status: 400 }
            );
        }

        // Use regular client to authenticate the user
        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr || !userRes?.user) {
            return NextResponse.json(
                { ok: false, error: "Not authenticated", isOwner: false },
                { status: 401 }
            );
        }

        // Use admin client to bypass RLS and check case ownership
        const adminClient = getSupabaseAdminClient();
        const { data: caseData, error: caseError } = await adminClient
            .from("cases")
            .select("owner_id")
            .eq("id", caseId)
            .single();

        if (caseError || !caseData) {
            console.error(`[Ownership API] Case not found: ${caseId}`, caseError);
            return NextResponse.json(
                { ok: false, error: "Case not found", isOwner: false },
                { status: 404 }
            );
        }

        const isOwner = caseData.owner_id === userRes.user.id;
        console.log(`[Ownership API] Case ${caseId}: owner_id=${caseData.owner_id}, user_id=${userRes.user.id}, isOwner=${isOwner}`);

        return NextResponse.json({
            ok: true,
            isOwner,
            caseId,
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json(
            { ok: false, error: message, isOwner: false },
            { status: 500 }
        );
    }
}
