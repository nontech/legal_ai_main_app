import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id: caseId } = await params;
        const { title } = await request.json();

        if (!caseId) {
            return NextResponse.json(
                { ok: false, error: "Case ID is required" },
                { status: 400 }
            );
        }

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json(
                { ok: false, error: "Valid title is required" },
                { status: 400 }
            );
        }

        // Authenticate the user
        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr || !userRes?.user) {
            return NextResponse.json(
                { ok: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check case ownership using admin client
        const adminClient = getSupabaseAdminClient();
        const { data: caseData, error: fetchError } = await adminClient
            .from("cases")
            .select("owner_id, case_details")
            .eq("id", caseId)
            .single();

        if (fetchError || !caseData) {
            return NextResponse.json(
                { ok: false, error: "Case not found" },
                { status: 404 }
            );
        }

        // Verify ownership
        if (caseData.owner_id !== userRes.user.id) {
            return NextResponse.json(
                { ok: false, error: "Unauthorized: You don't own this case" },
                { status: 403 }
            );
        }

        // Update the case title in case_details.case_information.caseName
        const updatedCaseDetails = {
            ...caseData.case_details,
            case_information: {
                ...(caseData.case_details?.case_information || {}),
                caseName: title.trim(),
            },
        };

        // Update using admin client to ensure success
        const { error: updateError } = await adminClient
            .from("cases")
            .update({ case_details: updatedCaseDetails })
            .eq("id", caseId);

        if (updateError) {
            console.error("Error updating case title:", updateError);
            return NextResponse.json(
                { ok: false, error: "Failed to update case title" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            title: title.trim(),
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Error in case title update:", e);
        return NextResponse.json(
            { ok: false, error: message },
            { status: 500 }
        );
    }
}
