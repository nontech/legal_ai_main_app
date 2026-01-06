"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import StreamingAnalysisDisplay from "./StreamingAnalysisDisplay";
import StreamingGamePlanDisplay from "./StreamingGamePlanDisplay";
import GamePlanDisplay from "./GamePlanDisplay";

interface AnalysisResult {
  predicted_outcome?: any;
  executive_summary?: any;
  key_factors?: Record<string, any>;
  legal_assessment?: any;
  case_analysis?: any;
  strategic_recommendations?: any[];
  precedent_cases?: any[];
  game_plan?: any;
}

export default function ResultsStep({
  showGamePlanOnly = false,
}: {
  showGamePlanOnly?: boolean;
}) {
  const t = useTranslations("caseAnalysis.results");
  const tGamePlan = useTranslations("caseAnalysis.gamePlan");
  const tCommon = useTranslations("caseAnalysis.common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

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
  const [showOutcomeReasoning, setShowOutcomeReasoning] =
    useState(false);

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
      const response = await fetch(`/api/cases/${caseId}`);
      const data = await response.json();

      if (!data.ok || !data.data?.result) {
        setError(t("noResults"));
        if (showLoading) setLoading(false);
        return;
      }

      setCaseInfo(data.data);
      setResult(data.data.result);
      setGamePlan(data.data.game_plan || null);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch results:", err);
      setError(t("failedToLoad"));
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
    if (!caseId || !result || !caseInfo) {
      alert(tGamePlan("missingData"));
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
    setIsGamePlanStreamingOpen(true);
  };

  const handleGamePlanStreamingComplete = (result: any) => {
    setGamePlan(result);
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

  const getTextPreview = (
    text: string,
    lines: number = 2
  ): { preview: string; full: string; isLong: boolean } => {
    const textLines = text.split("\n");
    if (textLines.length > lines) {
      return {
        preview: textLines.slice(0, lines).join("\n"),
        full: text,
        isLong: true,
      };
    }
    // Also check character length for long single lines
    const previewLength = 120;
    if (text.length > previewLength) {
      return {
        preview: text.substring(0, previewLength) + "...",
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
    if (!caseId) {
      setError(t("noCaseId"));
      setLoading(false);
      return;
    }

    fetchResults();
  }, [caseId]);

  // If showing only game plan, render just that section
  if (showGamePlanOnly) {
    return (
      <>
        <StreamingGamePlanDisplay
          isOpen={isGamePlanStreamingOpen}
          caseId={caseId || ""}
          case_analysis={result}
          case_info={caseInfo}
          onComplete={handleGamePlanStreamingComplete}
          onClose={() => setIsGamePlanStreamingOpen(false)}
        />

        <div style={{ maxWidth: "100%", width: "100%" }}>
          <div
            style={{
              background: "white",
              border: "1px solid #e8e8e8",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "24px" }}>🎯</span>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#333",
                    margin: 0,
                  }}
                >
                  {tGamePlan("title")}
                </h3>
              </div>
              <button
                onClick={handleGenerateGamePlan}
                disabled={loading}
                type="button"
                title={
                  gamePlan
                    ? tGamePlan("regenerateButton")
                    : tGamePlan("generateButton")
                }
                style={{
                  background: loading
                    ? "#ccc"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 12px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  pointerEvents: loading ? "none" : "auto",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <span>✨</span>
                {gamePlan
                  ? tGamePlan("regenerateButton")
                  : tGamePlan("generateButton")}
              </button>
            </div>

            {gamePlan ? (
              <GamePlanDisplay gamePlan={gamePlan} />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#666",
                }}
              >
                <p style={{ fontSize: "14px", margin: 0 }}>
                  {loading
                    ? tGamePlan("loading")
                    : tGamePlan("emptyStateText")}
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          {error || t("noResults")}
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
    <div
      className="space-y-8"
      style={{
        background:
          "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
      }}
    >
      <StreamingAnalysisDisplay
        isOpen={isStreamingOpen}
        caseId={caseId || ""}
        onComplete={handleStreamingComplete}
        onClose={() => setIsStreamingOpen(false)}
      />

      <StreamingGamePlanDisplay
        isOpen={isGamePlanStreamingOpen}
        caseId={caseId || ""}
        case_analysis={result}
        case_info={caseInfo}
        onComplete={handleGamePlanStreamingComplete}
        onClose={() => setIsGamePlanStreamingOpen(false)}
      />

      {/* Reasoning Panel Toggle Button */}
      {Object.keys(stepReasonings).length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button
            onClick={() => setShowReasoningPanel(!showReasoningPanel)}
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 6px 16px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
          >
            {showReasoningPanel
              ? `${t("hideReasoning")} ▲`
              : `${t("showReasoning")} ▼`}
          </button>
        </div>
      )}

      {/* Reasoning Panel */}
      {showReasoningPanel &&
        Object.keys(stepReasonings).length > 0 && (
          <div
            style={{
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "24px" }}>🧠</span>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: 0,
                }}
              >
                {t("analysisReasoningByStep")}
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "16px",
              }}
            >
              {Object.entries(stepReasonings).map(
                ([step, reasoning]) => (
                  <div
                    key={step}
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderLeft: "4px solid #667eea",
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "600",
                        color: "#333",
                        margin: "0 0 12px 0",
                        fontSize: "14px",
                      }}
                    >
                      {step
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ")}
                    </p>
                    <div
                      style={{
                        background: "white",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#555",
                        lineHeight: "1.5",
                        borderLeft: "3px solid #667eea",
                        whiteSpace: "pre-wrap",
                      }}
                    >
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
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm text-gray-700 bg-white shadow-sm p-4 sm:p-5 rounded-xl border border-gray-100 mx-3 sm:mx-0 gap-4"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex gap-3 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>⚖️</span>
              <span>
                {t("meta.type")}:{" "}
                {caseInfo.case_type || tCommon("unknown")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>👤</span>
              <span>
                {t("meta.role")}:{" "}
                {caseInfo.role || tCommon("unknown")}
              </span>
            </div>
            {caseInfo.jurisdiction && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span>📍</span>
                <span>
                  {t("meta.jurisdiction")}:{" "}
                  {`${
                    caseInfo.jurisdiction.court || tCommon("unknown")
                  } - ${
                    caseInfo.jurisdiction.state || tCommon("unknown")
                  }`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>📅</span>
              <span>
                {t("meta.generated")}:{" "}
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-start lg:justify-end">
            {isAuthenticated && (
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="cursor-pointer p-2 hover:bg-blue-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                title={
                  isRegenerating ? t("regenerating") : t("regenerate")
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
                <span className="text-xs font-medium">
                  {isRegenerating
                    ? t("regenerating")
                    : t("regenerate")}
                </span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={t("print")}
            >
              🖨️ {t("print")}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert(t("linkCopied"));
              }}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={t("share")}
            >
              🔗 {t("share")}
            </button>
          </div>
        </div>
      )}

      {/* Main Title */}
      <div className="text-center mb-8 px-3 sm:px-0">
        <div
          style={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            📊 {t("title")}
          </h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-medium">
          {t("subtitle")}
        </p>
      </div>

      {/* Predicted Outcome Probability - Featured Section */}
      {result.predicted_outcome?.win_probability !== undefined && (
        <div className="mx-3 sm:mx-0">
          <div
            className="p-4 sm:p-7 text-center"
            style={{
              background:
                "linear-gradient(135deg, #fffbf0 0%, #fff5e6 100%)",
              border: "2px solid #f39c12",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(243, 156, 18, 0.12)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "24px" }}>🎯</span>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: 0,
                }}
                className="sm:text-2xl"
              >
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

            {/* Main Probability Section */}
            <div
              style={{
                textAlign: "center",
                marginBottom: showOutcomeReasoning ? "24px" : "0",
              }}
            >
              <div className="mb-4 sm:mb-5">
                <div
                  className="text-4xl sm:text-6xl font-bold my-2"
                  style={{ color: "#d4a500" }}
                >
                  {result.predicted_outcome?.prediction
                    .split("—")[1]
                    .split("%")[0] || 0}
                  %
                </div>
                <p className="text-gray-500 my-2 text-xs sm:text-sm">
                  {
                    result.predicted_outcome?.prediction
                      .split("—")[1]
                      .split("%")[1]
                  }
                </p>
              </div>

              <div className="mb-4 sm:mb-5">
                <p className="text-gray-500 my-2 text-xs sm:text-sm">
                  {
                    result.predicted_outcome?.estimated_range
                      ?.description
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 sm:h-5 bg-gray-200 rounded-full overflow-hidden mb-5 sm:mb-6">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${successProb}%`,
                    background:
                      "linear-gradient(90deg, #4a90e2 0%, #357abd 100%)",
                  }}
                ></div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-5">
                <div>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "13px",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {t("metrics.confidenceLevel")}
                  </p>
                  <p
                    style={{
                      color: "#2c5aa0",
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: 0,
                    }}
                  >
                    {result.predicted_outcome?.confidence_category ||
                      "Weak"}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "13px",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {t("metrics.analysisDepth")}
                  </p>
                  <p
                    style={{
                      color: "#2c5aa0",
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: 0,
                    }}
                  >
                    {result.predicted_outcome?.analysis_depth ||
                      "Detailed"}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "13px",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {t("metrics.riskLevel")}
                  </p>
                  <p
                    style={{
                      color: "#2c5aa0",
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: 0,
                    }}
                  >
                    {result.predicted_outcome?.risk_assessment
                      ?.level || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Reasoning Section - Inside Same Box */}
            {showOutcomeReasoning && (
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "2px solid rgba(243, 156, 18, 0.3)",
                }}
              >
                {/* Main Prediction Reasoning */}
                {result.predicted_outcome?.reasoning && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>🔍</span>
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        {t("predictionReasoning")}
                      </h4>
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 251, 245, 0.6)",
                        border: "1px solid #ffe0b2",
                        borderRadius: "8px",
                        padding: "14px",
                        fontSize: "13px",
                        color: "#555",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {result.predicted_outcome.reasoning}
                    </div>
                  </div>
                )}

                {/* Confidence Level Reasoning */}
                {result.predicted_outcome
                  ?.confidence_level_reasoning && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>📊</span>
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        {t("confidenceReasoning")}
                      </h4>
                      <span
                        style={{
                          background: "#2c5aa0",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {result.predicted_outcome?.confidence_level *
                          100 || 0}
                        %
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(240, 247, 255, 0.6)",
                        border: "1px solid #d4e6f1",
                        borderRadius: "8px",
                        padding: "14px",
                        fontSize: "13px",
                        color: "#555",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {
                        result.predicted_outcome
                          .confidence_level_reasoning
                      }
                    </div>
                  </div>
                )}

                {/* Analysis Depth Reasoning */}
                {result.predicted_outcome
                  ?.analysis_depth_reasoning && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>📈</span>
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        {t("analysisDepthReasoning")}
                      </h4>
                      <span
                        style={{
                          background: "#27ae60",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {result.predicted_outcome?.analysis_depth ||
                          "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(240, 253, 244, 0.6)",
                        border: "1px solid #c6f6d5",
                        borderRadius: "8px",
                        padding: "14px",
                        fontSize: "13px",
                        color: "#555",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {
                        result.predicted_outcome
                          .analysis_depth_reasoning
                      }
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {result.predicted_outcome?.risk_assessment && (
                  <div style={{ marginBottom: "0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>⚠️</span>
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        {t("riskAssessment")}
                      </h4>
                      <span
                        style={{
                          background:
                            result.predicted_outcome.risk_assessment
                              .level === "High"
                              ? "#e74c3c"
                              : result.predicted_outcome
                                  .risk_assessment.level ===
                                "Moderate"
                              ? "#f39c12"
                              : "#27ae60",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {
                          result.predicted_outcome.risk_assessment
                            .level
                        }
                      </span>
                      {result.predicted_outcome.risk_assessment
                        .type && (
                        <span
                          style={{
                            background: "#ecf0f1",
                            color: "#333",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "500",
                          }}
                        >
                          {
                            result.predicted_outcome.risk_assessment
                              .type
                          }
                        </span>
                      )}
                    </div>

                    {/* Risk Description */}
                    {result.predicted_outcome.risk_assessment
                      .description && (
                      <div
                        style={{
                          background: "rgba(255, 230, 230, 0.6)",
                          border: "1px solid #ffc6c6",
                          borderRadius: "8px",
                          padding: "14px",
                          marginBottom: "12px",
                          fontSize: "13px",
                          color: "#555",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            fontWeight: "600",
                            color: "#c0392b",
                          }}
                        >
                          {t("overview")}:
                        </p>
                        {
                          result.predicted_outcome.risk_assessment
                            .description
                        }
                      </div>
                    )}

                    {/* Risk Reasoning */}
                    {result.predicted_outcome.risk_assessment
                      .reasoning && (
                      <div
                        style={{
                          background: "rgba(255, 243, 205, 0.6)",
                          border: "1px solid #ffc107",
                          borderRadius: "8px",
                          padding: "14px",
                          fontSize: "13px",
                          color: "#555",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            fontWeight: "600",
                            color: "#856404",
                          }}
                        >
                          {t("detailedAnalysis")}:
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
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop: "1px solid rgba(243, 156, 18, 0.3)",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() =>
                    setShowOutcomeReasoning(!showOutcomeReasoning)
                  }
                  style={{
                    background: showOutcomeReasoning
                      ? "#f39c12"
                      : "transparent",
                    color: showOutcomeReasoning ? "white" : "#f39c12",
                    border: "2px solid #f39c12",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!showOutcomeReasoning) {
                      (
                        e.currentTarget as HTMLElement
                      ).style.background = "#f39c12";
                      (e.currentTarget as HTMLElement).style.color =
                        "white";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!showOutcomeReasoning) {
                      (
                        e.currentTarget as HTMLElement
                      ).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "#f39c12";
                    }
                  }}
                >
                  {showOutcomeReasoning
                    ? `${t("hideReasoning")} ▲`
                    : `${t("showReasoning")} ▼`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Analysis Factors */}
      {result.key_factors &&
        Object.keys(result.key_factors).length > 0 && (
          <div
            className="mx-3 sm:mx-0"
            style={{
              background: "white",
              border: "1px solid #e8e8e8",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "24px" }}>⚖️</span>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: 0,
                }}
              >
                {t("keyFactors")}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {Object.entries(result.key_factors)
                .filter(([key]) => key.toLowerCase() !== "reasoning")
                .slice(0, showAllFactors ? undefined : 4)
                .map(([key, value]) => {
                  const getBadgeColor = (key: string) => {
                    if (key.toLowerCase().includes("favorable"))
                      return "#27ae60";
                    if (key.toLowerCase().includes("moderate"))
                      return "#f39c12";
                    if (key.toLowerCase().includes("weak"))
                      return "#e74c3c";
                    return "#3498db";
                  };
                  const badgeText =
                    typeof value === "string"
                      ? value.split(":")[0]
                      : String(value);
                  const valueStr =
                    typeof value === "string"
                      ? value.split(":")[1]?.trim() ||
                        t("noDescription")
                      : String(value);
                  const { preview, full, isLong } = getTextPreview(
                    valueStr,
                    2
                  );
                  const isExpanded = expandedFactors.has(key);

                  return (
                    <div
                      key={key}
                      style={{
                        background: "#f8f9fa",
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <span
                          style={{
                            background: getBadgeColor(key),
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {badgeText}
                        </span>
                        <div className="flex-1">
                          <div
                            style={{
                              color: "#555",
                              fontSize: "14px",
                              lineHeight: "1.5",
                              fontWeight: "500",
                            }}
                          >
                            {isExpanded ? full : preview}
                            {isLong && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFactorExpanded(key);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#667eea",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  padding: "0 0 0 4px",
                                  fontWeight: "600",
                                }}
                              >
                                {isExpanded
                                  ? t("showLess")
                                  : t("showMore")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {Object.keys(result.key_factors).filter(
              (k) => k.toLowerCase() !== "reasoning"
            ).length > 4 && (
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <button
                  onClick={() => setShowAllFactors(!showAllFactors)}
                  style={{
                    background: "transparent",
                    border: "1px solid #d0d0d0",
                    color: "#666",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    (
                      e.currentTarget as HTMLElement
                    ).style.background = "#f5f5f5";
                    (e.currentTarget as HTMLElement).style.color =
                      "#333";
                  }}
                  onMouseOut={(e) => {
                    (
                      e.currentTarget as HTMLElement
                    ).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "#666";
                  }}
                >
                  {showAllFactors
                    ? t("showLessFactors")
                    : t("showAllFactors", {
                        count: Object.keys(result.key_factors).filter(
                          (k) => k.toLowerCase() !== "reasoning"
                        ).length,
                      })}
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
