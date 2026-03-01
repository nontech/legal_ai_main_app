"use client";

import { useParams } from "next/navigation";
import TenancyStatusSelector from "@/app/components/TenancyStatusSelector";

export default function TenancyPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;

  return <TenancyStatusSelector caseId={caseId} />;
}
