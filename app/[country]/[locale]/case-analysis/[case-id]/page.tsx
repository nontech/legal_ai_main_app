"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CaseAnalysisDefaultPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params["case-id"] as string;
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';

  useEffect(() => {
    // Redirect to results page by default
    if (caseId) {
      router.replace(`/${country}/${locale}/case-analysis/${caseId}/results`);
    }
  }, [caseId, country, locale, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}
