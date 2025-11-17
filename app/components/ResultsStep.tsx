"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StreamingAnalysisDisplay from "./StreamingAnalysisDisplay";

interface AnalysisResult {
  predicted_outcome?: any;
  executive_summary?: any;
  key_factors?: Record<string, any>;
  legal_assessment?: any;
  case_analysis?: any;
  strategic_recommendations?: any[];
  precedent_cases?: any[];
}

export default function ResultsStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseInfo, setCaseInfo] = useState<any>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isStreamingOpen, setIsStreamingOpen] = useState(false);
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());
  const [expandedBurdenOfProof, setExpandedBurdenOfProof] = useState(false);
  const [expandedElements, setExpandedElements] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState(false);
  const [expandedRecommendations, setExpandedRecommendations] = useState(false);
  const [expandedDefenses, setExpandedDefenses] = useState(false);
  const [expandedProcedural, setExpandedProcedural] = useState(false);
  const [expandedStatutes, setExpandedStatutes] = useState(false);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [stepReasonings, setStepReasonings] = useState<Record<string, string>>({});
  const [showAllFactors, setShowAllFactors] = useState(false);

  const fetchResults = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`/api/cases/${caseId}`);
      const data = await response.json();

      if (!data.ok || !data.data?.result) {
        setError("No analysis results found");
        if (showLoading) setLoading(false);
        return;
      }

      setCaseInfo(data.data);
      setResult(data.data.result);
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


  const toggleFactorExpanded = (factorKey: string) => {
    const newExpanded = new Set(expandedFactors);
    if (newExpanded.has(factorKey)) {
      newExpanded.delete(factorKey);
    } else {
      newExpanded.add(factorKey);
    }
    setExpandedFactors(newExpanded);
  };

  const getTextPreview = (text: string, lines: number = 2): { preview: string; full: string; isLong: boolean } => {
    const textLines = text.split('\n');
    if (textLines.length > lines) {
      return {
        preview: textLines.slice(0, lines).join('\n'),
        full: text,
        isLong: true,
      };
    }
    // Also check character length for long single lines
    const previewLength = 120;
    if (text.length > previewLength) {
      return {
        preview: text.substring(0, previewLength) + '...',
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

  const truncateWords = (text: string, wordLimit: number = 30): { preview: string; full: string; isLong: boolean } => {
    const words = text.split(/\s+/);
    if (words.length > wordLimit) {
      return {
        preview: words.slice(0, wordLimit).join(' ') + '...',
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
      setError("No case ID provided");
      setLoading(false);
      return;
    }

    fetchResults();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">{error || "No Results Available"}</h3>
      </div>
    );
  }

  const isCriminalCase = result.case_analysis?.case_type === "criminal";
  const successProb = result.predicted_outcome?.win_probability
    ? Math.round(result.predicted_outcome.win_probability * 100)
    : 0;


  return (
    <div className="space-y-8" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)" }}>
      <StreamingAnalysisDisplay
        isOpen={isStreamingOpen}
        caseId={caseId || ""}
        onComplete={handleStreamingComplete}
        onClose={() => setIsStreamingOpen(false)}
      />

      {/* Reasoning Panel Toggle Button */}
      {Object.keys(stepReasonings).length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button
            onClick={() => setShowReasoningPanel(!showReasoningPanel)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
          >
            {showReasoningPanel ? "Hide Analysis Reasoning ▲" : "Show Analysis Reasoning ▼"}
          </button>
        </div>
      )}

      {/* Reasoning Panel */}
      {showReasoningPanel && Object.keys(stepReasonings).length > 0 && (
        <div style={{
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>🧠</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Analysis Reasoning by Step
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {Object.entries(stepReasonings).map(([step, reasoning]) => (
              <div key={step} style={{
                background: "#f8f9fa",
                border: "1px solid #e0e0e0",
                borderLeft: "4px solid #667eea",
                borderRadius: "8px",
                padding: "16px",
              }}>
                <p style={{ fontWeight: "600", color: "#333", margin: "0 0 12px 0", fontSize: "14px" }}>
                  {step.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
                <div style={{
                  background: "white",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#555",
                  lineHeight: "1.5",
                  borderLeft: "3px solid #667eea",
                  whiteSpace: "pre-wrap",
                }}>
                  {reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header with Meta Info */}
      {caseInfo && (
        <div className="flex items-center justify-between text-sm text-gray-700 bg-white shadow-sm p-5 rounded-xl border border-gray-100" style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span>⚖️</span>
              <span>Type: {caseInfo.case_type || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span>Role: {caseInfo.role || "Unknown"}</span>
            </div>
            {caseInfo.jurisdiction && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Jurisdiction: {`${caseInfo.jurisdiction.court || ''} - ${caseInfo.jurisdiction.state || ''}`}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="p-2 hover:bg-blue-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              title={isRegenerating ? "Regenerating..." : "Regenerate Results"}
            >
              {isRegenerating ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span className="text-xs font-medium">{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Print"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard");
              }}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Share"
            >
              🔗 Share
            </button>
          </div>
        </div>
      )}

      {/* Main Title */}
      <div className="text-center mb-8 px-3 sm:px-0">
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">📊 Case Analysis Results</h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-medium">Comprehensive analysis based on case details, judicial patterns, and legal precedents</p>
      </div>

      {/* Predicted Outcome Probability - Featured Section */}
      {result.predicted_outcome?.win_probability !== undefined && (
        <div style={{
          background: "linear-gradient(135deg, #fffbf0 0%, #fff5e6 100%)",
          border: "2px solid #f39c12",
          borderRadius: "16px",
          padding: "28px 24px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(243, 156, 18, 0.12)",
        }} className="mx-3 sm:mx-0">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "24px" }}>🎯</span>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: 0 }} className="sm:text-2xl">
              Likelihood of {caseInfo.role.charAt(0).toUpperCase() + caseInfo.role.slice(1)}'s Success
            </h3>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#d4a500",
              margin: "10px 0",
            }} className="sm:text-6xl">
              {successProb}%
            </div>
            <p style={{ color: "#666", margin: "8px 0", fontSize: "14px" }}>
              Success Probability (Range: {Math.max(0, successProb - 8)}% – {Math.min(100, successProb + 8)}%)
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: "100%",
            height: "20px",
            background: "#e0e0e0",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "25px",
          }}>
            <div style={{
              height: "100%",
              width: `${successProb}%`,
              background: "linear-gradient(90deg, #4a90e2 0%, #357abd 100%)",
              transition: "width 0.5s ease-out",
            }}></div>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <div>
              <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>Confidence Level</p>
              <p style={{ color: "#2c5aa0", fontWeight: "bold", fontSize: "16px", margin: 0 }}>
                {result.predicted_outcome?.confidence_category || "Weak"}
              </p>
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>Analysis Depth</p>
              <p style={{ color: "#2c5aa0", fontWeight: "bold", fontSize: "16px", margin: 0 }}>
                {result.predicted_outcome?.analysis_depth || "Detailed"}
              </p>
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>Risk Assessment</p>
              <p style={{ color: "#2c5aa0", fontWeight: "bold", fontSize: "16px", margin: 0 }}>
                {successProb > 70 ? "Low" : successProb > 50 ? "Moderate" : "High"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Analysis Factors */}
      {result.key_factors && Object.keys(result.key_factors).length > 0 && (
        <div style={{
          background: "white",
          border: "1px solid #e8e8e8",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>⚖️</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Key Analysis Factors
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {Object.entries(result.key_factors)
              .filter(([key]) => key.toLowerCase() !== "reasoning")
              .slice(0, showAllFactors ? undefined : 4)
              .map(([key, value]) => {
                const getBadgeColor = (key: string) => {
                  if (key.toLowerCase().includes("favorable")) return "#27ae60";
                  if (key.toLowerCase().includes("moderate")) return "#f39c12";
                  if (key.toLowerCase().includes("weak")) return "#e74c3c";
                  return "#3498db";
                };
                const badgeText = typeof value === "string" ? value.split(":")[0] : String(value);
                const valueStr = typeof value === "string" ? value.split(":")[1]?.trim() || 'No description available' : String(value);
                const { preview, full, isLong } = getTextPreview(valueStr, 2);
                const isExpanded = expandedFactors.has(key);

                return (
                  <div key={key} style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "16px",
                    marginBottom: "12px",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    gap: "16px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#f0f4f8";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#f8f9fa";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      <p style={{ fontWeight: "600", color: "#333", margin: 0 }}>{key}</p>
                      <span style={{
                        background: getBadgeColor(String(value)),
                        color: "white",
                        padding: "6px 12px",
                        minWidth: "50px",
                        maxWidth: "100px",
                        textAlign: "center",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        flexShrink: 0,
                        boxShadow: `0 2px 8px ${getBadgeColor(String(value))}33`,
                      }}>
                        {badgeText}
                      </span>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <p style={{ fontSize: "13px", color: "#666", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {isExpanded ? full : preview}
                      </p>
                      {isLong && (
                        <button
                          onClick={() => toggleFactorExpanded(key)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#3498db",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            padding: "4px 0",
                            textDecoration: "none",
                            alignSelf: "flex-start",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          {isExpanded ? "Show Less ▲" : "Show More ▼"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {Object.entries(result.key_factors).filter(([key]) => key.toLowerCase() !== "reasoning").length > 4 && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <button
                onClick={() => setShowAllFactors(!showAllFactors)}
                style={{
                  background: "none",
                  border: "1px solid #3498db",
                  color: "#3498db",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#3498db";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "none";
                  (e.currentTarget as HTMLElement).style.color = "#3498db";
                }}
              >
                {showAllFactors ? "Show Less" : "Show All"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Legal Assessment Section */}
      {result.legal_assessment && (
        <div style={{
          background: "#fffbf5",
          border: "1px solid #ffe0b2",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>⚖️</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#e67e22", margin: 0 }}>
              {isCriminalCase ? "Criminal Assessment" : "Liability Assessment"}
            </h3>
          </div>

          {/* Burden of Proof Section */}
          {result.legal_assessment.burden_of_proof && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>📜</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Burden of Proof</h4>
              </div>
              <div style={{
                background: "#f8f9fa",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px",
              }}>
                <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "14px" }}>
                  {result.legal_assessment.burden_of_proof.standard}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: "0 0 8px 0" }}>
                  {result.legal_assessment.burden_of_proof.description}
                </p>
                {result.legal_assessment.burden_of_proof.details && (
                  <div>
                    <div style={{ fontSize: "12px", color: "#555", whiteSpace: "pre-wrap", maxHeight: expandedBurdenOfProof ? "none" : "80px", overflow: "hidden" }}>
                      {Array.isArray(result.legal_assessment.burden_of_proof.details)
                        ? result.legal_assessment.burden_of_proof.details.join("\n")
                        : result.legal_assessment.burden_of_proof.details}
                    </div>
                    {(Array.isArray(result.legal_assessment.burden_of_proof.details) ? result.legal_assessment.burden_of_proof.details.join("\n").length : (result.legal_assessment.burden_of_proof.details as string).length) > 200 && (
                      <button
                        onClick={() => setExpandedBurdenOfProof(!expandedBurdenOfProof)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3498db",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "6px 0",
                          marginTop: "8px",
                          textDecoration: "none",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {expandedBurdenOfProof ? "Show Less ▲" : "Show More ▼"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Element Analysis */}
          {result.legal_assessment.elements_analysis && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "20px" }}>🔍</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>
                  {isCriminalCase ? "Criminal Elements Analysis" : "Liability Elements Analysis"}
                </h4>
              </div>

              {Object.entries(result.legal_assessment.elements_analysis)
                .slice(0, expandedElements ? undefined : 5)
                .map(([prop, elem]) => {
                  if (!elem || typeof elem !== 'object') return null;

                  const elemData = elem as any;
                  const prob = Math.round(elemData.probability ? elemData.probability * 100 : elemData.score ? elemData.score * 100 : 0);

                  const getColor = (p: number) => {
                    // For civil cases: depends on role
                    const isPlaintiff = result.case_analysis?.role === "plaintiff";
                    const isDefendant = result.case_analysis?.role === "defendant";

                    if (isPlaintiff) {
                      // For plaintiff: high probability = strong evidence for plaintiff = good
                      if (p > 70) return { bg: "#e8f5e9", border: "#27ae60", badge: "Strong" };
                      if (p > 50) return { bg: "#fff3cd", border: "#f39c12", badge: "Moderate" };
                      return { bg: "#ffebee", border: "#e74c3c", badge: "Weak" };
                    } else if (isDefendant) {
                      // For defendant: high probability = strong evidence against defendant = bad
                      if (p > 70) return { bg: "#ffebee", border: "#e74c3c", badge: "Strong Against" };
                      if (p > 50) return { bg: "#fff3cd", border: "#f39c12", badge: "Moderate Against" };
                      return { bg: "#e8f5e9", border: "#27ae60", badge: "Weak Against" };
                    } else {
                      // Default for other roles
                      if (p > 70) return { bg: "#e8f5e9", border: "#27ae60", badge: "Strong" };
                      if (p > 50) return { bg: "#fff3cd", border: "#f39c12", badge: "Moderate" };
                      return { bg: "#ffebee", border: "#e74c3c", badge: "Weak" };
                    }
                  };
                  const colors = getColor(prob);

                  return (
                    <div key={prop} style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                        <div>
                          <p style={{ fontWeight: "600", color: "#333", margin: "0 0 2px 0", fontSize: "14px" }}>
                            {elemData.label}
                          </p>
                          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                            {elemData.description}
                          </p>
                        </div>
                        <span style={{
                          background: colors.border,
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          marginLeft: "8px",
                        }}>
                          {colors.badge}
                        </span>
                      </div>
                      {elemData.evaluation && (
                        <div style={{ marginBottom: "8px" }}>
                          <p style={{ fontSize: "12px", color: "#555", margin: 0, fontStyle: "italic" }}>
                            <strong>Evaluation:</strong> {elemData.evaluation}
                          </p>
                        </div>
                      )}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}>
                        <div style={{ flex: 1, height: "6px", background: "#ddd", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${prob}%`,
                            background: colors.border,
                          }}></div>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: colors.border, minWidth: "35px", textAlign: "right" }}>
                          {prob}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              {Object.entries(result.legal_assessment.elements_analysis).length > 5 && (
                <button
                  onClick={() => setExpandedElements(!expandedElements)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3498db",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: "8px 0",
                    marginTop: "12px",
                    textDecoration: "none",
                    width: "100%",
                    textAlign: "center",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  {expandedElements ? "Show Less ▲" : `Show More ▼ (${Object.entries(result.legal_assessment.elements_analysis).length - 5} more)`}
                </button>
              )}
            </div>
          )}

          {/* Strength of Evidence Section */}
          {result.legal_assessment.strength_of_evidence && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>📊</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Strength of Evidence</h4>
              </div>

              {/* Overall Evidence Score */}
              {result.legal_assessment.strength_of_evidence.overall_evidence_score !== undefined && (
                <div style={{
                  background: "#f8f9fa",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <p style={{ fontWeight: "600", color: "#333", margin: 0, fontSize: "13px" }}>
                      Overall Evidence Score
                    </p>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#2c5aa0" }}>
                      {result.legal_assessment.strength_of_evidence.overall_evidence_score}/10
                    </span>
                  </div>
                  <div style={{ height: "8px", background: "#e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${(result.legal_assessment.strength_of_evidence.overall_evidence_score / 10) * 100}%`,
                      background: result.legal_assessment.strength_of_evidence.overall_evidence_score > 7
                        ? "#27ae60"
                        : result.legal_assessment.strength_of_evidence.overall_evidence_score > 5
                          ? "#f39c12"
                          : "#e74c3c",
                    }}></div>
                  </div>
                </div>
              )}

              {/* Evidence Types */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {result.legal_assessment.strength_of_evidence.documentary_evidence && (
                  <div style={{
                    background: "#f8f9fa",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "12px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px" }}>
                      <p style={{ fontWeight: "600", color: "#333", margin: 0, fontSize: "13px" }}>
                        📄 Documentary Evidence
                      </p>
                      <span style={{
                        background: result.legal_assessment.strength_of_evidence.documentary_evidence.rating === "Strong"
                          ? "#27ae60"
                          : result.legal_assessment.strength_of_evidence.documentary_evidence.rating === "Moderate"
                            ? "#f39c12"
                            : "#e74c3c",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}>
                        {result.legal_assessment.strength_of_evidence.documentary_evidence.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      {result.legal_assessment.strength_of_evidence.documentary_evidence.description}
                    </p>
                  </div>
                )}

                {result.legal_assessment.strength_of_evidence.witness_support && (
                  <div style={{
                    background: "#f8f9fa",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "12px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px" }}>
                      <p style={{ fontWeight: "600", color: "#333", margin: 0, fontSize: "13px" }}>
                        👥 Witness Support
                      </p>
                      <span style={{
                        background: result.legal_assessment.strength_of_evidence.witness_support.rating === "Strong"
                          ? "#27ae60"
                          : result.legal_assessment.strength_of_evidence.witness_support.rating === "Moderate"
                            ? "#f39c12"
                            : "#e74c3c",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}>
                        {result.legal_assessment.strength_of_evidence.witness_support.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      {result.legal_assessment.strength_of_evidence.witness_support.description}
                    </p>
                  </div>
                )}

                {result.legal_assessment.strength_of_evidence.expert_reports && (
                  <div style={{
                    background: "#f8f9fa",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "12px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px" }}>
                      <p style={{ fontWeight: "600", color: "#333", margin: 0, fontSize: "13px" }}>
                        🔬 Expert Reports
                      </p>
                      <span style={{
                        background: result.legal_assessment.strength_of_evidence.expert_reports.rating === "Strong"
                          ? "#27ae60"
                          : result.legal_assessment.strength_of_evidence.expert_reports.rating === "Moderate"
                            ? "#f39c12"
                            : "#e74c3c",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}>
                        {result.legal_assessment.strength_of_evidence.expert_reports.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      {result.legal_assessment.strength_of_evidence.expert_reports.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Governing Law Section */}
          {result.legal_assessment.governing_law && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>⚖️</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Governing Law</h4>
              </div>
              {result.legal_assessment.governing_law.provisions && (
                <div>
                  {(result.legal_assessment.governing_law.provisions as Array<{ provision: string; description: string }>).map((prov, idx) => (
                    <div key={idx} style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      padding: "10px",
                      marginBottom: "8px",
                    }}>
                      <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "13px" }}>
                        {prov.provision}
                      </p>
                      <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>📚</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Supporting Legal Authority</h4>
              </div>

              {/* Defenses */}
              {result.legal_assessment.supporting_authority.defenses &&
                result.legal_assessment.supporting_authority.defenses.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontWeight: "600", color: "#333", margin: "0 0 8px 0", fontSize: "13px" }}>
                      {isCriminalCase ? "Potential Defenses:" : "Defendant Defenses:"}
                    </p>
                    <div style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      padding: "10px",
                    }}>
                      {(result.legal_assessment.supporting_authority.defenses as string[])
                        .slice(0, expandedDefenses ? undefined : 5)
                        .map((defense, idx) => {
                          const { preview, full, isLong } = truncateWords(defense, 25);
                          return (
                            <div key={idx}>
                              <p style={{ fontSize: "12px", color: "#555", margin: "6px 0" }}>
                                • {preview}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    {(result.legal_assessment.supporting_authority.defenses as string[]).length > 5 && (
                      <button
                        onClick={() => setExpandedDefenses(!expandedDefenses)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3498db",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "4px 0",
                          marginTop: "6px",
                          textDecoration: "none",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {expandedDefenses ? "Show Less ▲" : `Show More ▼`}
                      </button>
                    )}
                  </div>
                )}

              {/* Procedural Rights */}
              {result.legal_assessment.supporting_authority.procedural_rights &&
                result.legal_assessment.supporting_authority.procedural_rights.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontWeight: "600", color: "#333", margin: "0 0 8px 0", fontSize: "13px" }}>
                      Procedural Rights:
                    </p>
                    <div style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      padding: "10px",
                    }}>
                      {(result.legal_assessment.supporting_authority.procedural_rights as string[])
                        .slice(0, expandedProcedural ? undefined : 5)
                        .map((right, idx) => {
                          const { preview } = truncateWords(right, 25);
                          return (
                            <p key={idx} style={{ fontSize: "12px", color: "#555", margin: "6px 0" }}>
                              • {preview}
                            </p>
                          );
                        })}
                    </div>
                    {(result.legal_assessment.supporting_authority.procedural_rights as string[]).length > 5 && (
                      <button
                        onClick={() => setExpandedProcedural(!expandedProcedural)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3498db",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "4px 0",
                          marginTop: "6px",
                          textDecoration: "none",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {expandedProcedural ? "Show Less ▲" : `Show More ▼`}
                      </button>
                    )}
                  </div>
                )}

              {/* Primary Statutes */}
              {result.legal_assessment.supporting_authority.primary_statutes &&
                result.legal_assessment.supporting_authority.primary_statutes.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontWeight: "600", color: "#333", margin: "0 0 8px 0", fontSize: "13px" }}>
                      Primary Statutes:
                    </p>
                    <div style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      padding: "10px",
                    }}>
                      {(result.legal_assessment.supporting_authority.primary_statutes as string[])
                        .slice(0, expandedStatutes ? undefined : 5)
                        .map((statute, idx) => {
                          const { preview } = truncateWords(statute, 25);
                          return (
                            <p key={idx} style={{ fontSize: "12px", color: "#555", margin: "6px 0" }}>
                              • {preview}
                            </p>
                          );
                        })}
                    </div>
                    {(result.legal_assessment.supporting_authority.primary_statutes as string[]).length > 5 && (
                      <button
                        onClick={() => setExpandedStatutes(!expandedStatutes)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3498db",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "4px 0",
                          marginTop: "6px",
                          textDecoration: "none",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {expandedStatutes ? "Show Less ▲" : `Show More ▼`}
                      </button>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* Strategic Recommendations */}
      {result.strategic_recommendations && result.strategic_recommendations.length > 0 && (
        <div style={{
          background: "white",
          border: "1px solid #e8e8e8",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>💡</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Strategic Recommendations
            </h3>
          </div>

          {result.strategic_recommendations
            .slice(0, expandedRecommendations ? undefined : 5)
            .map((rec, idx) => {
              if (typeof rec === "object" && rec.title) {
                const getPriorityColor = (priority: string) => {
                  if (priority === "Critical" || priority === "High") return "#e74c3c";
                  if (priority === "Moderate" || priority === "Medium") return "#f39c12";
                  return "#3498db";
                };

                return (
                  <div key={idx} style={{
                    background: "#f8f9fa",
                    border: `2px solid ${getPriorityColor(rec.priority)}`,
                    borderLeft: `4px solid ${getPriorityColor(rec.priority)}`,
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "14px" }}>
                          {rec.title}
                        </p>
                        {rec.impact && (
                          <p style={{ fontSize: "12px", color: "#27ae60", fontWeight: "bold", margin: "4px 0 0 0" }}>
                            ↑ Impact: {rec.impact}
                          </p>
                        )}
                      </div>
                      <span style={{
                        background: getPriorityColor(rec.priority),
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginLeft: "12px",
                      }}>
                        {rec.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                      {rec.description}
                    </p>
                    {rec.category && (
                      <p style={{ fontSize: "11px", color: "#999", margin: "8px 0 0 0" }}>
                        Category: <strong>{rec.category}</strong>
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          {result.strategic_recommendations.length > 5 && (
            <button
              onClick={() => setExpandedRecommendations(!expandedRecommendations)}
              style={{
                background: "none",
                border: "none",
                color: "#3498db",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "8px 0",
                marginTop: "12px",
                textDecoration: "none",
                width: "100%",
                textAlign: "center",
              }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              {expandedRecommendations ? "Show Less ▲" : `Show More ▼ (${result.strategic_recommendations.length - 5} more)`}
            </button>
          )}
        </div>
      )}

      {/* Precedent Cases with Links */}
      {result.precedent_cases && result.precedent_cases.length > 0 && (
        <div style={{
          background: "white",
          border: "1px solid #e8e8e8",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>📖</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Supporting Precedent Cases ({result.precedent_cases.length})
            </h3>
          </div>

          {result.precedent_cases.map((precedent, idx) => {
            const getSimilarityColor = (score: number) => {
              if (score > 0.85) return "#27ae60";
              if (score > 0.75) return "#f39c12";
              return "#e74c3c";
            };

            return (
              <div key={idx} style={{
                background: "#f8f9fa",
                border: "1px solid #e0e0e0",
                borderLeft: `4px solid ${getSimilarityColor(precedent.similarity_score)}`,
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                  <div>
                    <p style={{ fontWeight: "600", color: "#2c5aa0", margin: "0 0 4px 0", fontSize: "14px" }}>
                      {precedent.case_name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      {precedent.citation}
                    </p>
                  </div>
                  <span style={{
                    background: getSimilarityColor(precedent.similarity_score),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}>
                    {Math.round(precedent.similarity_score * 100)}% Similar
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", marginTop: "8px" }}>
                  {precedent.year && (
                    <span style={{
                      background: "#e8f4f8",
                      color: "#0c5460",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                    }}>
                      {precedent.year}
                    </span>
                  )}
                  {precedent.outcome && (
                    <span style={{
                      background: "#fff3cd",
                      color: "#856404",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                    }}>
                      {precedent.outcome}
                    </span>
                  )}
                  {precedent.source_name && (
                    <span style={{
                      background: "#f0f0f0",
                      color: "#333",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                    }}>
                      Source: {precedent.source_name}
                    </span>
                  )}
                </div>

                {precedent.holding && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "12px" }}>
                      Holding:
                    </p>
                    <p style={{ fontSize: "12px", color: "#555", margin: 0, fontStyle: "italic" }}>
                      "{precedent.holding}"
                    </p>
                  </div>
                )}

                <p style={{ fontSize: "12px", color: "#666", margin: "0 0 12px 0" }}>
                  {precedent.summary}
                </p>

                {precedent.source_url && (
                  <a
                    href={precedent.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#3498db",
                      color: "white",
                      textDecoration: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#2980b9")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#3498db")}
                  >
                    📖 Read Full Case
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Executive Summary */}
      {result.executive_summary && (
        <div style={{
          background: "#fffbf5",
          border: "1px solid #ffe0b2",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>📋</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Executive Summary
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {result.executive_summary.charges && (
              <div style={{
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "12px",
              }}>
                <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "12px" }}>
                  {isCriminalCase ? "Charges:" : "Claims:"}
                </p>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  {result.executive_summary.charges}
                </p>
              </div>
            )}
            {result.executive_summary.strength_rating && (
              <div style={{
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "12px",
              }}>
                <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "12px" }}>
                  Strength Rating:
                </p>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  {result.executive_summary.strength_rating}
                </p>
              </div>
            )}
          </div>

          {result.executive_summary.case_overview && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 6px 0", fontSize: "13px" }}>
                Case Overview:
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
                {result.executive_summary.case_overview}
              </p>
            </div>
          )}

          {result.executive_summary.evidence_summary && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 6px 0", fontSize: "13px" }}>
                Evidence Summary:
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
                {result.executive_summary.evidence_summary}
              </p>
            </div>
          )}

          {result.executive_summary.strength_assessment && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 6px 0", fontSize: "13px" }}>
                Strength Assessment:
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
                {result.executive_summary.strength_assessment}
              </p>
            </div>
          )}

          {result.executive_summary.primary_recommendation && (
            <div style={{
              background: "white",
              border: `2px solid #f39c12`,
              borderRadius: "8px",
              padding: "12px",
              marginTop: "12px",
            }}>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 6px 0", fontSize: "13px" }}>
                Primary Recommendation:
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
                {result.executive_summary.primary_recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
