"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import CaseEntityRelationshipsPanel from "@/app/components/CaseEntityRelationshipsPanel";

type CaseRowWithEntityRelationship = {
  entity_relationship?: unknown;
};

export default function CaseEntityRelationshipsDialog({
  isOpen,
  onClose,
  caseRow,
}: {
  isOpen: boolean;
  onClose: () => void;
  caseRow: CaseRowWithEntityRelationship | null;
}) {
  const t = useTranslations("caseAnalysis.results.entityRelationships");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center px-3 py-8 sm:px-4">
        <button
          type="button"
          className="fixed inset-0 bg-black/50"
          aria-label={t("closeDialog")}
          onClick={onClose}
        />
        <div
          className="relative z-10 w-full max-w-3xl rounded-2xl border border-border-200 bg-surface-000 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="entity-relationships-dialog-title"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-200 bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-2xl" aria-hidden>
                🕸️
              </span>
              <h2
                id="entity-relationships-dialog-title"
                className="truncate text-lg font-bold text-white sm:text-xl"
              >
                {t("pageTitle")}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-primary-100 hover:bg-white/10"
            >
              {t("closeDialog")}
            </button>
          </div>
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <CaseEntityRelationshipsPanel
              caseRow={caseRow}
              showPlaceholderWhenMissing
              showHeading={false}
              hideReasoning
              className="mx-0 mb-0 border-0 bg-transparent p-0 shadow-none sm:mx-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
