import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function PATCH(request: Request) {
    try {
        const { caseId, field, value, case_type, role, jurisdiction } = await request.json();

        if (!caseId) {
            return NextResponse.json(
                { ok: false, error: "caseId is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();
        // const { data: userRes, error: userErr } = await supabase.auth.getUser();

        // if (userErr && userErr.message !== "Auth session missing!") {
        //     return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
        // }

        // if (!userRes?.user) {
        //     return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        // }

        // Build update object dynamically
        const updateData: Record<string, any> = {};

        // Add field and value if provided
        if (field && value !== undefined) {
            // Special handling for case_details: merge with existing data
            if (field === "case_details") {
                // First, fetch the existing case to get current case_details
                const { data: existingCase, error: fetchError } = await supabase
                    .from("cases")
                    .select("case_details")
                    .eq("id", caseId)
                    .single();

                if (fetchError) {
                    return NextResponse.json(
                        { ok: false, error: fetchError.message },
                        { status: 500 }
                    );
                }

                // Merge existing case_details with new value
                const existingDetails = (existingCase && typeof existingCase.case_details === 'object' && existingCase.case_details !== null)
                    ? existingCase.case_details
                    : {};
                updateData[field] = {
                    ...(typeof existingDetails === "object" && existingDetails !== null ? existingDetails : {}),
                    ...(typeof value === "object" && value !== null ? value : {}),
                };
            } else {
                updateData[field] = value;
            }
        }

        // Add case_type if provided
        if (case_type !== undefined) {
            updateData.case_type = case_type;
        }

        // Add role if provided
        if (role !== undefined) {
            updateData.role = role;
        }

        // Add jurisdiction if provided
        if (jurisdiction !== undefined) {
            updateData.jurisdiction = jurisdiction;
        }

        // If no fields to update, return error
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { ok: false, error: "No fields to update" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("cases")
            .update(updateData)
            .eq("id", caseId)
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
