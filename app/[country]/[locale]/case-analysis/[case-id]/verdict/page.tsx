"use client";

import { useParams } from "next/navigation";
import VerdictStep from "@/app/components/VerdictStep";

export default function VerdictPage() {
  const params = useParams();
  const caseId = params["case-id"] as string;

  return <VerdictStep caseId={caseId} />;
}
