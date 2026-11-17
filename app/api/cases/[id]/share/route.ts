import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sharePath } from "@/lib/caseShare";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

async function requireOwner(caseId: string) {
    const supabase = await getSupabaseServerClient();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
        return { ok: false as const, response: NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 }) };
    }

    const admin = getSupabaseAdminClient();
    const { data: caseRow, error: caseError } = await admin
        .from("cases")
        .select("id, owner_id, share_token")
        .eq("id", caseId)
        .maybeSingle();

    if (caseError) {
        console.error("Share lookup failed");
        return { ok: false as const, response: NextResponse.json({ ok: false, error: "Could not update sharing" }, { status: 500 }) };
    }
    if (!caseRow) {
        return { ok: false as const, response: NextResponse.json({ ok: false, error: "Case not found" }, { status: 404 }) };
    }
    const ownerId = caseRow.owner_id;
    if (!ownerId || ownerId !== userRes.user.id) {
        return { ok: false as const, response: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }) };
    }
    return { ok: true as const, admin, ownerId, shareToken: caseRow.share_token };
}

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    try {
        const { id: caseId } = await params;
        if (!caseId) {
            return NextResponse.json({ ok: false, error: "Case ID is required" }, { status: 400 });
        }

        const owner = await requireOwner(caseId);
        if (!owner.ok) return owner.response;

        let token = owner.shareToken;
        if (!token) {
            const created = crypto.randomUUID();
            const { data: updated, error: updateError } = await owner.admin
                .from("cases")
                .update({ share_token: created })
                .eq("id", caseId)
                .is("share_token", null)
                .select("share_token")
                .maybeSingle();

            if (updateError) {
                console.error("Failed to create share token");
                return NextResponse.json({ ok: false, error: "Could not share this case" }, { status: 500 });
            }
            token = updated?.share_token ?? null;
            if (!token) {
                const { data: again } = await owner.admin
                    .from("cases")
                    .select("share_token")
                    .eq("id", caseId)
                    .maybeSingle();
                token = again?.share_token ?? null;
            }
        }

        if (!token) {
            return NextResponse.json({ ok: false, error: "Could not share this case" }, { status: 500 });
        }

        return NextResponse.json({ ok: true, url: sharePath(token) });
    } catch {
        return NextResponse.json({ ok: false, error: "Could not share this case" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    try {
        const { id: caseId } = await params;
        if (!caseId) {
            return NextResponse.json({ ok: false, error: "Case ID is required" }, { status: 400 });
        }

        const owner = await requireOwner(caseId);
        if (!owner.ok) return owner.response;

        const { error: updateError } = await owner.admin
            .from("cases")
            .update({ share_token: null })
            .eq("id", caseId)
            .eq("owner_id", owner.ownerId);

        if (updateError) {
            console.error("Failed to revoke share token");
            return NextResponse.json({ ok: false, error: "Could not stop sharing" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false, error: "Could not stop sharing" }, { status: 500 });
    }
}
