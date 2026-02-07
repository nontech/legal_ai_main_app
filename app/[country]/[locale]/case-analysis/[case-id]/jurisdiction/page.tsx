"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import JurisdictionSection from "@/app/components/JurisdictionSection";

export default function JurisdictionPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;
  const [countryId, setCountryId] = useState<string>("");
  const [jurisdictionId, setJurisdictionId] = useState<string>("");

  return (
    <JurisdictionSection
      caseId={caseId}
      onCountryChange={setCountryId}
      onJurisdictionChange={setJurisdictionId}
    />
  );
}
