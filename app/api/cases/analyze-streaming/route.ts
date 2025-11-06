import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { caseId } = await request.json();

        if (!caseId) {
            return NextResponse.json(
                { ok: false, error: "Case ID is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

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

        const jurisdiction = (caseData.jurisdiction ?? {}) as {
            country?: string;
            state?: string;
            city?: string;
            court?: string;
        };

        const caseDetails = (caseData.case_details ?? {}) as {
            case_information?: Record<string, any>;
            evidence_and_supporting_materials?: Record<string, any>;
            relevant_legal_precedents?: Record<string, any>;
            key_witness_and_testimony?: Record<string, any>;
            key_witnesses_and_testimony?: Record<string, any>;
            police_report?: Record<string, any>;
            potential_challenges_and_weaknesses?: Record<string, any>;
        };

        const caseInformation = caseDetails.case_information ?? {};
        const evidenceSummary =
            caseDetails.evidence_and_supporting_materials?.summary ?? null;
        const legalPrecedentSummary =
            caseDetails.relevant_legal_precedents?.summary ?? null;
        const keyWitnessSummary =
            caseDetails.key_witness_and_testimony?.summary ??
            caseDetails.key_witnesses_and_testimony?.summary ??
            null;
        const policeReportSummary =
            caseDetails.police_report?.summary || null;
        const weaknessesSummary =
            caseDetails.potential_challenges_and_weaknesses?.summary ||
            null;

        const analyzePayload = {
            case_data: {
                country: (jurisdiction.country as string) || null,
                state_province: (jurisdiction.state as string) || null,
                city: (jurisdiction.city as string) || null,
                court: (jurisdiction.court as string) || null,
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

        console.log(
            "Sending to Azure streaming API:",
            JSON.stringify(analyzePayload, null, 2)
        );

        // Create a transform stream to handle the streaming response
        const encoder = new TextEncoder();

        const customReadable = new ReadableStream({
            async start(controller) {
                try {
                    const azureResponse = await fetch(
                        "https://legal-case-api.azurewebsites.net/api/v1/prediction/analyze-case-streaming",
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
                        console.error("Azure streaming API error:", errorData);
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "error",
                                    message: `Azure API error: ${azureResponse.status}`,
                                })}\n\n`
                            )
                        );
                        controller.close();
                        return;
                    }

                    if (!azureResponse.body) {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "error",
                                    message: "No response body from Azure API",
                                })}\n\n`
                            )
                        );
                        controller.close();
                        return;
                    }

                    const reader = azureResponse.body.getReader();
                    let lastResult: any = null;

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = new TextDecoder().decode(value);
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ")) {
                                    const data = line.slice(6);
                                    if (data.trim()) {
                                        try {
                                            const parsed = JSON.parse(data);
                                            // Store the last result for database update
                                            if (parsed.type === "complete" && parsed.result) {
                                                lastResult = parsed.result;
                                            }
                                            // Forward all events to client
                                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                                        } catch (e) {
                                            console.error("Failed to parse SSE data:", data);
                                        }
                                    }
                                }
                            }
                        }
                    } finally {
                        reader.releaseLock();
                    }

                    // After streaming is complete, update the database with final result
                    if (lastResult) {
                        console.log("Updating database with final analysis result");
                        const { error: updateError } = await supabase
                            .from("cases")
                            .update({
                                result: lastResult,
                            })
                            .eq("id", caseId);

                        if (updateError) {
                            console.error(
                                "Failed to update case with analysis result:",
                                updateError
                            );
                        } else {
                            console.log(
                                "Successfully saved streaming analysis result to database for case:",
                                caseId
                            );
                        }
                    }

                    controller.close();
                } catch (error) {
                    console.error("Streaming error:", error);
                    const errorMessage =
                        error instanceof Error ? error.message : "Unknown error";
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: "error",
                                message: errorMessage,
                            })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new NextResponse(customReadable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Case streaming analysis error:", message);
        console.error("Full error:", e);
        return NextResponse.json(
            { ok: false, error: message },
            { status: 500 }
        );
    }
}

