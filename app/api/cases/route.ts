import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

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

        const client = isAuthed ? supabase : getSupabaseAdminClient();
        const ownerId = userRes?.user?.id ?? null;
        const { data, error } = await client
            .from("cases")
            .insert({
                case_details: { caseName, caseDescription },
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

        return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}


