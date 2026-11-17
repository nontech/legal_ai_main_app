import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadSharedCase } from "@/lib/loadSharedCase";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
    try {
        const { token } = await params;
        const shared = await loadSharedCase(token);
        if (!shared) {
            return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, data: shared });
    } catch {
        return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
}
