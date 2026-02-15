"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSetHeaderActions } from "./CaseHeaderActionsContext";
import StreamingAnalysisDisplay from "./StreamingAnalysisDisplay";

const CASE_UPDATED_EVENT = "case-updated";
export const CASE_REGENERATED_EVENT = "case-regenerated";

export function dispatchCaseUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CASE_UPDATED_EVENT));
  }
}

interface RegenerateHeaderButtonProps {
  caseId: string;
  hasResult: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
  onRegenerateComplete?: () => void;
}

export default function RegenerateHeaderButton({
  caseId,
  hasResult,
  isOwner,
  isAuthenticated,
  onRegenerateComplete,
}: RegenerateHeaderButtonProps) {
  const setHeaderActions = useSetHeaderActions();
  const tResults = useTranslations("caseAnalysis.results");
  const [hasChanges, setHasChanges] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isStreamingOpen, setIsStreamingOpen] = useState(false);

  useEffect(() => {
    const handler = () => setHasChanges(true);
    window.addEventListener(CASE_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CASE_UPDATED_EVENT, handler);
  }, []);

  const handleRegenerate = useCallback(() => {
    setIsRegenerating(true);
    setIsStreamingOpen(true);
  }, []);

  const handleStreamingComplete = useCallback(
    (result: unknown) => {
      setIsRegenerating(false);
      setIsStreamingOpen(false);
      setHasChanges(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(CASE_REGENERATED_EVENT));
      }
      onRegenerateComplete?.();
    },
    [onRegenerateComplete]
  );

  const handleStreamingClose = useCallback(() => {
    setIsStreamingOpen(false);
    setIsRegenerating(false);
  }, []);

  useEffect(() => {
    if (!setHeaderActions) return;
    if (!hasResult || !isAuthenticated || !isOwner) {
      setHeaderActions(null);
      return;
    }
    const disabled = !hasChanges;
    const button = (
      <button
        onClick={disabled ? undefined : handleRegenerate}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 border-2 border-border-200 rounded-lg transition-all font-medium text-sm ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-70"
            : "bg-white-600 text-black hover:bg-yellow-600 hover:text-white"
        }`}
        title={
          disabled
            ? tResults("regenerateDisabled")
            : isRegenerating
            ? tResults("regenerating")
            : tResults("regenerate")
        }
      >
        {isRegenerating ? (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
        <span>{isRegenerating ? "..." : tResults("regenerate")}</span>
      </button>
    );
    setHeaderActions(button);
    return () => setHeaderActions(null);
  }, [
    setHeaderActions,
    hasResult,
    isAuthenticated,
    isOwner,
    hasChanges,
    isRegenerating,
    handleRegenerate,
    tResults,
  ]);

  return (
    <StreamingAnalysisDisplay
      isOpen={isStreamingOpen}
      caseId={caseId}
      onComplete={handleStreamingComplete}
      onClose={handleStreamingClose}
    />
  );
}
