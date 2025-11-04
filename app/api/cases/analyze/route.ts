import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { caseId } = await request.json();

        if (!caseId) {
            return NextResponse.json(
                { ok: false, error: "Case ID is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        // Fetch the case details from database
        const { data: caseData, error: caseError } = await supabase
            .from("cases")
            .select("*")
            .eq("id", caseId)
            .single();

        if (caseError || !caseData) {
            console.error("Case fetch error:", caseError);
            return NextResponse.json(
                { ok: false, error: "Case not found" },
                { status: 404 }
            );
        }

        // Extract jurisdiction data
        const jurisdiction = (caseData.jurisdiction ?? {}) as { country?: string; state?: string; city?: string; court?: string };
        const caseDetails = (caseData.case_details ?? {}) as {
            case_information?: Record<string, any>;
            evidence_and_supporting_materials?: Record<string, any>;
            relevant_legal_precedents?: Record<string, any>;
            key_witness_and_testimony?: Record<string, any>;
            police_report?: Record<string, any>;
            potential_challenges_and_weaknesses?: Record<string, any>;
        };
        const caseInformation = caseDetails.case_information ?? {};
        const evidenceSummary = caseDetails.evidence_and_supporting_materials?.summary ?? null;
        const legalPrecedentSummary = caseDetails.relevant_legal_precedents?.summary ?? null;
        const keyWitnessSummary = caseDetails.key_witness_and_testimony?.summary ?? null;
        const policeReportSummary = caseDetails.police_report?.summary || null;
        const weaknessesSummary = caseDetails.potential_challenges_and_weaknesses?.summary || null;

        // Build the request payload for the Azure API
        const analyzePayload = {
            case_data: {
                country: jurisdiction.country as string || null,
                state_province: jurisdiction.state as string || null,
                city: jurisdiction.city as string || null,
                court: jurisdiction.court as string || null,
                case_type: caseData.case_type || null,
                role: caseData.role || null,
                case_number: null,
                case_title: caseInformation.caseName || null,
                case_description: caseInformation.caseDescription || null,
                case_summary: caseInformation.summary || null,
                charges: caseData.charges || [],
                evidence_summary: evidenceSummary || null,
                legal_precedent_summary: legalPrecedentSummary || null,
                key_witnesses_summary: keyWitnessSummary || null,
                police_report_summary: policeReportSummary || null,
                weaknesses_summary: weaknessesSummary || null,
            },
        };
        console.log("Analyze payload:", JSON.stringify(analyzePayload, null, 2));

        console.log("Sending to Azure API:", JSON.stringify(analyzePayload, null, 2));

        // Call the Azure API
        const azureResponse = await fetch(
            "https://legal-case-api.azurewebsites.net/api/v1/prediction/analyze-case",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(analyzePayload),
            }
        );

        if (!azureResponse.ok) {
            const errorData = await azureResponse.text();
            console.error("Azure API error:", errorData);
            return NextResponse.json(
                {
                    ok: false,
                    error: `Azure API error: ${azureResponse.status} ${azureResponse.statusText}`,
                },
                { status: azureResponse.status }
            );
        }

        const analysisResult = await azureResponse.json();
        console.log("Azure API response received:", JSON.stringify(analysisResult, null, 2));

        // Store the analysis result in the database
        const { data: updatedCase, error: updateError } = await supabase
            .from("cases")
            .update({
                result: analysisResult,
            })
            .eq("id", caseId)
            .select("id, result")
            .single();

        if (updateError) {
            console.error("Failed to update case with analysis result:", updateError);
            console.error("Update error details:", updateError.message, updateError.code);
            // Still return the analysis result even if update fails
        } else {
            console.log("Successfully saved analysis result to database for case:", caseId);
            console.log("Updated case data:", updatedCase);
        }

        return NextResponse.json(
            {
                ok: true,
                data: {
                    caseId,
                    result: analysisResult,
                    saved: !updateError,
                },
            },
            { status: 200 }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Case analysis error:", message);
        console.error("Full error:", e);
        return NextResponse.json(
            { ok: false, error: message },
            { status: 500 }
        );
    }
}
