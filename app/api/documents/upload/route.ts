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
    const fileCategory = formData.get("file_category") as string;
    const userId = formData.get("user_id") as string || "test-user";
    const caseId = formData.get("case_id") as string || "test-case";

    // Validate inputs
    if (!files || files.length === 0) {
      return Response.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    if (!fileCategory) {
      return Response.json(
        { error: "File category is required" },
        { status: 400 }
      );
    }

    // Create FormData for external API
    const externalFormData = new FormData();
    files.forEach((file) => externalFormData.append("files", file));
    externalFormData.append("file_category", fileCategory);
    externalFormData.append("user_id", userId);
    externalFormData.append("case_id", caseId);

    // Call external upload API
    const response = await fetch(
      "https://legal-case-api.azurewebsites.net/api/v1/documents/upload",
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
        { error: "Upload failed", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("Upload result:", result);

    // Process metadata if case_information category
    if (fileCategory === "case_information" && result.case_metadata) {
      try {
        const metadata = result.case_metadata;
        const updateData: any = {};
        const existingCaseDetails = await getExistingCaseDetails(caseId);

        // Extract jurisdiction data
        if (metadata.country || metadata.state || metadata.city || metadata.court) {
          updateData.jurisdiction = extractJurisdiction(metadata);
        }

        // Extract case details
        if (metadata.case_name && metadata.case_description) {
          updateData.case_details = {
            ...existingCaseDetails as any,
            case_information: {
              caseName: metadata.case_name,
              caseDescription: metadata.case_description,
              summary: result.summary || "",
              files_names: result.file_names,
              files_addresses: result.file_addresses,
            },
          };
        }

        // Extract charges
        if (metadata.charges) {
          updateData.charges = processCharges(metadata.charges);
        }

        // Update database
        await updateCaseInDatabase(caseId, updateData);

        // Return metadata response
        return Response.json({
          ok: true,
          data: result,
          metadata: {
            jurisdiction: extractJurisdiction(metadata),
            caseName: metadata.case_name || "",
            caseDescription: metadata.case_description || "",
            caseType: metadata.case_type || "",
            charges: metadata.charges ? processCharges(metadata.charges) : [],
          },
        });
      } catch (metadataError) {
        console.error("Error processing metadata:", metadataError);
        return Response.json({
          ok: true,
          data: result,
        });
      }
    } else {
      // Handle other file categories
      try {
        const existingCaseDetails = await getExistingCaseDetails(caseId);
        const updateData: any = {};

        if (result?.file_category) {
          updateData.case_details = {
            ...existingCaseDetails as any,
            [result.file_category]: {
              file_names: result.file_names,
              file_addresses: result.file_addresses,
              summary: result.summary || "",
            },
          };
        }

        await updateCaseInDatabase(caseId, updateData);
      } catch (error) {
        console.error("Error updating case details:", error);
      }
    }

    return Response.json({
      ok: true,
      data: result,
    });
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
