"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CaseEntityRelationshipsDialog from "./CaseEntityRelationshipsDialog";
import LogoLoader from "./LogoLoader";
import StreamingAnalysisDisplay from "./StreamingAnalysisDisplay";
import StreamingGamePlanDisplay from "./StreamingGamePlanDisplay";
import GamePlanDisplay from "./GamePlanDisplay";
import { useSetHeaderActions } from "./CaseHeaderActionsContext";
import { CASE_REGENERATED_EVENT } from "./RegenerateHeaderButton";

interface AnalysisResult {
  predicted_outcome?: any;
  executive_summary?: any;
  key_factors?: Record<string, any>;
  legal_assessment?: any;
  case_analysis?: any;
  strategic_recommendations?: any[];
  precedent_cases?: any[];
}

function KeyFactorDescription({
  text,
  isExpanded,
  onToggle,
  showMoreLabel,
  showLessLabel,
}: {
  text: string;
  isExpanded: boolean;
  onToggle: () => void;
  showMoreLabel: string;
  showLessLabel: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowsTwoLines, setOverflowsTwoLines] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      if (isExpanded) return;
      const overflow = el.scrollHeight > el.clientHeight + 1;
      setOverflowsTwoLines(overflow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, isExpanded]);

  return (
    <>
      <p
        ref={ref}
        className={`m-0 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-700 sm:text-[0.9375rem] sm:leading-[1.6] ${
          isExpanded ? "" : "line-clamp-2"
        }`}
      >
        {text}
      </p>
      {overflowsTwoLines && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition hover:text-primary-900 hover:underline"
        >
          {isExpanded ? (
            <>
              {showLessLabel}{" "}
              <span aria-hidden className="text-[10px]">
                ▲
              </span>
            </>
          ) : (
            <>
              {showMoreLabel}{" "}
              <span aria-hidden className="text-[10px]">
                ▼
              </span>
            </>
          )}
        </button>
      )}
    </>
  );
}

function ratingStrengthBadgeClass(rating: string | undefined): string {
  const r = (rating || "").toLowerCase();
  if (r === "strong")
    return "bg-success-600 text-white ring-1 ring-black/10";
  if (r === "moderate")
    return "bg-warning-600 text-white ring-1 ring-black/10";
  return "bg-critical-500 text-white ring-1 ring-black/10";
}

function evidenceScoreBarClass(score: number): string {
  if (score > 7) return "bg-success-500";
  if (score > 5) return "bg-warning-500";
  return "bg-critical-500";
}

function similarityToneClasses(score: number): {
  border: string;
  badge: string;
} {
  if (score > 0.85)
    return {
      border: "border-l-4 border-l-success-500",
      badge: "bg-success-600 text-white ring-1 ring-black/10",
    };
  if (score > 0.75)
    return {
      border: "border-l-4 border-l-warning-500",
      badge: "bg-warning-600 text-white ring-1 ring-black/10",
    };
  return {
    border: "border-l-4 border-l-critical-500",
    badge: "bg-critical-500 text-white ring-1 ring-black/10",
  };
}

function strategicPriorityClasses(priority: string | undefined): {
  card: string;
  badge: string;
} {
  const p = (priority || "").toLowerCase();
  if (p === "critical" || p === "high") {
    return {
      card: "border border-critical-500/35 border-l-4 border-l-critical-600 bg-critical-100/35",
      badge: "bg-critical-600 text-white ring-1 ring-black/10",
    };
  }
  if (p === "moderate" || p === "medium") {
    return {
      card: "border border-warning-500/35 border-l-4 border-l-warning-600 bg-warning-100/40",
      badge: "bg-warning-600 text-white ring-1 ring-black/10",
    };
  }
  return {
    card: "border border-primary-400/35 border-l-4 border-l-primary-600 bg-info-100/50",
    badge: "bg-primary-600 text-white ring-1 ring-black/10",
  };
}

function getElementStrengthPresentation(
  prob: number,
  role: string | undefined
): { shell: string; badge: string; bar: string; label: string } {
  const isPlaintiff = role === "plaintiff";
  const isDefendant = role === "defendant";

  if (isPlaintiff) {
    if (prob > 70)
      return {
        shell: "border-success-500/50 bg-success-100/45",
        badge: "bg-success-600 text-white",
        bar: "bg-success-600",
        label: "Strong",
      };
    if (prob > 50)
      return {
        shell: "border-warning-500/50 bg-warning-100/45",
        badge: "bg-warning-600 text-white",
        bar: "bg-warning-500",
        label: "Moderate",
      };
    return {
      shell: "border-critical-500/50 bg-critical-100/40",
      badge: "bg-critical-600 text-white",
      bar: "bg-critical-500",
      label: "Weak",
    };
  }
  if (isDefendant) {
    if (prob > 70)
      return {
        shell: "border-critical-500/50 bg-critical-100/40",
        badge: "bg-critical-600 text-white",
        bar: "bg-critical-500",
        label: "Strong Against",
      };
    if (prob > 50)
      return {
        shell: "border-warning-500/50 bg-warning-100/45",
        badge: "bg-warning-600 text-white",
        bar: "bg-warning-500",
        label: "Moderate Against",
      };
    return {
      shell: "border-success-500/50 bg-success-100/45",
      badge: "bg-success-600 text-white",
      bar: "bg-success-600",
      label: "Weak Against",
    };
  }
  if (prob > 70)
    return {
      shell: "border-success-500/50 bg-success-100/45",
      badge: "bg-success-600 text-white",
      bar: "bg-success-600",
      label: "Strong",
    };
  if (prob > 50)
    return {
      shell: "border-warning-500/50 bg-warning-100/45",
      badge: "bg-warning-600 text-white",
      bar: "bg-warning-500",
      label: "Moderate",
    };
  return {
    shell: "border-critical-500/50 bg-critical-100/40",
    badge: "bg-critical-600 text-white",
    bar: "bg-critical-500",
    label: "Weak",
  };
}

/** Which side (plaintiff/defendant) the outcome headline refers to, from model text. */
function parsePredictionSideFromHeadline(
  headline: string
): "plaintiff" | "defendant" | null {
  const h = headline.toLowerCase();
  const p = h.indexOf("plaintiff");
  const d = h.indexOf("defendant");
  if (p === -1 && d === -1) return null;
  if (d === -1) return "plaintiff";
  if (p === -1) return "defendant";
  return p < d ? "plaintiff" : "defendant";
}

