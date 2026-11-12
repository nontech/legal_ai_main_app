import { backendFetch, backendPaths } from "@/lib/backend";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { captureServerEvent, distinctIdFromRequest } from "@/lib/analytics/server";
import { normalizeFileCategory } from "@/lib/analytics/privacy";

// Hobby + Fluid compute allows 300s, matching Cloud Run. See lib/proxyDuration.ts.
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { file_addresses, file_names, file_category } = body;
        console.log("Summarize request received:", body);

        console.log("Summarize request received:", { file_addresses, file_names, file_category });

        // Validate inputs
        if (!file_addresses || !Array.isArray(file_addresses) || file_addresses.length === 0) {
            console.error("Invalid file_addresses:", file_addresses);
            return Response.json(
                { ok: false, error: "file_addresses is required and must be a non-empty array" },
                { status: 400 }
            );
        }

        if (!file_names || !Array.isArray(file_names) || file_names.length === 0) {
            console.error("Invalid file_names:", file_names);
            return Response.json(
                { ok: false, error: "file_names is required and must be a non-empty array" },
                { status: 400 }
            );
        }

        if (!file_category) {
            console.error("Invalid file_category:", file_category);
            return Response.json(
                { ok: false, error: "file_category is required" },
                { status: 400 }
            );
        }

        console.log("Sending to analysis API:", { file_addresses, file_names, file_category });

        // The analysis API expects multipart form fields, not JSON.
        const externalFormData = new FormData();
        file_addresses.forEach((address) => externalFormData.append("file_addresses", address));
        file_names.forEach((name) => externalFormData.append("file_names", name));
        externalFormData.append("file_category", file_category);

        // Call the external summarization API
        const response = await backendFetch(backendPaths.summarize, {
            method: "POST",
            body: externalFormData,
            incomingAuthorization: request.headers.get("authorization"),
        });

        let analyticsUserId: string | null = null;
        try {
            const supabase = await getSupabaseServerClient();
            const { data: userRes } = await supabase.auth.getUser();
            analyticsUserId = userRes?.user?.id ?? null;
        } catch {
            analyticsUserId = null;
        }
        const distinctId = distinctIdFromRequest(request, analyticsUserId);

        if (!response.ok) {
            console.error("Summarize API error:", response.statusText);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            await captureServerEvent(distinctId, "document_summarized", {
                file_category: normalizeFileCategory(file_category),
                file_count: file_addresses.length,
                success: false,
            });
            await captureServerEvent(distinctId, "backend_error", {
                route: "/api/documents/summarize",
                status: response.status,
            });
            return Response.json(
                { ok: false, error: "Failed to generate summary", details: errorText },
                { status: response.status }
            );
        }

        const result = await response.json();
        console.log("Summarize result:", result);

        await captureServerEvent(distinctId, "document_summarized", {
            file_category: normalizeFileCategory(file_category),
            file_count: file_addresses.length,
            success: true,
        });

        return Response.json({
            ok: true,
            summary: result.summary || result.data?.summary || "",
            data: result,
        });
    } catch (error) {
        console.error("Summarize error:", error);
        return Response.json(
            {
                ok: false,
                error: "Failed to generate summary",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
