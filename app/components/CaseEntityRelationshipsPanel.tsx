"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import CaseEntityRelationshipGraph from "@/app/components/CaseEntityRelationshipGraph";
import {
  parseCaseEntityRelationships,
} from "@/lib/types/caseEntityRelationships";

type CaseRowWithEntityRelationship = {
  entity_relationship?: unknown;
  role?: string | null;
  case_type?: string | null;
  jurisdiction?: Record<string, unknown> | null;
  case_details?: {
    case_information?: {
      caseName?: string;
      caseDescription?: string;
      summary?: string;
    };
  } | null;
};

const panelRootClass =
  "mx-3 sm:mx-0 mb-8 rounded-xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm";

export default function CaseEntityRelationshipsPanel({
  caseRow,
  showPlaceholderWhenMissing = false,
  className,
  showHeading = true,
  hideReasoning = false,
}: {
  caseRow: CaseRowWithEntityRelationship | null;
  showPlaceholderWhenMissing?: boolean;
  className?: string;
  showHeading?: boolean;
  /** When true, omits extraction `reasoning` copy (e.g. in the dialog). */
  hideReasoning?: boolean;
}) {
  const t = useTranslations("caseAnalysis.results.entityRelationships");
  const caseRole =
    caseRow && typeof caseRow.role === "string" ? caseRow.role : null;
  const raw = caseRow?.entity_relationship;
  if (raw === undefined || raw === null) {
    if (!showPlaceholderWhenMissing) return null;
    return (
      <div
        className={cn(panelRootClass, className)}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {showHeading && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-2xl" aria-hidden>
              🕸️
            </span>
            <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
          </div>
        )}
        <p className="text-sm text-gray-600">{t("notYetAvailable")}</p>
      </div>
    );
  }

  const graph = parseCaseEntityRelationships(raw);
  const hasContent =
    graph &&
    (graph.entities.length > 0 || graph.relationships.length > 0);
  return (
    <div
      className={cn(panelRootClass, className)}
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {showHeading && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🕸️
          </span>
          <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
        </div>
      )}

      {!graph && (
        <p className="text-sm text-gray-600">{t("invalidData")}</p>
      )}

      {graph && !hasContent && !hideReasoning && graph.reasoning?.trim() && (
        <div
          className="rounded-lg border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-950"
          role="status"
        >
          <p className="font-medium text-amber-900">{t("extractionNote")}</p>
          <p className="mt-2 whitespace-pre-wrap text-amber-900/90">
            {graph.reasoning}
          </p>
        </div>
      )}

      {graph && !hasContent && (hideReasoning || !graph.reasoning?.trim()) && (
        <p className="text-sm text-gray-600">{t("emptyGraph")}</p>
      )}

      {graph && hasContent && (
        <>
          {graph.reasoning?.trim() && !hideReasoning && (
            <p className="mb-4 text-sm text-gray-600 whitespace-pre-wrap">
              {graph.reasoning}
            </p>
          )}

          {!hideReasoning && (
            <p className="mb-2 text-xs text-slate-500">{t("diagramHint")}</p>
          )}
          <CaseEntityRelationshipGraph graph={graph} caseRole={caseRole} />
        </>
      )}
    </div>
  );
}
