import { getSupabaseServerClient } from "@/lib/supabaseServer";

// Helper: Fetch existing case details
const getExistingCaseDetails = async (supabase: any, caseId: string) => {
    const { data, error } = await supabase
        .from("cases")
        .select("case_details")
        .eq("id", caseId)
        .single();

    if (error) {
        console.error("Failed to fetch existing case:", error);
        return {};
    }
    return data?.case_details || {};
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const section = formData.get("section") as string;
        const caseId = formData.get("case_id") as string;
        const language = formData.get("language_code") as string || "en";

        console.log("formData", formData);

        // Validate inputs
        if (!files || files.length === 0) {
            return Response.json(
                { ok: false, error: "No files provided" },
                { status: 400 }
            );
        }

        if (!section) {
            return Response.json(
                { ok: false, error: "Section is required" },
                { status: 400 }
            );
        }

        if (!caseId) {
            return Response.json(
                { ok: false, error: "Case ID is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        // Verify user owns the case
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userRes?.user) {
            return Response.json(
                { ok: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: caseData, error: caseError } = await supabase
            .from("cases")
            .select("owner_id")
            .eq("id", caseId)
            .single();

        if (caseError || !caseData) {
            return Response.json(
                { ok: false, error: "Case not found" },
                { status: 404 }
            );
        }

        if (caseData.owner_id !== userRes.user.id) {
            return Response.json(
                { ok: false, error: "Unauthorized access to this case" },
                { status: 403 }
            );
        }

        // Create FormData for external API
        const externalFormData = new FormData();
        files.forEach((file) => externalFormData.append("files", file));
        externalFormData.append("file_category", section);
        externalFormData.append("user_id", userRes.user.id);
        externalFormData.append("case_id", caseId);
        externalFormData.append("language_code", language);

        // Call external upload API
        const response = await fetch(
            "https://legal-case-analysis-main-api-efbsdwd2bsdxced6.germanywestcentral-01.azurewebsites.net/api/v1/documents/upload-to-section",
            {
                method: "POST",
                body: externalFormData,
            }
        );

        if (!response.ok) {
            console.error("Upload API error:", response.statusText);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            return Response.json(
                { ok: false, error: "Upload failed", details: errorText },
                { status: response.status }
            );
        }

        const result = await response.json();
        console.log("Upload result:", result);

        // Get existing case details to preserve other properties
        const existingCaseDetails = await getExistingCaseDetails(supabase, caseId);

        // Preserve existing section data and merge files
        const existingSectionData = existingCaseDetails[section] || {};
        const existingFiles = Array.isArray(existingSectionData.files)
            ? existingSectionData.files
            : [];

        // Transform API response to files array format
        const newFiles = (result.file_names || []).map((name: string, index: number) => ({
            name,
            address: (result.file_addresses || [])[index],
        }));

        // Append new files to existing ones
        const updatedFiles = [...existingFiles, ...newFiles];

        const updatedCaseDetails = {
            ...existingCaseDetails,
            [section]: {
                ...existingSectionData,
                files: updatedFiles,
            },
        };

        // Update database
        const { error: updateError } = await supabase
            .from("cases")
            .update({
                case_details: updatedCaseDetails,
            })
            .eq("id", caseId);

        if (updateError) {
            console.error("Failed to update case:", updateError);
            return Response.json(
                { ok: false, error: "Failed to update case", details: updateError.message },
                { status: 500 }
            );
        }

        return Response.json({
            ok: true,
            data: {
                files: newFiles,
                section,
                // Include raw arrays for backward compatibility with different client expectations
                file_names: newFiles.map((f: { name: string }) => f.name),
                file_addresses: newFiles.map((f: { address: string }) => f.address),
            },
        });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            {
                ok: false,
                error: "Failed to upload documents",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
