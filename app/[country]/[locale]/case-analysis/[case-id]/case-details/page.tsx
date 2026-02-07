"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import CaseDetailsSection from "@/app/components/CaseDetailsSection";

export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <CaseDetailsSection
      onModalChange={setIsModalOpen}
      caseId={caseId}
      onCompletionChange={() => {}} // Completion tracking handled by layout
    />
  );
}
