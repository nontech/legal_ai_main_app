"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ResultsStep from "@/app/components/ResultsStep";

export default function ResultsPage() {
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
      <div className="flex min-h-[min(70vh,520px)] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border-200/80 bg-surface-000 px-10 py-12 shadow-[0_20px_50px_-24px_rgba(18,24,38,0.18)]">
          <div
            className="h-12 w-12 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin"
            aria-hidden
          />
          <p className="text-sm font-medium text-ink-600">
            Preparing your analysis…
          </p>
        </div>
      </div>
    );
  }

  return <ResultsStep isOwner={isOwner} caseId={caseId} />;
}
