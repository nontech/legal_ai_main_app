"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ResultsStep from "@/app/components/ResultsStep";

export default function GamePlanPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check ownership
  useEffect(() => {
    const checkOwnership = async () => {
      if (!caseId) return;
      try {
        const ownershipRes = await fetch(`/api/cases/${caseId}/ownership`);
        if (ownershipRes.ok) {
          const { isOwner: ownerStatus } = await ownershipRes.json();
          setIsOwner(ownerStatus);
        }
      } catch (error) {
        console.error("Failed to check ownership:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkOwnership();
  }, [caseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <ResultsStep showGamePlanOnly={true} isOwner={isOwner} caseId={caseId} />;
}
