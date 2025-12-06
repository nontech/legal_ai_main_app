import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Helper: Extract jurisdiction data from metadata
const extractJurisdiction = (metadata: any) => ({
  country: metadata.country || "",
  state: metadata.state || "",
  city: metadata.city || "",
  court: metadata.court || "",
});

// Helper: Process charges from metadata
const processCharges = (charges: any) => {
  const chargesArray = Array.isArray(charges) ? charges : [charges];
  return chargesArray.map((charge: any, index: number) => ({
    id: `charge-${Date.now()}-${index}`,
    statuteNumber: charge.statute_number || "",
    chargeDescription: charge.charge_description || "",
    essentialFacts: charge.essential_facts || "",
    defendantPlea: charge.defendants_plea || "not-guilty",
  }));
};

// Helper: Update case in database
const updateCaseInDatabase = async (caseId: string, updateData: any) => {
  if (caseId === "test-case" || Object.keys(updateData).length === 0) {
    return;
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const { error } = await supabaseAdmin
    .from("cases")
    .update(updateData)
    .eq("id", caseId);

  if (error) {
    console.error("Failed to update case:", error);
  }
};

// Helper: Fetch existing case details
const getExistingCaseDetails = async (caseId: string) => {
  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("cases")
    .select("case_details")
    .eq("id", caseId)
    .single();

  if (error) {
    console.error("Failed to fetch existing case:", error);
  }
  return data?.case_details || {};
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const userId = formData.get("user_id") as string || "test-user";
    const caseId = formData.get("case_id") as string || "test-case";
    const tenantId = formData.get("tenant_id") as string || "default-tenant";

    // Validate inputs
    if (!files || files.length === 0) {
      return Response.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Create FormData for external API (no file_category needed - classification happens automatically)
    const externalFormData = new FormData();
    files.forEach((file) => externalFormData.append("files", file));
    externalFormData.append("user_id", userId);
    externalFormData.append("case_id", caseId);
    externalFormData.append("tenant_id", tenantId);

    // Call external upload API
    const response = await fetch(
      "https://legal-case-analysis-main-api-efbsdwd2bsdxced6.germanywestcentral-01.azurewebsites.net/api/v1/documents/upload",
      {
        method: "POST",
        body: externalFormData,
      }
    );

    if (!response.ok) {
      console.error("Upload API error:", response.statusText);
      return new Response(
        JSON.stringify({
          type: "error",
          message: "Upload failed"
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    }

    // Stream the response through to the client
    if (response.body) {
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no",
        }
      });
    }

    return Response.json({
      error: "No response body from upload API"
    }, { status: 500 });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      {
        error: "Failed to upload documents",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
