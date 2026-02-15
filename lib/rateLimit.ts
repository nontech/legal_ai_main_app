import type { SupabaseClient } from "@supabase/supabase-js";

const ANONYMOUS_CASE_LIMIT = parseInt(
    process.env.ANONYMOUS_CASE_LIMIT_PER_IP_PER_DAY ?? "3",
    10
);
const USER_CASES_LIMIT = parseInt(process.env.USER_CASES_PER_DAY ?? "5", 10);
const USER_ANALYSES_LIMIT = parseInt(process.env.USER_ANALYSES_PER_DAY ?? "10", 10);
const USER_GAME_PLANS_LIMIT = parseInt(process.env.USER_GAME_PLANS_PER_DAY ?? "3", 10);

export type CreditAction = "case" | "analysis" | "game_plan";

export function getClientIp(request: Request): string | null {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();
        if (first) return first;
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return null;
}

async function hashIp(ip: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function getTodayUtc(): Promise<string> {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function checkAnonymousCaseLimit(
    ip: string,
    supabase: SupabaseClient
): Promise<boolean> {
    const ipHash = await hashIp(ip);
    const today = await getTodayUtc();

    const { data, error } = await supabase
        .from("anonymous_case_usage")
        .select("case_count")
        .eq("ip_hash", ipHash)
        .eq("usage_date", today)
        .maybeSingle();

    if (error) {
        console.error("checkAnonymousCaseLimit error:", error);
        return false;
    }

    const count = data?.case_count ?? 0;
    return count < ANONYMOUS_CASE_LIMIT;
}

export async function incrementAnonymousCaseCount(
    ip: string,
    supabase: SupabaseClient
): Promise<void> {
    const ipHash = await hashIp(ip);
    const today = await getTodayUtc();

    const { data: existing } = await supabase
        .from("anonymous_case_usage")
        .select("id, case_count")
        .eq("ip_hash", ipHash)
        .eq("usage_date", today)
        .maybeSingle();

    if (existing) {
        await supabase
            .from("anonymous_case_usage")
            .update({
                case_count: existing.case_count + 1,
            })
            .eq("id", existing.id);
    } else {
        await supabase.from("anonymous_case_usage").insert({
            ip_hash: ipHash,
            usage_date: today,
            case_count: 1,
        });
    }
}

export async function checkAndConsumeUserCredits(
    userId: string,
    action: CreditAction,
    supabase: SupabaseClient
): Promise<{ allowed: boolean; error?: string }> {
    const today = await getTodayUtc();

    const { data: existing, error: fetchError } = await supabase
        .from("user_daily_usage")
        .select("id, cases_created, analyses_used, game_plans_used")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .maybeSingle();

    if (fetchError) {
        console.error("checkAndConsumeUserCredits fetch error:", fetchError);
        return { allowed: false, error: "Failed to check credits" };
    }

    const casesCreated = existing?.cases_created ?? 0;
    const analysesUsed = existing?.analyses_used ?? 0;
    const gamePlansUsed = existing?.game_plans_used ?? 0;

    if (action === "case") {
        if (casesCreated >= USER_CASES_LIMIT) {
            return {
                allowed: false,
                error: `Daily case creation limit (${USER_CASES_LIMIT}) reached. Resets at midnight UTC.`,
            };
        }
    } else if (action === "analysis") {
        if (analysesUsed >= USER_ANALYSES_LIMIT) {
            return {
                allowed: false,
                error: `Daily analysis limit (${USER_ANALYSES_LIMIT}) reached. Resets at midnight UTC.`,
            };
        }
    } else if (action === "game_plan") {
        if (gamePlansUsed >= USER_GAME_PLANS_LIMIT) {
            return {
                allowed: false,
                error: `Daily game plan limit (${USER_GAME_PLANS_LIMIT}) reached. Resets at midnight UTC.`,
            };
        }
    }

    // Consume credit: upsert with incremented field
    const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
    };
    if (action === "case") updates.cases_created = casesCreated + 1;
    else if (action === "analysis") updates.analyses_used = analysesUsed + 1;
    else if (action === "game_plan") updates.game_plans_used = gamePlansUsed + 1;

    if (existing) {
        const { error: updateError } = await supabase
            .from("user_daily_usage")
            .update(updates)
            .eq("id", existing.id);

        if (updateError) {
            console.error("checkAndConsumeUserCredits update error:", updateError);
            return { allowed: false, error: "Failed to consume credit" };
        }
    } else {
        const insert: Record<string, unknown> = {
            user_id: userId,
            usage_date: today,
            cases_created: action === "case" ? 1 : 0,
            analyses_used: action === "analysis" ? 1 : 0,
            game_plans_used: action === "game_plan" ? 1 : 0,
        };
        const { error: insertError } = await supabase
            .from("user_daily_usage")
            .insert(insert);

        if (insertError) {
            console.error("checkAndConsumeUserCredits insert error:", insertError);
            return { allowed: false, error: "Failed to consume credit" };
        }
    }

    return { allowed: true };
}

export async function getAnonymousCaseUsage(
    ip: string,
    supabase: SupabaseClient
): Promise<{
    casesRemaining: number;
    casesLimit: number;
}> {
    const ipHash = await hashIp(ip);
    const today = await getTodayUtc();

    const { data } = await supabase
        .from("anonymous_case_usage")
        .select("case_count")
        .eq("ip_hash", ipHash)
        .eq("usage_date", today)
        .maybeSingle();

    const caseCount = data?.case_count ?? 0;

    return {
        casesRemaining: Math.max(0, ANONYMOUS_CASE_LIMIT - caseCount),
        casesLimit: ANONYMOUS_CASE_LIMIT,
    };
}

export async function getUserDailyUsage(
    userId: string,
    supabase: SupabaseClient
): Promise<{
    casesRemaining: number;
    analysesRemaining: number;
    gamePlansRemaining: number;
    casesLimit: number;
    analysesLimit: number;
    gamePlansLimit: number;
}> {
    const today = await getTodayUtc();

    const { data } = await supabase
        .from("user_daily_usage")
        .select("cases_created, analyses_used, game_plans_used")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .maybeSingle();

    const casesCreated = data?.cases_created ?? 0;
    const analysesUsed = data?.analyses_used ?? 0;
    const gamePlansUsed = data?.game_plans_used ?? 0;

    return {
        casesRemaining: Math.max(0, USER_CASES_LIMIT - casesCreated),
        analysesRemaining: Math.max(0, USER_ANALYSES_LIMIT - analysesUsed),
        gamePlansRemaining: Math.max(0, USER_GAME_PLANS_LIMIT - gamePlansUsed),
        casesLimit: USER_CASES_LIMIT,
        analysesLimit: USER_ANALYSES_LIMIT,
        gamePlansLimit: USER_GAME_PLANS_LIMIT,
    };
}
