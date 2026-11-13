import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { backendFetch, backendPaths } from "@/lib/backend";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { checkAndConsumeUserCredits } from "@/lib/rateLimit";
import { captureServerEvent, distinctIdFromRequest } from "@/lib/analytics/server";
import type { Json } from "@/types/supabase";
import { isSubstantiveCaseEntityRelationships } from "@/lib/types/caseEntityRelationships";
import {
    ANALYSIS_TOO_LONG_MESSAGE,
    analysisDurationExceeded,
    analysisErrorFrame,
    analysisProxyDeadlineMs,
    interpretSseBlock,
    takeCompleteSseEvents,
} from "@/lib/analysisStream";

// Hobby + Fluid compute allows 300s, matching Cloud Run. See lib/proxyDuration.ts.
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { caseId, language_code = "en" } = await request.json();

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

        // Credit check for authenticated users who own the case
        const { data: userRes } = await supabase.auth.getUser();
        if (userRes?.user && caseData.owner_id === userRes.user.id) {
            const adminClient = getSupabaseAdminClient();
            const creditResult = await checkAndConsumeUserCredits(
                userRes.user.id,
                "analysis",
                adminClient
            );
            if (!creditResult.allowed) {
                await captureServerEvent(
                    distinctIdFromRequest(request, userRes.user.id),
                    "rate_limit_hit",
                    { limit: "user_analysis" }
                );
                return NextResponse.json(
                    { ok: false, error: creditResult.error },
                    { status: 402 }
                );
            }
        }

        const jurisdiction = (caseData.jurisdiction ?? {}) as {
            country?: string;
            state?: string;
            city?: string;
            court?: string;
        };

        const caseDetails = (caseData.case_details ?? {}) as {
            case_information?: Record<string, any>;
            contracts?: Record<string, any>;
            evidence_and_supporting_materials?: Record<string, any>;
            relevant_legal_precedents?: Record<string, any>;
            key_witness_and_testimony?: Record<string, any>;
            key_witnesses_and_testimony?: Record<string, any>;
            police_report?: Record<string, any>;
            potential_challenges_and_weaknesses?: Record<string, any>;
        };

        const caseInformation = caseDetails.case_information ?? {};
        const caseInfoRecord = caseInformation as Record<string, unknown>;
        const partiesHint = Array.isArray(caseInfoRecord.parties)
            ? (caseInfoRecord.parties as Record<string, unknown>[])
            : undefined;
        const entitiesHint = Array.isArray(caseInfoRecord.entities)
            ? (caseInfoRecord.entities as Record<string, unknown>[])
            : undefined;
        const contractsSummary =
            caseDetails.contracts?.summary ?? null;
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

        const storedGraph = caseData.entity_relationship;
        const caseEntityRelationshipsPayload =
            isSubstantiveCaseEntityRelationships(storedGraph)
                ? { case_entity_relationships: storedGraph as Json }
                : {};

        const analyzePayload = {
            case_data: {
                country: (jurisdiction.country as string) || null,
                state_province: (jurisdiction.state as string) || null,
                city: (jurisdiction.city as string) || null,
                court: (jurisdiction.court as string) || null,
                case_type: caseData.case_type || null,
                role: caseData.role || null,
                tenancy_status: caseData.tenancy_status || null,
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
                contracts_summary: contractsSummary || null,
                case_id: caseId,
                ...(partiesHint?.length ? { parties: partiesHint } : {}),
                ...(entitiesHint?.length ? { entities: entitiesHint } : {}),
                ...caseEntityRelationshipsPayload,
            },
            language_code,
        };

        console.log("Sending analysis request for case", caseId);

        const analyticsDistinctId = distinctIdFromRequest(
            request,
            userRes?.user?.id ?? null
        );
        const analysisStartedAt = Date.now();

        // Create a transform stream to handle the streaming response
        const encoder = new TextEncoder();

        const customReadable = new ReadableStream({
            async start(controller) {
                // Get a fresh Supabase client for this stream context
                const streamSupabase = await getSupabaseServerClient();
                let analysisSettled = false;
                const finishAnalysis = async (
                    outcome: "completed" | "failed",
                    errorCode?: string
                ) => {
                    if (analysisSettled) return;
                    analysisSettled = true;
                    const duration_ms = Date.now() - analysisStartedAt;
                    if (outcome === "completed") {
                        await captureServerEvent(
                            analyticsDistinctId,
                            "analysis_completed",
                            { duration_ms }
                        );
                        return;
                    }
                    await captureServerEvent(analyticsDistinctId, "analysis_failed", {
                        duration_ms,
                        error_code: errorCode ?? "unknown",
                    });
                };

                try {
                    await captureServerEvent(
                        analyticsDistinctId,
                        "analysis_started",
                        {}
                    );
                    const analysisResponse = await backendFetch(
                        backendPaths.analyzeCaseStreaming,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(analyzePayload),
                            incomingAuthorization: request.headers.get("authorization"),
                        }
                    );

                    if (!analysisResponse.ok) {
                        await analysisResponse.text().catch(() => "");
                        console.error("Analysis API error status:", analysisResponse.status);
                        await captureServerEvent(
                            analyticsDistinctId,
                            "backend_error",
                            {
                                route: "/api/cases/analyze-streaming",
                                status: analysisResponse.status,
                            }
                        );
                        await finishAnalysis("failed", `http_${analysisResponse.status}`);
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "error",
                                    message: `Analysis API error: ${analysisResponse.status}`,
                                })}\n\n`
                            )
                        );
                        controller.close();
                        return;
                    }

                    if (!analysisResponse.body) {
                        await finishAnalysis("failed", "no_body");
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "error",
                                    message: "No response body from analysis API",
                                })}\n\n`
                            )
                        );
                        controller.close();
                        return;
                    }

                    const reader = analysisResponse.body.getReader();
                    const decoder = new TextDecoder();
                    let lastResult: any = null;
                    let sawComplete = false;
                    let buffer = "";
                    const streamStartedAt = Date.now();

                    const forwardBlock = (block: string) => {
                        for (const action of interpretSseBlock(block)) {
                            if (action.action === "ignore") continue;
                            if (action.action === "event" && action.type === "complete") {
                                sawComplete = true;
                                if (action.result !== undefined) {
                                    lastResult = action.result;
                                    console.log("Captured complete analysis event");
                                }
                            }
                            controller.enqueue(encoder.encode(action.frame));
                        }
                    };

                    const readOrDeadline = () => {
                        let timer: ReturnType<typeof setTimeout> | undefined;
                        const readPromise = reader.read().then(
                            (chunk) => ({ timedOut: false as const, chunk }),
                            () => ({
                                timedOut: false as const,
                                chunk: { done: true as const, value: undefined },
                            }),
                        );
                        const timeoutPromise = new Promise<{ timedOut: true }>((resolve) => {
                            const waitMs = Math.max(
                                0,
                                streamStartedAt + analysisProxyDeadlineMs() - Date.now(),
                            );
                            timer = setTimeout(() => resolve({ timedOut: true }), waitMs);
                        });
                        return Promise.race([readPromise, timeoutPromise]).finally(() => {
                            if (timer) clearTimeout(timer);
                        });
                    };

                    try {
                        while (true) {
                            if (analysisDurationExceeded(streamStartedAt, Date.now(), sawComplete)) {
                                await reader.cancel().catch(() => undefined);
                                controller.enqueue(
                                    encoder.encode(analysisErrorFrame(ANALYSIS_TOO_LONG_MESSAGE)),
                                );
                                await finishAnalysis("failed", "timeout");
                                controller.close();
                                return;
                            }

                            const next = await readOrDeadline();
                            if (next.timedOut || analysisDurationExceeded(streamStartedAt, Date.now(), sawComplete)) {
                                await reader.cancel().catch(() => undefined);
                                if (!sawComplete) {
                                    controller.enqueue(
                                        encoder.encode(analysisErrorFrame(ANALYSIS_TOO_LONG_MESSAGE)),
                                    );
                                    await finishAnalysis("failed", "timeout");
                                    controller.close();
                                    return;
                                }
                                break;
                            }

                            const { done, value } = next.chunk;
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const split = takeCompleteSseEvents(buffer);
                            buffer = split.rest;
                            for (const event of split.events) {
                                forwardBlock(event);
                            }
                        }

                        buffer += decoder.decode();
                        if (buffer.trim()) {
                            forwardBlock(buffer);
                        }
                    } finally {
                        try {
                            reader.releaseLock();
                        } catch {
                            // cancel() already released the reader.
                        }
                    }

                    console.log("Stream reading completed. lastResult exists:", !!lastResult);

                    // After streaming is complete, update the database with final result
                    if (lastResult) {
                        console.log("Starting database update with final analysis result");
                        console.log("CaseId:", caseId);
                        console.log("Result keys:", Object.keys(lastResult));

                        try {
                            const updateRow: {
                                result: typeof lastResult;
                                entity_relationship?: Json;
                            } = { result: lastResult };
                            if (
                                lastResult &&
                                typeof lastResult === "object" &&
                                "case_entity_relationships" in lastResult
                            ) {
                                const raw = (
                                    lastResult as {
                                        case_entity_relationships?: Json;
                                    }
                                ).case_entity_relationships;
                                updateRow.entity_relationship =
                                    raw === undefined ? null : raw;
                            }

                            const { data: updateData, error: updateError } = await streamSupabase
                                .from("cases")
                                .update(updateRow)
                                .eq("id", caseId)
                                .select();

                            if (updateError) {
                                console.error(
                                    "Failed to update case with analysis result:",
                                    updateError.message,
                                    updateError.details,
                                    updateError.hint
                                );
                                // Still send the error but don't throw to allow stream to close gracefully
                                controller.enqueue(
                                    encoder.encode(
                                        `data: ${JSON.stringify({
                                            type: "warning",
                                            message: "Result saved but database update failed. Result may need to be regenerated.",
                                        })}\n\n`
                                    )
                                );
                            } else {
                                console.log(
                                    "Successfully saved streaming analysis result to database for case:",
                                    caseId,
                                    "Updated rows:",
                                    updateData?.length
                                );
                            }
                        } catch (dbError) {
                            console.error("Database update threw exception:", dbError);
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({
                                        type: "warning",
                                        message: "Database error occurred while saving results.",
                                    })}\n\n`
                                )
                            );
                        }
                    } else {
                        console.warn("No lastResult to save to database");
                        await finishAnalysis("failed", "no_result");
                    }

                    await finishAnalysis("completed");
                    console.log("Closing stream controller");
                    controller.close();
                } catch (error) {
                    console.error("Streaming error:", error);
                    await finishAnalysis("failed", "stream_error");
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
                "Cache-Control": "no-cache, no-transform",
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

