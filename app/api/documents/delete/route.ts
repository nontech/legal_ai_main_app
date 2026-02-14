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

export async function DELETE(request: Request) {
    try {
        const { fileAddress, section, caseId } = await request.json();

        // Validate inputs
        if (!fileAddress) {
            return Response.json(
                { ok: false, error: "fileAddress is required" },
                { status: 400 }
            );
        }

        if (!section) {
            return Response.json(
                { ok: false, error: "section is required" },
                { status: 400 }
            );
        }

        if (!caseId) {
            return Response.json(
                { ok: false, error: "caseId is required" },
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
        console.log("Deleting file:", fileAddress);
        const externalFormData = new FormData();
        externalFormData.append("file_address", fileAddress);
        console.log("External Form Data:", externalFormData);
        // Call external delete API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_AZURE_BACKEND_URL}/api/v1/documents/delete-file`,
            {
                method: "DELETE",
                body: externalFormData,
            }
        );

        if (!response.ok) {
            console.error("Delete API error:", response.statusText);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            return Response.json(
                { ok: false, error: "Failed to delete file", details: errorText },
                { status: response.status }
            );
        }

        // Update case details to remove the file
        const existingCaseDetails = await getExistingCaseDetails(supabase, caseId);
        const sectionData = existingCaseDetails[section] || {};

        // Remove the file from the files array
        let updatedFiles = sectionData.files || [];
        if (Array.isArray(updatedFiles)) {
            updatedFiles = updatedFiles.filter((file: any) => file.address !== fileAddress);
        }

        const updatedCaseDetails = {
            ...existingCaseDetails,
            [section]: {
                ...sectionData,
                files: updatedFiles.length > 0 ? updatedFiles : undefined,
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
                message: "File deleted successfully",
                updatedFiles,
                section,
            },
        });
    } catch (error) {
        console.error("Delete error:", error);
        return Response.json(
            {
                ok: false,
                error: "Failed to delete file",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
