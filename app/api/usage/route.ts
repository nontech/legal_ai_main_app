import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import {
    getUserDailyUsage,
    getAnonymousCaseUsage,
    getClientIp,
} from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
    try {
        const supabase = await getSupabaseServerClient();
        const { data: userRes, error: userErr } = await supabase.auth.getUser();

        if (userErr && userErr.message !== "Auth session missing!") {
            return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
        }

        if (userRes?.user) {
            const adminClient = getSupabaseAdminClient();
            const usage = await getUserDailyUsage(userRes.user.id, adminClient);
            return NextResponse.json(
                { ok: true, isAnonymous: false, ...usage },
                { status: 200 }
            );
        }

        // Anonymous user: return IP-based case usage
        const ip = getClientIp(request);
        if (!ip) {
            return NextResponse.json(
                {
                    ok: true,
                    isAnonymous: true,
                    casesRemaining: 0,
                    casesLimit: 3,
                    analysesRemaining: 0,
                    gamePlansRemaining: 0,
                    analysesLimit: 0,
                    gamePlansLimit: 0,
                },
                { status: 200 }
            );
        }

        const adminClient = getSupabaseAdminClient();
        const usage = await getAnonymousCaseUsage(ip, adminClient);
        return NextResponse.json(
            {
                ok: true,
                isAnonymous: true,
                ...usage,
                analysesRemaining: 0,
                gamePlansRemaining: 0,
                analysesLimit: 0,
                gamePlansLimit: 0,
            },
            { status: 200 }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
