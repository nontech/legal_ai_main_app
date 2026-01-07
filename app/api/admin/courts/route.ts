import { NextRequest, NextResponse } from "next/server";
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryCode = searchParams.get("country");
    const locale = searchParams.get("locale") || "en";

    if (!countryCode) {
      return NextResponse.json(
        { error: "Country code is required" },
        { status: 400 }
      );
    }

    // Get CMS Supabase client
    const supabase = getSupabaseCMSClient();

    // Fetch courts with country information
    const { data: courts, error } = await supabase
      .from("courts")
      .select(
        `
        id,
        name,
        official_name,
        countries!inner (
          iso_code,
          name
        )
      `
      )
      .eq("countries.iso_code", countryCode.toUpperCase());

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch courts", details: error.message },
        { status: 500 }
      );
    }

    // Transform data based on locale
    // For MVP: Use official_name for German locale in Germany, otherwise use name
    const transformedCourts = courts?.map((court: any) => ({
      id: court.id,
      name: court.name,
      officialName: court.official_name,
      // Display logic: show German official name for German locale in Germany
      displayName:
        locale === "de" && countryCode.toLowerCase() === "de"
          ? court.official_name
          : court.name,
      country: court.countries,
    }));

    return NextResponse.json({
      courts: transformedCourts,
      count: transformedCourts?.length || 0,
      country: countryCode,
      locale: locale,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
