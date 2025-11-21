import { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const body = await request.json();
        const { caseId, case_analysis, case_info } = body;

        if (!caseId || !case_analysis || !case_info) {
            return new Response(
                JSON.stringify({ ok: false, error: "caseId, case_analysis, and case_info are required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Call the external API
        const response = await fetch(
            "http://localhost:8000/api/v1/prediction/generate-game-plan-streaming",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    case_analysis,
                    case_info,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`External API error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No response body from external API");
        }

        // Stream response back to client
        const stream = new ReadableStream({
            async start(controller) {
                const decoder = new TextDecoder();
                let gamePlanResult: any = null;
                let buffer = "";

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");

                        // Keep the last incomplete line in the buffer
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            if (line.startsWith("data: ")) {
                                const dataStr = line.slice(6).trim();
                                if (!dataStr) continue;

                                try {
                                    const event = JSON.parse(dataStr);

                                    // Forward event to client
                                    controller.enqueue(
                                        new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`)
                                    );

                                    // Capture the final result
                                    if (event.type === "complete" && event.result) {
                                        gamePlanResult = event.result;
                                        console.log("Game plan result captured");
                                    }
                                } catch (e) {
                                    console.error("Failed to parse event:", e);
                                    console.error("Problematic data:", dataStr.substring(0, 200));
                                }
                            }
                        }
                    }

                    // Save the game plan to the database
                    if (gamePlanResult && caseId) {
                        console.log("Saving game plan to database for case:", caseId);
                        const supabase = await getSupabaseServerClient();
                        const { error } = await supabase
                            .from("cases")
                            .update({ game_plan: gamePlanResult })
                            .eq("id", caseId);

                        if (error) {
                            console.error("Failed to save game plan to database:", error);
                        } else {
                            console.log("Game plan saved successfully to database");
                        }
                    }

                    controller.close();
                } catch (error) {
                    console.error("Streaming error:", error);
                    controller.error(error);
                } finally {
                    reader.releaseLock();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Game plan generation error:", error);
        return new Response(
            JSON.stringify({ ok: false, error: "Failed to generate game plan" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