export default function ResultsStep({
  showGamePlanOnly = false,
  isOwner = false,
  caseId,
}: {
  showGamePlanOnly?: boolean;
  isOwner?: boolean;
  caseId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use prop caseId if provided, otherwise fall back to searchParams for backward compatibility
  const effectiveCaseId = caseId || searchParams.get("caseId");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseInfo, setCaseInfo] = useState<any>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStreamingOpen, setIsStreamingOpen] = useState(false);
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(
    new Set()
  );
  const [expandedBurdenOfProof, setExpandedBurdenOfProof] =
    useState(false);
  const [expandedElements, setExpandedElements] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState(false);
  const [expandedRecommendations, setExpandedRecommendations] =
    useState(false);
  const [expandedDefenses, setExpandedDefenses] = useState(false);
  const [expandedProcedural, setExpandedProcedural] = useState(false);
  const [expandedStatutes, setExpandedStatutes] = useState(false);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [stepReasonings, setStepReasonings] = useState<
    Record<string, string>
  >({});
  const [showAllFactors, setShowAllFactors] = useState(false);
  const [gamePlan, setGamePlan] = useState<any>(null);
  const [isGamePlanStreamingOpen, setIsGamePlanStreamingOpen] =
    useState(false);
  const [isGeneratingGamePlan, setIsGeneratingGamePlan] = useState(false);
  const [showOutcomeReasoning, setShowOutcomeReasoning] =
    useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEntityRelationshipsDialogOpen, setIsEntityRelationshipsDialogOpen] =
    useState(false);
  const setHeaderActions = useSetHeaderActions();
  const tResults = useTranslations("caseAnalysis.results");

  useEffect(() => {
    const handler = () => fetchResults(false);
    window.addEventListener(CASE_REGENERATED_EVENT, handler);
    return () => window.removeEventListener(CASE_REGENERATED_EVENT, handler);
  }, [effectiveCaseId]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/cases");
        setIsAuthenticated(res.status !== 401);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const fetchResults = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`/api/cases/${effectiveCaseId}`);
      const data = await response.json();

      if (!data.ok || !data.data?.result) {
        setError("No analysis results found");
        if (showLoading) setLoading(false);
        return;
      }

      setCaseInfo(data.data);
      setResult(data.data.result);
      setGamePlan(data.data.game_plan || null);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch results:", err);
      setError("Failed to load analysis results");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setIsStreamingOpen(true);
  };

  const handleStreamingComplete = (result: any) => {
    setResult(result);
    setIsRegenerating(false);
    setIsStreamingOpen(false);
    // Refresh the data from the database
    fetchResults(false);
  };

  const handleGenerateGamePlan = () => {
    if (!effectiveCaseId || !result || !caseInfo) {
      alert("Missing required data to generate game plan");
      return;
    }

    // Extract case info
    const case_info = {
      role: caseInfo.role || "",
      case_type: caseInfo.case_type || "",
      case_title:
        caseInfo.case_details?.case_information?.caseName || "",
      case_description:
        caseInfo.case_details?.case_information?.caseDescription ||
        "",
      city: caseInfo.jurisdiction?.city || "",
      state_province: caseInfo.jurisdiction?.state || "",
      country: caseInfo.jurisdiction?.country || "",
      evidence_summary:
        caseInfo.case_details?.evidence_and_supporting_materials
          ?.summary || "",
      key_witnesses_summary:
        caseInfo.case_details?.key_witness_and_testimony?.summary ||
        "",
    };

    // Open the streaming display modal
    setIsGeneratingGamePlan(true);
    setIsGamePlanStreamingOpen(true);
  };

  const handleGamePlanStreamingComplete = (result: any) => {
    setGamePlan(result);
    setIsGeneratingGamePlan(false);
    setIsGamePlanStreamingOpen(false);
    // Refresh the data from the database
    fetchResults(false);
  };

  const toggleFactorExpanded = (factorKey: string) => {
    const newExpanded = new Set(expandedFactors);
    if (newExpanded.has(factorKey)) {
      newExpanded.delete(factorKey);
    } else {
      newExpanded.add(factorKey);
    }
    setExpandedFactors(newExpanded);
  };

  const truncateWords = (
    text: string,
    wordLimit: number = 30
  ): { preview: string; full: string; isLong: boolean } => {
    const words = text.split(/\s+/);
    if (words.length > wordLimit) {
      return {
        preview: words.slice(0, wordLimit).join(" ") + "...",
        full: text,
        isLong: true,
      };
    }
    return {
      preview: text,
      full: text,
      isLong: false,
    };
  };

  useEffect(() => {
    if (!effectiveCaseId) {
      setError("No case ID provided");
      setLoading(false);
      return;
    }

    fetchResults();
  }, [effectiveCaseId]);

  // If showing only game plan, render just that section
  if (showGamePlanOnly) {
    return (
      <>
        <StreamingGamePlanDisplay
          isOpen={isGamePlanStreamingOpen}
          caseId={effectiveCaseId || ""}
          case_analysis={result}
          case_info={caseInfo}
          onComplete={handleGamePlanStreamingComplete}
          onClose={() => {
            setIsGeneratingGamePlan(false);
            setIsGamePlanStreamingOpen(false);
          }}
        />


        <div className="w-full max-w-full">
          <section className="overflow-hidden rounded-2xl border border-border-200/90 bg-surface-000 p-6 shadow-[0_12px_40px_-18px_rgba(18,24,38,0.12)] sm:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-highlight-200/60 text-xl shadow-sm ring-1 ring-primary-500/15"
                  aria-hidden
                >
                  🎯
                </div>
                <h3 className="font-display m-0 text-xl font-bold text-ink-900 sm:text-2xl">
                  Game plan
                </h3>
              </div>
              <button
                onClick={handleGenerateGamePlan}
                disabled={loading || isGeneratingGamePlan}
                type="button"
                title={
                  gamePlan
                    ? "Regenerate Game Plan"
                    : "Generate Game Plan"
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-900/20 bg-primary-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span aria-hidden>✨</span>
                {isGeneratingGamePlan
                  ? "…"
                  : gamePlan
                    ? "Regenerate"
                    : "Generate"}{" "}
                game plan
              </button>
            </div>

            {gamePlan ? (
              <GamePlanDisplay
                gamePlan={gamePlan}
                isAuthenticated={isAuthenticated}
                onShowAuthModal={() => setShowAuthModal(true)}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border-300 bg-surface-100/80 px-6 py-12 text-center">
                <p className="m-0 text-sm text-ink-600">
                  {loading
                    ? "Loading…"
                    : 'Click "Generate game plan" to create a strategic action plan for your case.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[min(60vh,480px)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border-200/80 bg-surface-000 px-10 py-11 shadow-[0_20px_50px_-24px_rgba(18,24,38,0.15)]">
          <LogoLoader size="md" />
          <p className="text-sm font-medium text-ink-600">
            Loading analysis results…
          </p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-critical-500/25 bg-critical-100/40 px-6 py-10 text-center shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-critical-600">
          Unable to load
        </p>
        <h3 className="font-display text-lg font-semibold text-ink-900">
          {error || "No Results Available"}
        </h3>
      </div>
    );
  }

  const isCriminalCase =
    result.case_analysis?.case_type === "criminal";
  const successProb = result.predicted_outcome?.win_probability
    ? Math.round(result.predicted_outcome.win_probability * 100)
    : 0;

  return (
    <div className="relative mx-auto max-w-4xl space-y-8 px-3 pb-16 pt-1 sm:px-4 sm:pt-2">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[min(420px,55vh)] max-w-5xl rounded-[40%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(36,85,136,0.11),transparent_65%)]"
        aria-hidden
      />
      <StreamingAnalysisDisplay
        isOpen={isStreamingOpen}
        caseId={effectiveCaseId || ""}
        onComplete={handleStreamingComplete}
        onClose={() => {
          setIsStreamingOpen(false);
          setIsRegenerating(false);
        }}
      />

      <CaseEntityRelationshipsDialog
        isOpen={isEntityRelationshipsDialogOpen}
        onClose={() => setIsEntityRelationshipsDialogOpen(false)}
        caseRow={caseInfo}
      />

      <StreamingGamePlanDisplay
        isOpen={isGamePlanStreamingOpen}
        caseId={effectiveCaseId || ""}
        case_analysis={result}
        case_info={caseInfo}
        onComplete={handleGamePlanStreamingComplete}
        onClose={() => {
          setIsGeneratingGamePlan(false);
          setIsGamePlanStreamingOpen(false);
        }}
      />

      {/* Reasoning Panel Toggle Button */}
      {Object.keys(stepReasonings).length > 0 && (
        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={() => setShowReasoningPanel(!showReasoningPanel)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-primary-900/25 bg-primary-800 px-6 py-3 text-base font-semibold text-white shadow-md ring-1 ring-white/10 transition hover:bg-primary-900 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {showReasoningPanel
              ? "Hide Analysis Reasoning ▲"
              : "Show Analysis Reasoning ▼"}
          </button>
        </div>
      )}

      {/* Reasoning Panel */}
      {showReasoningPanel &&
        Object.keys(stepReasonings).length > 0 && (
          <div className="mb-6 rounded-2xl border border-border-200/90 bg-surface-000 p-6 shadow-[0_10px_32px_-16px_rgba(18,24,38,0.12)] sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-2xl" aria-hidden>
                🧠
              </span>
              <h3 className="font-display m-0 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                Analysis reasoning by step
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {Object.entries(stepReasonings).map(
                ([step, reasoning]) => (
                  <div
                    key={step}
                    className="rounded-xl border border-border-200/80 border-l-4 border-l-primary-500 bg-surface-100/90 p-4 sm:p-5"
                  >
                    <p className="mb-3 font-display text-base font-bold leading-snug text-ink-900 sm:text-lg">
                      {step
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ")}
                    </p>
                    <div className="rounded-lg border border-border-200/70 border-l-[3px] border-l-primary-400 bg-surface-000 px-4 py-3.5 font-sans text-sm leading-[1.65] text-ink-900 antialiased whitespace-pre-wrap sm:text-[15px] sm:leading-[1.7]">
                      {reasoning}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Header with Meta Info */}
      {caseInfo && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border-200/90 bg-surface-000/95 p-4 shadow-[0_8px_30px_-12px_rgba(18,24,38,0.12)] backdrop-blur-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-200/80 bg-surface-100 px-3 py-1.5 text-xs font-medium text-ink-700 sm:text-sm">
              <span aria-hidden>⚖️</span>
              {caseInfo.case_type || "Unknown"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-200/80 bg-surface-100 px-3 py-1.5 text-xs font-medium text-ink-700 sm:text-sm">
              <span aria-hidden>👤</span>
              {caseInfo.role || "Unknown"}
            </span>
            {caseInfo.jurisdiction && (
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border-200/80 bg-surface-100 px-3 py-1.5 text-xs font-medium text-ink-700 sm:text-sm">
                <span aria-hidden>📍</span>
                <span className="hidden truncate sm:inline">
                  {[
                    caseInfo.jurisdiction.court ||
                      caseInfo.jurisdiction.court_name,
                    caseInfo.jurisdiction.state ||
                      caseInfo.jurisdiction.jurisdiction,
                  ]
                    .filter(Boolean)
                    .join(" — ") || "—"}
                </span>
                <span className="truncate sm:hidden">
                  {caseInfo.jurisdiction.state ||
                    caseInfo.jurisdiction.jurisdiction ||
                    caseInfo.jurisdiction.court ||
                    caseInfo.jurisdiction.court_name ||
                    "—"}
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200/60 bg-primary-100/50 px-3 py-1.5 text-xs font-medium text-primary-800 sm:text-sm">
              <span aria-hidden>📅</span>
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
            {!(isAuthenticated && isOwner) && (
              <button
                type="button"
                onClick={() => setIsEntityRelationshipsDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-200 bg-surface-050 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-primary-300 hover:bg-surface-100 sm:text-sm"
                title={tResults("entityRelationships.openPage")}
              >
                <span aria-hidden>🕸️</span>
                <span className="hidden sm:inline">
                  {tResults("entityRelationships.openPage")}
                </span>
              </button>
            )}
            {isAuthenticated && isOwner && !setHeaderActions && (
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-100/60 px-3 py-2 text-xs font-medium text-primary-900 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                title={
                  isRegenerating
                    ? tResults("regenerating")
                    : tResults("regenerate")
                }
              >
                {isRegenerating ? (
                  <LogoLoader size="xs" />
                ) : (
                  <svg
                    aria-hidden="true"
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
                <span>
                  {isRegenerating ? "…" : tResults("regenerate")}
                </span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-200 bg-surface-050 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-surface-100 sm:text-sm"
              title="Print"
              type="button"
            >
              <span aria-hidden>🖨️</span>
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => {
                // Anonymous users must sign in to share
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                  return;
                }
                // Authenticated users can share
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-200 bg-surface-050 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-surface-100 sm:text-sm"
              title="Share"
              type="button"
            >
              <span aria-hidden>🔗</span>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Title */}
      <div className="mb-10 text-center sm:mb-12">
        <div className="mx-auto mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-highlight-500" />
        <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-[2.15rem] sm:leading-tight">
          Case analysis results
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
          Grounded in your case details, procedural context, and
          comparable patterns—organized for clarity.
        </p>
      </div>

      {/* Predicted Outcome Probability - Featured Section */}
      {result.predicted_outcome?.win_probability !== undefined && (
        <div>
          <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-100/85 via-surface-000 to-warning-100/35 p-5 text-center shadow-[0_16px_48px_-20px_rgba(36,85,136,0.22)] ring-1 ring-accent-500/20 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-[1.65rem]" aria-hidden>
                🎯
              </span>
              <h3 className="font-display text-balance text-lg font-bold leading-snug text-ink-900 sm:text-2xl">
                {result.predicted_outcome?.prediction
                  .split("—")[0]
                  .replace(
                    /\w\S*/g,
                    (txt: string) =>
                      txt.charAt(0).toUpperCase() +
                      txt.slice(1).toLowerCase()
                  )}
              </h3>
            </div>

            {(() => {
              const headlineRaw =
                result.predicted_outcome?.prediction
                  .split("—")[0]
                  ?.trim() ?? "";
              const predictionSide =
                parsePredictionSideFromHeadline(headlineRaw);
              const userRoleRaw = (
                result.case_analysis?.role ||
                caseInfo?.role ||
                ""
              )
                .toLowerCase()
                .trim();
              const userSide =
                userRoleRaw === "plaintiff" ||
                userRoleRaw === "defendant"
                  ? userRoleRaw
                  : null;

              if (!predictionSide) return null;

              const roleLabel = tResults(
                predictionSide === "plaintiff"
                  ? "sidePlaintiff"
                  : "sideDefendant"
              );

              if (!userSide) {
                return (
                  <p className="mx-auto mb-5 max-w-lg px-2 text-center text-sm leading-snug text-ink-600">
                    {tResults("predictionRoleMissing")}
                  </p>
                );
              }

              const isAboutUser = predictionSide === userSide;
              return (
                <p
                  className={`mx-auto mb-5 max-w-lg rounded-lg px-3 py-2.5 text-center text-sm font-semibold leading-snug sm:text-[0.9375rem] ${
                    isAboutUser
                      ? "bg-primary-100/80 text-primary-950 ring-1 ring-primary-500/30"
                      : "bg-surface-200/90 text-ink-900 ring-1 ring-border-200/90"
                  }`}
                >
                  {isAboutUser
                    ? tResults("predictionAppliesToYou", {
                        role: roleLabel,
                      })
                    : tResults("predictionAppliesToOpponent", {
                        role: roleLabel,
                      })}
                </p>
              );
            })()}

            {/* Main Probability Section */}
            <div
              className={
                showOutcomeReasoning ? "mb-6 text-center" : "text-center"
              }
            >
              <div className="mb-5 sm:mb-6">
                <div className="my-2 bg-gradient-to-br from-accent-600 via-warning-600 to-primary-700 bg-clip-text text-4xl font-bold tabular-nums text-transparent sm:text-6xl">
                  {result.predicted_outcome?.prediction
                    .split("—")[1]
                    .split("%")[0] || 0}
                  %
                </div>
                <p className="my-2 text-xs text-ink-500 sm:text-sm">
                  {
                    result.predicted_outcome?.prediction
                      .split("—")[1]
                      .split("%")[1]
                  }
                </p>
              </div>

              <div className="mb-5 sm:mb-6">
                <p className="my-2 text-xs text-ink-500 sm:text-sm">
                  {
                    result.predicted_outcome?.estimated_range
                      ?.description
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative mx-auto mb-6 h-4 w-full max-w-2xl overflow-hidden rounded-full bg-surface-200 sm:h-5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-highlight-500 transition-all duration-500"
                  style={{ width: `${successProb}%` }}
                />
              </div>

              {/* Metrics */}
              <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2 sm:gap-4">
                <div className="rounded-xl border border-border-200/70 bg-surface-000/70 px-2 py-3 shadow-sm sm:px-4">
                  <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-wide text-ink-500 sm:mb-2 sm:text-xs">
                    Confidence
                  </p>
                  <p className="text-sm font-bold text-primary-800 sm:text-base">
                    {result.predicted_outcome?.confidence_category ||
                      "Weak"}
                  </p>
                </div>
                <div className="rounded-xl border border-border-200/70 bg-surface-000/70 px-2 py-3 shadow-sm sm:px-4">
                  <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-wide text-ink-500 sm:mb-2 sm:text-xs">
                    Depth
                  </p>
                  <p className="text-sm font-bold text-primary-800 sm:text-base">
                    {result.predicted_outcome?.analysis_depth ||
                      "Detailed"}
                  </p>
                </div>
                <div className="rounded-xl border border-border-200/70 bg-surface-000/70 px-2 py-3 shadow-sm sm:px-4">
                  <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-wide text-ink-500 sm:mb-2 sm:text-xs">
                    Risk
                  </p>
                  <p className="text-sm font-bold text-primary-800 sm:text-base">
                    {result.predicted_outcome?.risk_assessment
                      ?.level || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Reasoning Section - Inside Same Box */}
            {showOutcomeReasoning && (
              <div className="mt-6 border-t-2 border-accent-500/35 pt-6">
                {result.predicted_outcome?.reasoning && (
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        🔍
                      </span>
                      <h4 className="font-display m-0 text-base font-bold text-ink-900 sm:text-lg">
                        Prediction reasoning
                      </h4>
                    </div>
                    <div className="rounded-xl border border-accent-500/25 bg-accent-100/40 px-4 py-3.5 font-sans text-sm leading-[1.65] text-ink-900 antialiased whitespace-pre-wrap break-words sm:px-5 sm:py-4 sm:text-[15px] sm:leading-[1.7]">
                      {result.predicted_outcome.reasoning}
                    </div>
                  </div>
                )}

                {result.predicted_outcome
                  ?.confidence_level_reasoning && (
                  <div className="mb-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        📊
                      </span>
                      <h4 className="font-display m-0 text-base font-bold text-ink-900 sm:text-lg">
                        Confidence level reasoning
                      </h4>
                      <span className="rounded-md bg-primary-700 px-2 py-0.5 text-xs font-bold text-white">
                        {result.predicted_outcome?.confidence_level *
                          100 || 0}
                        %
                      </span>
                    </div>
                    <div className="rounded-xl border border-primary-200/80 bg-primary-100/50 px-4 py-3.5 font-sans text-sm leading-[1.65] text-ink-900 antialiased whitespace-pre-wrap break-words sm:px-5 sm:py-4 sm:text-[15px] sm:leading-[1.7]">
                      {
                        result.predicted_outcome
                          .confidence_level_reasoning
                      }
                    </div>
                  </div>
                )}

                {result.predicted_outcome
                  ?.analysis_depth_reasoning && (
                  <div className="mb-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        📈
                      </span>
                      <h4 className="font-display m-0 text-base font-bold text-ink-900 sm:text-lg">
                        Analysis depth reasoning
                      </h4>
                      <span className="rounded-md bg-success-600 px-2 py-0.5 text-xs font-bold text-white">
                        {result.predicted_outcome?.analysis_depth ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-success-500/30 bg-success-100/50 px-4 py-3.5 font-sans text-sm leading-[1.65] text-ink-900 antialiased whitespace-pre-wrap break-words sm:px-5 sm:py-4 sm:text-[15px] sm:leading-[1.7]">
                      {
                        result.predicted_outcome
                          .analysis_depth_reasoning
                      }
                    </div>
                  </div>
                )}

                {result.predicted_outcome?.risk_assessment && (
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        ⚠️
                      </span>
                      <h4 className="font-display m-0 text-base font-bold text-ink-900 sm:text-lg">
                        Risk assessment
                      </h4>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${
                          result.predicted_outcome.risk_assessment
                            .level === "High"
                            ? "bg-critical-600"
                            : result.predicted_outcome.risk_assessment
                                  .level === "Moderate"
                              ? "bg-warning-600"
                              : "bg-success-600"
                        }`}
                      >
                        {
                          result.predicted_outcome.risk_assessment
                            .level
                        }
                      </span>
                      {result.predicted_outcome.risk_assessment
                        .type && (
                        <span className="rounded-md bg-surface-200 px-2 py-0.5 text-xs font-semibold text-ink-900">
                          {
                            result.predicted_outcome.risk_assessment
                              .type
                          }
                        </span>
                      )}
                    </div>

                    {result.predicted_outcome.risk_assessment
                      .description && (
                      <div className="mb-3 rounded-xl border border-critical-500/25 bg-critical-100/50 px-4 py-3.5 font-sans text-sm leading-[1.65] text-ink-900 antialiased whitespace-pre-wrap break-words sm:px-5 sm:py-4 sm:text-[15px] sm:leading-[1.7]">
                        <p className="mb-2 text-sm font-bold text-critical-600">
                          Overview
                        </p>
                        {
                          result.predicted_outcome.risk_assessment
                            .description
                        }
                      </div>
                    )}

                    {result.predicted_outcome.risk_assessment
                      .reasoning && (
                      <div className="rounded-xl border border-warning-500/35 bg-warning-100/60 px-4 py-3.5 font-sans text-sm leading-[1.65] text-ink-900 antialiased whitespace-pre-wrap break-words sm:px-5 sm:py-4 sm:text-[15px] sm:leading-[1.7]">
                        <p className="mb-2 text-sm font-bold text-warning-600">
                          Detailed analysis
                        </p>
                        {
                          result.predicted_outcome.risk_assessment
                            .reasoning
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Toggle Button - Bottom Center */}
            {(result.predicted_outcome?.reasoning ||
              result.predicted_outcome?.confidence_level_reasoning ||
              result.predicted_outcome?.analysis_depth_reasoning ||
              result.predicted_outcome?.risk_assessment) && (
              <div className="mt-6 border-t border-accent-500/25 pt-5 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowOutcomeReasoning(!showOutcomeReasoning)
                  }
                  className={`inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 px-6 py-3 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                    showOutcomeReasoning
                      ? "border-primary-900/30 bg-primary-800 text-white shadow-md ring-1 ring-white/10 hover:bg-primary-900"
                      : "border-primary-600 bg-surface-000 text-ink-900 shadow-sm hover:bg-primary-50"
                  }`}
                >
                  {showOutcomeReasoning
                    ? "Hide Analysis Reasoning ▲"
                    : "Show Analysis Reasoning ▼"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Analysis Factors */}
      {result.key_factors &&
        Object.keys(result.key_factors).length > 0 &&
        (() => {
          const factorEntries = Object.entries(
            result.key_factors
          ).filter(([key]) => key.toLowerCase() !== "reasoning");
          if (factorEntries.length === 0) return null;
          const factorCount = factorEntries.length;
          const visibleEntries = showAllFactors
            ? factorEntries
            : factorEntries.slice(0, 4);

          return (
            <section
              className="overflow-hidden rounded-2xl border border-border-200/90 bg-gradient-to-b from-surface-050 to-surface-000 shadow-[0_12px_40px_-18px_rgba(18,24,38,0.14)]"
              aria-labelledby="key-factors-heading"
            >
              <div className="border-b border-border-200/80 bg-surface-000/80 px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200/80 text-lg shadow-sm ring-1 ring-primary-500/15"
                    aria-hidden
                  >
                    ⚖️
                  </div>
                  <div>
                    <h3
                      id="key-factors-heading"
                      className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl"
                    >
                      {tResults("keyFactors")}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-600">
                      {tResults("keyFactorsIntro")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                {visibleEntries.map(([key, value], factorIndex) => {
                  const raw = String(value);
                  const tone = (() => {
                    const v = raw.toLowerCase();
                    if (v.includes("favorable")) return "success" as const;
                    if (v.includes("moderate")) return "warning" as const;
                    if (v.includes("weak")) return "critical" as const;
                    return "info" as const;
                  })();
                  const toneBar = {
                    success: "border-l-[3px] border-l-success-500",
                    warning: "border-l-[3px] border-l-warning-500",
                    critical: "border-l-[3px] border-l-critical-500",
                    info: "border-l-[3px] border-l-primary-500",
                  }[tone];
                  const toneBadge = {
                    success:
                      "border border-success-500/25 bg-success-100 text-success-600",
                    warning:
                      "border border-warning-500/25 bg-warning-100 text-warning-600",
                    critical:
                      "border border-critical-500/25 bg-critical-100 text-critical-600",
                    info: "border border-info-500/25 bg-info-100 text-info-600",
                  }[tone];
                  const badgeText =
                    typeof value === "string"
                      ? value.split(":")[0]
                      : String(value);
                  const valueStr =
                    typeof value === "string"
                      ? value.split(":")[1]?.trim() ||
                        tResults("noDescription")
                      : String(value);
                  const isExpanded = expandedFactors.has(key);

                  return (
                    <article
                      key={key}
                      className={`relative rounded-xl border border-border-200/90 bg-surface-000 ${toneBar} shadow-sm transition-shadow hover:shadow-md`}
                    >
                      <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-sm font-bold tabular-nums text-primary-800 ring-1 ring-border-200/80 sm:h-10 sm:w-10 sm:text-base"
                          aria-hidden
                        >
                          {factorIndex + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <h4 className="text-pretty text-base font-bold leading-snug text-ink-900 sm:text-lg">
                              {key}
                            </h4>
                            <span
                              className={`inline-flex max-w-full shrink-0 items-center justify-center rounded-full px-3 py-1 text-center text-[11px] font-bold uppercase tracking-wide sm:text-xs ${toneBadge}`}
                            >
                              {badgeText}
                            </span>
                          </div>
                          <div className="mt-3 rounded-lg border border-border-200/60 bg-surface-100/70 px-3 py-2.5 sm:px-4 sm:py-3">
                            <KeyFactorDescription
                              text={valueStr}
                              isExpanded={isExpanded}
                              onToggle={() => toggleFactorExpanded(key)}
                              showMoreLabel={tResults("showMore")}
                              showLessLabel={tResults("showLess")}
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {factorCount > 4 && (
                <div className="border-t border-border-200/80 bg-surface-050/80 px-4 py-4 text-center sm:px-6">
                  <button
                    type="button"
                    onClick={() => setShowAllFactors(!showAllFactors)}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-full border-2 border-primary-600 bg-surface-000 px-6 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {showAllFactors
                      ? tResults("showLessFactors")
                      : tResults("showAllFactors", {
                          count: factorCount,
                        })}
                  </button>
                </div>
              )}
            </section>
          );
        })()}

      {/* Legal Assessment Section */}
      {result.legal_assessment && (
        <section className="overflow-hidden rounded-2xl border border-border-200/90 bg-gradient-to-b from-accent-100/30 via-surface-000 to-surface-000 shadow-[0_12px_40px_-18px_rgba(18,24,38,0.12)]">
          <div className="border-b border-border-200/80 bg-surface-000/90 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-warning-100/80 text-lg shadow-sm ring-1 ring-accent-500/20"
                aria-hidden
              >
                ⚖️
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                {isCriminalCase
                  ? "Criminal assessment"
                  : "Liability assessment"}
              </h3>
            </div>
          </div>

          <div className="space-y-8 p-4 sm:p-6">
          {/* Burden of Proof Section */}
          {result.legal_assessment.burden_of_proof && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  📜
                </span>
                <h4 className="m-0 text-base font-bold text-ink-900 sm:text-lg">
                  Burden of proof
                </h4>
              </div>
              <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-4 shadow-sm">
                <p className="m-0 text-sm font-semibold text-ink-900 sm:text-base">
                  {result.legal_assessment.burden_of_proof.standard}
                </p>
                <p className="mb-2 mt-1 text-xs leading-relaxed text-ink-600 sm:text-sm">
                  {
                    result.legal_assessment.burden_of_proof
                      .description
                  }
                </p>
                {result.legal_assessment.burden_of_proof.details && (
                  <div>
                    <div
                      className={`text-xs leading-relaxed text-ink-700 whitespace-pre-wrap sm:text-sm ${
                        expandedBurdenOfProof ? "" : "max-h-20 overflow-hidden"
                      }`}
                    >
                      {Array.isArray(
                        result.legal_assessment.burden_of_proof
                          .details
                      )
                        ? result.legal_assessment.burden_of_proof.details.join(
                            "\n"
                          )
                        : result.legal_assessment.burden_of_proof
                            .details}
                    </div>
                    {(Array.isArray(
                      result.legal_assessment.burden_of_proof.details
                    )
                      ? result.legal_assessment.burden_of_proof.details.join(
                          "\n"
                        ).length
                      : (
                          result.legal_assessment.burden_of_proof
                            .details as string
                        ).length) > 200 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedBurdenOfProof(
                            !expandedBurdenOfProof
                          )
                        }
                        className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                      >
                        {expandedBurdenOfProof
                          ? `${tResults("showLess")} ▲`
                          : `${tResults("showMore")} ▼`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Element Analysis */}
          {result.legal_assessment.elements_analysis && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  🔍
                </span>
                <h4 className="m-0 text-base font-bold text-ink-900 sm:text-lg">
                  {isCriminalCase
                    ? "Criminal elements analysis"
                    : "Liability elements analysis"}
                </h4>
              </div>

              {Object.entries(
                result.legal_assessment.elements_analysis
              )
                .slice(0, expandedElements ? undefined : 5)
                .map(([prop, elem]) => {
                  if (!elem || typeof elem !== "object") return null;

                  const elemData = elem as any;
                  const prob = Math.round(
                    elemData.probability
                      ? elemData.probability * 100
                      : elemData.score
                      ? elemData.score * 100
                      : 0
                  );

                  const pres = getElementStrengthPresentation(
                    prob,
                    result.case_analysis?.role
                  );

                  return (
                    <div
                      key={prop}
                      className={`mb-3 rounded-xl border p-4 shadow-sm last:mb-0 ${pres.shell}`}
                    >
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="m-0 text-sm font-semibold text-ink-900 sm:text-base">
                            {elemData.label}
                          </p>
                          <p className="m-0 mt-0.5 text-xs text-ink-600 sm:text-sm">
                            {elemData.description}
                          </p>
                        </div>
                        <span
                          className={`inline-flex shrink-0 rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap sm:text-xs ${pres.badge}`}
                        >
                          {pres.label}
                        </span>
                      </div>
                      {elemData.evaluation && (
                        <div className="mb-2">
                          <p className="m-0 text-xs italic leading-relaxed text-ink-700 sm:text-sm">
                            <span className="font-semibold not-italic">
                              Evaluation:
                            </span>{" "}
                            {elemData.evaluation}
                          </p>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200">
                          <div
                            className={`h-full rounded-full ${pres.bar}`}
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                        <span className="min-w-[2.75rem] text-right text-sm font-bold tabular-nums text-ink-900">
                          {prob}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              {Object.entries(
                result.legal_assessment.elements_analysis
              ).length > 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setExpandedElements(!expandedElements)
                  }
                  className="mt-3 w-full rounded-lg py-2 text-center text-xs font-semibold text-primary-700 hover:bg-primary-50 sm:text-sm"
                >
                  {expandedElements
                    ? `${tResults("showLess")} ▲`
                    : `${tResults("showMore")} ▼ (${
                        Object.entries(
                          result.legal_assessment.elements_analysis
                        ).length - 5
                      } more)`}
                </button>
              )}
            </div>
          )}

          {/* Strength of Evidence Section */}
          {result.legal_assessment.strength_of_evidence && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  📊
                </span>
                <h4 className="m-0 text-base font-bold text-ink-900 sm:text-lg">
                  Strength of evidence
                </h4>
              </div>

              {result.legal_assessment.strength_of_evidence
                .overall_evidence_score !== undefined && (
                <div className="mb-4 rounded-xl border border-border-200/80 bg-surface-100/80 p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="m-0 text-sm font-semibold text-ink-900">
                      Overall evidence score
                    </p>
                    <span className="text-lg font-bold tabular-nums text-primary-800">
                      {
                        result.legal_assessment.strength_of_evidence
                          .overall_evidence_score
                      }
                      /10
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-200">
                    <div
                      className={`h-full rounded-full ${evidenceScoreBarClass(
                        result.legal_assessment.strength_of_evidence
                          .overall_evidence_score
                      )}`}
                      style={{
                        width: `${
                          (result.legal_assessment.strength_of_evidence
                            .overall_evidence_score /
                            10) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {result.legal_assessment.strength_of_evidence
                  .documentary_evidence && (
                  <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-4 shadow-sm">
                    <div className="mb-2 flex justify-between gap-2">
                      <p className="m-0 text-sm font-semibold text-ink-900">
                        📄 Documentary evidence
                      </p>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${ratingStrengthBadgeClass(
                          result.legal_assessment.strength_of_evidence
                            .documentary_evidence.rating
                        )}`}
                      >
                        {
                          result.legal_assessment.strength_of_evidence
                            .documentary_evidence.rating
                        }
                      </span>
                    </div>
                    <p className="m-0 text-xs leading-relaxed text-ink-700 sm:text-sm">
                      {
                        result.legal_assessment.strength_of_evidence
                          .documentary_evidence.description
                      }
                    </p>
                  </div>
                )}

                {result.legal_assessment.strength_of_evidence
                  .witness_support && (
                  <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-4 shadow-sm">
                    <div className="mb-2 flex justify-between gap-2">
                      <p className="m-0 text-sm font-semibold text-ink-900">
                        👥 Witness support
                      </p>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${ratingStrengthBadgeClass(
                          result.legal_assessment.strength_of_evidence
                            .witness_support.rating
                        )}`}
                      >
                        {
                          result.legal_assessment.strength_of_evidence
                            .witness_support.rating
                        }
                      </span>
                    </div>
                    <p className="m-0 text-xs leading-relaxed text-ink-700 sm:text-sm">
                      {
                        result.legal_assessment.strength_of_evidence
                          .witness_support.description
                      }
                    </p>
                  </div>
                )}

                {result.legal_assessment.strength_of_evidence
                  .expert_reports && (
                  <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-4 shadow-sm">
                    <div className="mb-2 flex justify-between gap-2">
                      <p className="m-0 text-sm font-semibold text-ink-900">
                        🔬 Expert reports
                      </p>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${ratingStrengthBadgeClass(
                          result.legal_assessment.strength_of_evidence
                            .expert_reports.rating
                        )}`}
                      >
                        {
                          result.legal_assessment.strength_of_evidence
                            .expert_reports.rating
                        }
                      </span>
                    </div>
                    <p className="m-0 text-xs leading-relaxed text-ink-700 sm:text-sm">
                      {
                        result.legal_assessment.strength_of_evidence
                          .expert_reports.description
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Governing Law Section */}
          {result.legal_assessment.governing_law && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  ⚖️
                </span>
                <h4 className="m-0 text-base font-bold text-ink-900 sm:text-lg">
                  Governing law
                </h4>
              </div>
              {result.legal_assessment.governing_law.provisions && (
                <div className="space-y-2">
                  {(
                    result.legal_assessment.governing_law
                      .provisions as Array<{
                      provision: string;
                      description: string;
                    }>
                  ).map((prov, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border-200/80 bg-surface-100/80 p-3 shadow-sm"
                    >
                      <p className="m-0 text-sm font-semibold text-ink-900">
                        {prov.provision}
                      </p>
                      <p className="m-0 mt-1 text-xs leading-relaxed text-ink-700 sm:text-sm">
                        {prov.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Supporting Legal Authority */}
          {result.legal_assessment.supporting_authority && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  📚
                </span>
                <h4 className="m-0 text-base font-bold text-ink-900 sm:text-lg">
                  Supporting legal authority
                </h4>
              </div>

              {result.legal_assessment.supporting_authority
                .defenses &&
                result.legal_assessment.supporting_authority.defenses
                  .length > 0 && (
                  <div className="mb-5">
                    <p className="mb-2 text-sm font-semibold text-ink-900">
                      {isCriminalCase
                        ? "Potential defenses"
                        : "Defendant defenses"}
                    </p>
                    <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-3 shadow-sm">
                      {(
                        result.legal_assessment.supporting_authority
                          .defenses as string[]
                      )
                        .slice(0, expandedDefenses ? undefined : 5)
                        .map((defense, idx) => {
                          const { preview } = truncateWords(
                            defense,
                            25
                          );
                          return (
                            <p
                              key={idx}
                              className="my-1.5 text-xs leading-relaxed text-ink-700 first:mt-0 last:mb-0 sm:text-sm"
                            >
                              <span className="text-primary-600">
                                •
                              </span>{" "}
                              {preview}
                            </p>
                          );
                        })}
                    </div>
                    {(
                      result.legal_assessment.supporting_authority
                        .defenses as string[]
                    ).length > 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDefenses(!expandedDefenses)
                        }
                        className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                      >
                        {expandedDefenses
                          ? `${tResults("showLess")} ▲`
                          : `${tResults("showMore")} ▼`}
                      </button>
                    )}
                  </div>
                )}

              {result.legal_assessment.supporting_authority
                .procedural_rights &&
                result.legal_assessment.supporting_authority
                  .procedural_rights.length > 0 && (
                  <div className="mb-5">
                    <p className="mb-2 text-sm font-semibold text-ink-900">
                      Procedural rights
                    </p>
                    <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-3 shadow-sm">
                      {(
                        result.legal_assessment.supporting_authority
                          .procedural_rights as string[]
                      )
                        .slice(0, expandedProcedural ? undefined : 5)
                        .map((right, idx) => {
                          const { preview } = truncateWords(
                            right,
                            25
                          );
                          return (
                            <p
                              key={idx}
                              className="my-1.5 text-xs leading-relaxed text-ink-700 first:mt-0 last:mb-0 sm:text-sm"
                            >
                              <span className="text-primary-600">
                                •
                              </span>{" "}
                              {preview}
                            </p>
                          );
                        })}
                    </div>
                    {(
                      result.legal_assessment.supporting_authority
                        .procedural_rights as string[]
                    ).length > 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedProcedural(!expandedProcedural)
                        }
                        className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                      >
                        {expandedProcedural
                          ? `${tResults("showLess")} ▲`
                          : `${tResults("showMore")} ▼`}
                      </button>
                    )}
                  </div>
                )}

              {result.legal_assessment.supporting_authority
                .primary_statutes &&
                result.legal_assessment.supporting_authority
                  .primary_statutes.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-ink-900">
                      Primary statutes
                    </p>
                    <div className="rounded-xl border border-border-200/80 bg-surface-100/80 p-3 shadow-sm">
                      {(
                        result.legal_assessment.supporting_authority
                          .primary_statutes as string[]
                      )
                        .slice(0, expandedStatutes ? undefined : 5)
                        .map((statute, idx) => {
                          const { preview } = truncateWords(
                            statute,
                            25
                          );
                          return (
                            <p
                              key={idx}
                              className="my-1.5 text-xs leading-relaxed text-ink-700 first:mt-0 last:mb-0 sm:text-sm"
                            >
                              <span className="text-primary-600">
                                •
                              </span>{" "}
                              {preview}
                            </p>
                          );
                        })}
                    </div>
                    {(
                      result.legal_assessment.supporting_authority
                        .primary_statutes as string[]
                    ).length > 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedStatutes(!expandedStatutes)
                        }
                        className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                      >
                        {expandedStatutes
                          ? `${tResults("showLess")} ▲`
                          : `${tResults("showMore")} ▼`}
                      </button>
                    )}
                  </div>
                )}
            </div>
          )}
          </div>
        </section>
      )}

      {/* Strategic Recommendations */}
      {result.strategic_recommendations &&
        result.strategic_recommendations.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-border-200/90 bg-gradient-to-b from-highlight-200/25 via-surface-000 to-surface-000 shadow-[0_12px_40px_-18px_rgba(18,24,38,0.12)]">
            <div className="border-b border-border-200/80 bg-surface-000/90 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-highlight-200/80 to-primary-100 text-lg shadow-sm ring-1 ring-highlight-500/20"
                  aria-hidden
                >
                  💡
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                  Strategic recommendations
                </h3>
              </div>
            </div>

            <div className="space-y-3 p-4 sm:p-6">
            {result.strategic_recommendations
              .slice(0, expandedRecommendations ? undefined : 5)
              .map((rec, idx) => {
                if (typeof rec === "object" && rec.title) {
                  const pri = strategicPriorityClasses(rec.priority);

                  return (
                    <article
                      key={idx}
                      className={`rounded-xl p-4 shadow-sm ${pri.card}`}
                    >
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="m-0 mb-1 text-sm font-semibold text-ink-900 sm:text-base">
                            {rec.title}
                          </p>
                          {rec.impact && (
                            <p className="m-0 text-xs font-bold text-success-600">
                              ↑ Impact: {rec.impact}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${pri.badge}`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="m-0 text-xs leading-relaxed text-ink-700 sm:text-sm">
                        {rec.description}
                      </p>
                      {rec.category && (
                        <p className="mt-2 m-0 text-xs text-ink-500">
                          Category:{" "}
                          <span className="font-semibold text-ink-700">
                            {rec.category}
                          </span>
                        </p>
                      )}
                    </article>
                  );
                }
                return null;
              })}
            {result.strategic_recommendations.length > 5 && (
              <button
                type="button"
                onClick={() =>
                  setExpandedRecommendations(!expandedRecommendations)
                }
                className="mt-1 w-full rounded-lg py-2 text-center text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                {expandedRecommendations
                  ? `${tResults("showLess")} ▲`
                  : `${tResults("showMore")} ▼ (${
                      result.strategic_recommendations.length - 5
                    } more)`}
              </button>
            )}
            </div>
          </section>
        )}

      {/* Precedent Cases with Links */}
      {result.precedent_cases &&
        result.precedent_cases.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-border-200/90 bg-surface-000 shadow-[0_12px_40px_-18px_rgba(18,24,38,0.12)]">
            <div className="border-b border-border-200/80 bg-surface-050/90 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-lg shadow-sm ring-1 ring-primary-500/15"
                  aria-hidden
                >
                  📖
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                  Precedent cases ({result.precedent_cases.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
            {result.precedent_cases.map((precedent, idx) => {
              const sim = similarityToneClasses(
                precedent.similarity_score
              );

              return (
                <article
                  key={idx}
                  className={`rounded-xl border border-border-200/80 bg-surface-100/80 p-4 shadow-sm ${sim.border}`}
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="m-0 mb-1 text-sm font-semibold text-primary-800 break-words">
                        {precedent.case_name}
                      </p>
                      <p className="m-0 text-xs text-ink-500 break-words">
                        {precedent.citation}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap ${sim.badge}`}
                    >
                      {Math.round(precedent.similarity_score * 100)}%
                      similar
                    </span>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {precedent.year && (
                      <span className="rounded-md bg-info-100 px-2 py-1 text-[11px] font-semibold text-ink-900 ring-1 ring-info-600/30">
                        {precedent.year}
                      </span>
                    )}
                    {precedent.outcome && (
                      <span className="rounded-md bg-warning-100 px-2 py-1 text-[11px] font-semibold text-ink-900 ring-1 ring-warning-600/35">
                        {precedent.outcome}
                      </span>
                    )}
                    {precedent.source_name && (
                      <span className="rounded-md bg-surface-200 px-2 py-1 text-[11px] font-medium text-ink-700 ring-1 ring-border-200/80">
                        Source: {precedent.source_name}
                      </span>
                    )}
                  </div>

                  {precedent.holding && (
                    <div className="mb-3">
                      <p className="m-0 mb-1 text-xs font-semibold text-ink-900 sm:text-sm">
                        Holding
                      </p>
                      <p className="m-0 text-xs italic leading-relaxed text-ink-700 sm:text-sm">
                        &ldquo;{precedent.holding}&rdquo;
                      </p>
                    </div>
                  )}

                  <p className="mb-3 text-xs leading-relaxed text-ink-700 sm:text-sm">
                    {precedent.summary}
                  </p>

                  {precedent.source_url && (
                    <a
                      href={precedent.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-800"
                    >
                      <span aria-hidden>📖</span> Read full case
                    </a>
                  )}
                </article>
              );
            })}
            </div>
          </section>
        )}

      {/* Executive Summary */}
      {result.executive_summary && (
        <section className="overflow-hidden rounded-2xl border border-border-200/90 bg-gradient-to-b from-accent-100/25 via-surface-000 to-surface-000 shadow-[0_12px_40px_-18px_rgba(18,24,38,0.12)]">
          <div className="border-b border-border-200/80 bg-surface-000/90 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-lg shadow-sm ring-1 ring-accent-500/20"
                aria-hidden
              >
                📋
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                Executive summary
              </h3>
            </div>
          </div>

          <div className="p-4 sm:p-6">
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {result.executive_summary.charges && (
              <div className="rounded-xl border border-border-200/80 bg-surface-000 p-4 shadow-sm">
                <p className="m-0 mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-700">
                  {isCriminalCase ? "Charges" : "Claims"}
                </p>
                <p className="m-0 text-sm font-medium leading-relaxed text-ink-900 sm:text-base">
                  {result.executive_summary.charges}
                </p>
              </div>
            )}
            {result.executive_summary.strength_rating && (
              <div className="rounded-xl border border-border-200/80 bg-surface-000 p-4 shadow-sm">
                <p className="m-0 mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-700">
                  Strength rating
                </p>
                <p className="m-0 text-sm font-medium leading-relaxed text-ink-900 sm:text-base">
                  {result.executive_summary.strength_rating}
                </p>
              </div>
            )}
          </div>

          {result.executive_summary.case_overview && (
            <div className="mb-5">
              <p className="m-0 mb-1.5 text-sm font-semibold text-ink-900">
                Case overview
              </p>
              <p className="m-0 text-sm leading-relaxed text-ink-700 sm:text-base">
                {result.executive_summary.case_overview}
              </p>
            </div>
          )}

          {result.executive_summary.evidence_summary && (
            <div className="mb-5">
              <p className="m-0 mb-1.5 text-sm font-semibold text-ink-900">
                Evidence summary
              </p>
              <p className="m-0 text-sm leading-relaxed text-ink-700 sm:text-base">
                {result.executive_summary.evidence_summary}
              </p>
            </div>
          )}

          {result.executive_summary.strength_assessment && (
            <div className="mb-5">
              <p className="m-0 mb-1.5 text-sm font-semibold text-ink-900">
                Strength assessment
              </p>
              <p className="m-0 text-sm leading-relaxed text-ink-700 sm:text-base">
                {result.executive_summary.strength_assessment}
              </p>
            </div>
          )}

          {result.executive_summary.primary_recommendation && (
            <div className="rounded-xl border-2 border-accent-500 bg-surface-000 p-4 shadow-md ring-1 ring-accent-500/25">
              <p className="m-0 mb-2 text-sm font-bold text-ink-900">
                Primary recommendation
              </p>
              <p className="m-0 text-sm leading-relaxed text-ink-900 sm:text-base">
                {result.executive_summary.primary_recommendation}
              </p>
            </div>
          )}
          </div>
        </section>
      )}

      {/* Auth Modal for Share button */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Sign in to access full analysis
              </h3>
              <p className="text-sm text-gray-600">
                Create an account to unlock all features, save your
                cases, and get detailed analysis
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  router.push(`/auth/signin?caseId=${effectiveCaseId}`)
                }
                className="cursor-pointer w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() =>
                  router.push(`/auth/signup?caseId=${effectiveCaseId}`)
                }
                className="cursor-pointer w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Create Account
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
