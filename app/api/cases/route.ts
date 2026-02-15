import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import {
    getClientIp,
    checkAnonymousCaseLimit,
    incrementAnonymousCaseCount,
    checkAndConsumeUserCredits,
} from "@/lib/rateLimit";

export async function GET(request: Request) {
    try {
        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr && userErr.message !== "Auth session missing!") {
            return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
        }

        if (!userRes?.user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("cases")
            .select("*")
            .eq("owner_id", userRes.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, cases: data || [] }, { status: 200 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        // If type is "quick-analysis", create an empty case
        if (type === "quick-analysis") {
            const supabase = await getSupabaseServerClient();
            const { data: userRes, error: userErr } = await supabase.auth.getUser();

            if (userErr && userErr.message !== "Auth session missing!") {
                return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
            }

            const isAuthed = Boolean(userRes?.user);
            const ownerId = userRes?.user?.id ?? null;
            const adminClient = getSupabaseAdminClient();

            // Authenticated: check and consume case credits
            if (isAuthed && userRes.user) {
                const creditResult = await checkAndConsumeUserCredits(
                    userRes.user.id,
                    "case",
                    adminClient
                );
                if (!creditResult.allowed) {
                    return NextResponse.json(
                        { ok: false, error: creditResult.error },
                        { status: 402 }
                    );
                }
            } else {
                // Anonymous: check IP-based limit
                const ip = getClientIp(request);
                if (!ip) {
                    return NextResponse.json(
                        { ok: false, error: "Unable to verify request origin." },
                        { status: 400 }
                    );
                }
                const underLimit = await checkAnonymousCaseLimit(ip, adminClient);
                if (!underLimit) {
                    return NextResponse.json(
                        {
                            ok: false,
                            error:
                                "Anonymous case limit reached for today. Sign in for more.",
                        },
                        { status: 429 }
                    );
                }
            }

            const client = isAuthed ? supabase : adminClient;
            const { data, error } = await client
                .from("cases")
                .insert({
                    case_details: null,
                    jurisdiction: null,
                    case_type: null,
                    role: null,
                    charges: null,
                    judge: null,
                    jury: null,
                    result: null,
                    owner_id: ownerId,
                })
                .select("id")
                .single();

            if (error) {
                return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 500 });
            }

            // Anonymous: increment count after successful insert
            if (!isAuthed && ownerId === null) {
                const ip = getClientIp(request);
                if (ip) await incrementAnonymousCaseCount(ip, adminClient);
            }

            return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
        }

        // Original POST logic for detailed case creation
        const {
            caseName,
            caseDescription,
            jurisdiction = null,
            case_type = null,
            role = null,
            result = null,
            charges = null,
            judge = null,
            jury = null,
        } = await request.json();
        console.log(caseName, caseDescription, jurisdiction, case_type, role, result, charges, judge, jury);

        if (!caseName || !caseDescription) {
            return NextResponse.json(
                { ok: false, error: "caseName and caseDescription are required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        // Treat missing session as unauthenticated (admin fallback will be used)
        if (userErr && userErr.message !== "Auth session missing!") {
            return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
        }
        const isAuthed = Boolean(userRes?.user);
        const ownerId = userRes?.user?.id ?? null;
        const adminClient = getSupabaseAdminClient();

        // Authenticated: check and consume case credits
        if (isAuthed && userRes?.user) {
            const creditResult = await checkAndConsumeUserCredits(
                userRes.user.id,
                "case",
                adminClient
            );
            if (!creditResult.allowed) {
                return NextResponse.json(
                    { ok: false, error: creditResult.error },
                    { status: 402 }
                );
            }
        } else {
            // Anonymous: check IP-based limit
            const ip = getClientIp(request);
            if (!ip) {
                return NextResponse.json(
                    { ok: false, error: "Unable to verify request origin." },
                    { status: 400 }
                );
            }
            const underLimit = await checkAnonymousCaseLimit(ip, adminClient);
            if (!underLimit) {
                return NextResponse.json(
                    {
                        ok: false,
                        error:
                            "Anonymous case limit reached for today. Sign in for more.",
                    },
                    { status: 429 }
                );
            }
        }

        const client = isAuthed ? supabase : adminClient;

        // Calculate completion status: basic-info complete = 1/6 sections = ~16.67%
        const completionPercentage = Math.round((1 / 6) * 100);

        const { data, error } = await client
            .from("cases")
            .insert({
                case_details: {
                    "case_information": {
                        caseName,
                        caseDescription,
                        files: [],
                        summary: "",
                        summaryGenerated: false,
                    },
                    _completion_status: completionPercentage,
                },
                jurisdiction,
                case_type,
                role,
                charges,
                judge,
                jury,
                result,
                owner_id: ownerId,
            })
            .select("id")
            .single();

        if (error) {
            return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 500 });
        }

        // Anonymous: increment count after successful insert
        if (!isAuthed && ownerId === null) {
            const ip = getClientIp(request);
            if (ip) await incrementAnonymousCaseCount(ip, adminClient);
        }

        return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const caseId = searchParams.get("id");

        if (!caseId) {
            return NextResponse.json(
                { ok: false, error: "Case ID is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr && userErr.message !== "Auth session missing!") {
            return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
        }

        if (!userRes?.user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        // Delete case (only if user owns it or use admin for verification)
        const { error } = await supabase
            .from("cases")
            .delete()
            .eq("id", caseId)
            .eq("owner_id", userRes.user.id);

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, message: "Case deleted successfully" }, { status: 200 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}


