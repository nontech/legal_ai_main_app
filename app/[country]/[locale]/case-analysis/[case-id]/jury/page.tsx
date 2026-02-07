"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import JuryComposition from "@/app/components/JuryComposition";

export default function JuryPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;
  const [countryId, setCountryId] = useState<string>("");

  // Fetch country ID from case data
  useEffect(() => {
    const fetchCountryId = async () => {
      if (!caseId) return;
      try {
        const res = await fetch(`/api/cases/${caseId}`);
        const json = await res.json();
        if (json.ok && json.data?.jurisdiction?.country_code) {
          setCountryId(json.data.jurisdiction.country_code);
        }
      } catch (error) {
        console.error("Failed to fetch country ID:", error);
      }
    };
    fetchCountryId();
  }, [caseId]);

  return (
    <JuryComposition
      caseId={caseId}
      countryId={countryId}
      onSaveSuccess={() => {}} // Refresh handled by layout
    />
  );
}
