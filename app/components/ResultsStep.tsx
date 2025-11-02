"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AnalysisResult {
  predicted_outcome?: any;
  executive_summary?: any;
  key_factors?: Record<string, any>;
  legal_assessment?: any;
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
    try {
      // Call the analyze API to regenerate results
      const analysisRes = await fetch("/api/cases/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });

      const analysisJson = await analysisRes.json();

      if (!analysisRes.ok || !analysisJson?.ok) {
        throw new Error(analysisJson?.error || "Failed to regenerate analysis");
      }

      // Fetch the updated results from database
      await fetchResults(false);
    } catch (err) {
      console.error("Failed to regenerate results:", err);
      alert(err instanceof Error ? err.message : "Failed to regenerate results");
    } finally {
      setIsRegenerating(false);
    }
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

  const successProb = result.predicted_outcome.win_probability
    ? Math.round(result.predicted_outcome.win_probability * 100)
    : 0;

  const liabilityProb = Math.round((1 - (result.legal_assessment?.guilt_probability || 0)) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Meta Info */}
      {caseInfo && (
        <div className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
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
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Case Analysis Results</h2>
        <p className="text-gray-600">Comprehensive analysis based on case details, judicial patterns, and legal precedents</p>
      </div>

      {/* Predicted Outcome Probability - Featured Section */}
      {result.predicted_outcome?.win_probability !== undefined && (
        <div style={{
          background: "linear-gradient(135deg, #fffbf0 0%, #fff9e6 100%)",
          border: "2px solid #ffd700",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "28px" }}>🎯</span>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Predicted Outcome Probability
            </h3>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <div style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#d4a500",
              margin: "10px 0",
            }}>
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
                {result.legal_assessment?.confidence_level
                  ? (Math.round(result.legal_assessment.confidence_level * 100) > 70 ? "High" : "Moderate")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>Analysis Depth</p>
              <p style={{ color: "#2c5aa0", fontWeight: "bold", fontSize: "16px", margin: 0 }}>Comprehensive</p>
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
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>⚖️</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Key Analysis Factors
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {Object.entries(result.key_factors).slice(0, 4).map(([key, value]) => {
              const getBadgeColor = (key: string) => {
                if (key.toLowerCase().includes("favorable")) return "#27ae60";
                if (key.toLowerCase().includes("moderate")) return "#f39c12";
                if (key.toLowerCase().includes("weak")) return "#e74c3c";
                return "#3498db";
              };

              const badgeText = typeof value === "string" ? value.split(":")[0] : String(value);

              return (
                <div key={key} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #f0f0f0",
                }}>
                  <div>
                    <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0" }}>{key}</p>
                    <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                      {typeof value === "string" ? value.substring(0, 60) : String(value)}
                    </p>
                  </div>
                  <span style={{
                    background: getBadgeColor(String(value)),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    marginLeft: "12px",
                  }}>
                    {badgeText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legal Liability Assessment */}
      {result.legal_assessment && (
        <div style={{
          background: "#fff5f5",
          border: "1px solid #ffcccc",
          borderRadius: "12px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>⚖️</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#c62828", margin: 0 }}>
              Legal Liability Assessment
            </h3>
          </div>

          {/* Liability Status */}
          {result.legal_assessment.guilt_probability !== undefined && (
            <div style={{
              background: liabilityProb > 50 ? "#e8f5e9" : "#ffebee",
              border: liabilityProb > 50 ? "2px solid #27ae60" : "2px solid #e74c3c",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "24px" }}>{liabilityProb > 50 ? "✅" : "⚠️"}</span>
                <h4 style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: liabilityProb > 50 ? "#1b5e20" : "#c62828",
                  margin: 0,
                }}>
                  {liabilityProb > 50 ? "Likely Not Guilty" : "Likely Guilty"}
                </h4>
              </div>
              <p style={{ color: liabilityProb > 50 ? "#2e7d32" : "#d32f2f", margin: "8px 0", fontSize: "13px" }}>
                <strong>Confidence Level:</strong> {result.legal_assessment?.confidence_level
                  ? (Math.round(result.legal_assessment.confidence_level * 100) > 70 ? "Moderate" : "Lower")
                  : "N/A"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                <div style={{ flex: 1, height: "8px", background: "#ccc", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${liabilityProb}%`,
                    background: liabilityProb > 50 ? "#27ae60" : "#e74c3c",
                  }}></div>
                </div>
                <span style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: liabilityProb > 50 ? "#27ae60" : "#e74c3c",
                  minWidth: "45px",
                  textAlign: "right",
                }}>
                  {liabilityProb}%
                </span>
              </div>
            </div>
          )}

          {/* Element Analysis */}
          {result.legal_assessment.elements_analysis && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "20px" }}>🔍</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Element Analysis</h4>
              </div>

              {["actus_reus", "mens_rea", "causation", "harm_damages"].map((prop) => {
                const elem = (result.legal_assessment.elements_analysis as any)?.[prop];
                if (!elem) return null;

                const prob = Math.round(elem.probability * 100);
                const getColor = (p: number) => {
                  if (p > 60) return { bg: "#ffebee", border: "#e74c3c", badge: "Likely" };
                  if (p > 40) return { bg: "#fff3cd", border: "#f39c12", badge: "Probable" };
                  return { bg: "#f8f9fa", border: "#95a5a6", badge: "Weak" };
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
                          {elem.label}
                        </p>
                        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                          {elem.description}
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
            </div>
          )}

          {/* Supporting Legal Authority */}
          {result.legal_assessment.supporting_authority && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>📚</span>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Supporting Legal Authority</h4>
              </div>

              {result.legal_assessment.supporting_authority.primary_statutes &&
                result.legal_assessment.supporting_authority.primary_statutes.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    {(result.legal_assessment.supporting_authority.primary_statutes as string[]).map((statute, idx) => (
                      <div key={idx} style={{ marginBottom: "8px" }}>
                        <p style={{ fontWeight: "600", color: "#333", margin: "0 0 2px 0", fontSize: "13px" }}>
                          {statute.split(" - ")[0]}
                        </p>
                        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                          <strong>Primary Statute</strong>
                        </p>
                        <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
                          {statute.split(" - ")[1] || statute}
                        </p>
                        <span style={{
                          display: "inline-block",
                          background: "#e8f5e9",
                          color: "#1b5e20",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          marginTop: "6px",
                        }}>
                          Direct Application
                        </span>
                      </div>
                    ))}
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
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>💡</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Strategic Recommendations
            </h3>
          </div>

          {result.strategic_recommendations.slice(0, 3).map((rec, idx) => {
            if (typeof rec === "object" && rec.title) {
              const getPriorityColor = (priority: string) => {
                if (priority === "Critical") return "#e74c3c";
                if (priority === "High") return "#f39c12";
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
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Precedent Cases with Links */}
      {result.precedent_cases && result.precedent_cases.length > 0 && (
        <div style={{
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>📖</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Supporting Precedent
            </h3>
          </div>

          {result.precedent_cases.slice(0, 2).map((precedent, idx) => (
            <div key={idx} style={{
              background: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderLeft: "4px solid #3498db",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
            }}>
              <p style={{ fontWeight: "600", color: "#2c5aa0", margin: "0 0 4px 0", fontSize: "14px" }}>
                {precedent.case_name}
              </p>
              <p style={{ fontSize: "12px", color: "#666", margin: "0 0 12px 0" }}>
                {precedent.citation}
              </p>

              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{
                  background: "#e8f4f8",
                  color: "#0c5460",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                }}>
                  Similarity: {Math.round(precedent.similarity_score * 100)}%
                </span>
                {precedent.year && (
                  <span style={{
                    background: "#f0f0f0",
                    color: "#333",
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
                    Outcome: {precedent.outcome}
                  </span>
                )}
              </div>

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
          ))}
        </div>
      )}

      {/* Executive Summary */}
      {result.executive_summary && (
        <div style={{
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>📋</span>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
              Executive Summary
            </h3>
          </div>

          {result.executive_summary.case_overview && (
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "13px" }}>
                Case Overview:
              </p>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                {result.executive_summary.case_overview}
              </p>
            </div>
          )}

          {result.executive_summary.strength_assessment && (
            <div>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "13px" }}>
                Strength Assessment:
              </p>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                {result.executive_summary.strength_assessment}
              </p>
            </div>
          )}

          {result.executive_summary.primary_recommendation && (
            <div style={{ marginTop: "12px" }}>
              <p style={{ fontWeight: "600", color: "#333", margin: "0 0 4px 0", fontSize: "13px" }}>
                Primary Recommendation:
              </p>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                {result.executive_summary.primary_recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
