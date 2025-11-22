export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return Response.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Create a new FormData for the external API with all files
        const externalFormData = new FormData();
        files.forEach((file) => {
            externalFormData.append("files", file);
        });

        // Call the external classification API from the server side
        const response = await fetch(
            "https://legal-case-analysis-main-api-efbsdwd2bsdxced6.germanywestcentral-01.azurewebsites.net/api/v1/documents/classify-document",
            {
                method: "POST",
                body: externalFormData,
            }
        );

        if (!response.ok) {
            console.error("Classification API error:", response.statusText);
            return new Response(
                JSON.stringify({
                    type: "error",
                    message: "Classification failed"
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
            error: "No response body from classification API"
        }, { status: 500 });
    } catch (error) {
        console.error("Classification error:", error);
        return Response.json(
            {
                error: "Failed to classify document",
            },
            { status: 500 }
        );
    }
}
