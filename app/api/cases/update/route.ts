import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function PATCH(request: Request) {
    try {
        const { caseId, field, value, case_type, role, jurisdiction, charges } = await request.json();

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

                // Merge existing case_details with new value (deep merge for nested objects)
                const existingDetails = (existingCase && typeof existingCase.case_details === 'object' && existingCase.case_details !== null)
                    ? existingCase.case_details
                    : {};

                // Deep merge function for nested objects
                const deepMerge = (target: any, source: any): any => {
                    if (source === null || typeof source !== "object" || Array.isArray(source)) {
                        return source;
                    }

                    const result = { ...target };
                    for (const key in source) {
                        if (source.hasOwnProperty(key)) {
                            if (
                                typeof source[key] === "object" &&
                                source[key] !== null &&
                                !Array.isArray(source[key]) &&
                                typeof target[key] === "object" &&
                                target[key] !== null &&
                                !Array.isArray(target[key])
                            ) {
                                // Recursively merge nested objects
                                result[key] = deepMerge(target[key], source[key]);
                            } else {
                                // Overwrite with new value
                                result[key] = source[key];
                            }
                        }
                    }
                    return result;
                };

                updateData[field] = deepMerge(
                    typeof existingDetails === "object" && existingDetails !== null ? existingDetails : {},
                    typeof value === "object" && value !== null ? value : {}
                );
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

        // Add charges if provided
        if (charges !== undefined) {
            updateData.charges = charges;

            // Initialize verdicts for each charge with "pending" status
            const initialVerdicts: Record<string, string> = {};
            if (Array.isArray(charges)) {
                charges.forEach((charge: any) => {
                    initialVerdicts[charge.id] = "pending";
                });
            }
            updateData.verdict = initialVerdicts;
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
