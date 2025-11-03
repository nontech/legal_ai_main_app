export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return Response.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Create a new FormData for the external API
        const externalFormData = new FormData();
        externalFormData.append("file", file);

        // Call the external classification API from the server side
        const response = await fetch(
            "https://legal-case-api.azurewebsites.net/api/v1/documents/classify-document",
            {
                method: "POST",
                body: externalFormData,
            }
        );

        if (!response.ok) {
            console.error("Classification API error:", response.statusText);
            return Response.json(
                {
                    error: "Classification failed",
                    category: "case_information" // Default fallback
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        console.log(result);

        return Response.json({
            ok: true,
            category: result.file_category || "case_information",
            data: result,
        });
    } catch (error) {
        console.error("Classification error:", error);
        return Response.json(
            {
                error: "Failed to classify document",
                category: "case_information" // Default fallback
            },
            { status: 500 }
        );
    }
}
