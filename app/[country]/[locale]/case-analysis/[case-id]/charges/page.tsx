"use client";

import { useParams } from "next/navigation";
import ChargesSection from "@/app/components/ChargesSection";

export default function ChargesPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;

  return (
    <ChargesSection
      caseId={caseId}
      onCompletionChange={() => {}} // Completion tracking handled by layout
    />
  );
}
