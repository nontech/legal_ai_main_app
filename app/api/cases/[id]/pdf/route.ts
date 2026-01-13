import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    // Get the origin from the request
    const origin =
      request.headers.get("origin") || "http://localhost:3000";

    // Construct the URL to the case analysis page
    const url = `${origin}/us/en/case-analysis/detailed?step=7&caseId=${caseId}`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for main content to be visible
    await page.waitForSelector("main", { timeout: 10000 });

    // Optional: Hide UI elements before generating PDF
    await page.evaluate(() => {
      // Hide navigation
      const navs = document.querySelectorAll("nav");
      navs.forEach(
        (nav) => ((nav as HTMLElement).style.display = "none")
      );

      // Hide buttons
      const buttons = document.querySelectorAll("button");
      buttons.forEach(
        (btn) => ((btn as HTMLElement).style.display = "none")
      );

      // Hide sidebars
      const sidebars = document.querySelectorAll(
        'aside, [class*="sidebar"]'
      );
      sidebars.forEach(
        (sidebar) => ((sidebar as HTMLElement).style.display = "none")
      );
    });

    // Get the case title for filename
    const caseTitle = await page.evaluate(() => {
      const titleElement = document.querySelector("h1, h2");
      return titleElement?.textContent?.trim() || "Case_Analysis";
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Create filename
    const filename = `${caseTitle.replace(
      /[^a-z0-9]/gi,
      "_"
    )}_Analysis.pdf`;

    // Return PDF as download
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate PDF",
      },
      { status: 500 }
    );
  }
}
