"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import JudgeSelection from "@/app/components/JudgeSelection";

export default function JudgePage() {
  const params = useParams();
  const caseId = params["case-id"] as string;
  const [jurisdictionId, setJurisdictionId] = useState<string>("");

  // Fetch jurisdiction ID from case data
  useEffect(() => {
    const fetchJurisdictionId = async () => {
      if (!caseId) return;
      try {
        const res = await fetch(`/api/cases/${caseId}`);
        const json = await res.json();
        if (json.ok && json.data?.jurisdiction?.jurisdiction_code) {
          setJurisdictionId(json.data.jurisdiction.jurisdiction_code);
        }
      } catch (error) {
        console.error("Failed to fetch jurisdiction ID:", error);
      }
    };
    fetchJurisdictionId();
  }, [caseId]);

  return (
    <JudgeSelection
      caseId={caseId}
      onSaveSuccess={() => {}} // Refresh handled by layout
      jurisdictionId={jurisdictionId}
    />
  );
}
