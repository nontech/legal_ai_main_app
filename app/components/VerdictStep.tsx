"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function VerdictStep({ caseId }: { caseId?: string } = {}) {
  const t = useTranslations("caseAnalysis.verdict");
  const searchParams = useSearchParams();
  // Use prop caseId if provided, otherwise fall back to searchParams for backward compatibility
  const effectiveCaseId = caseId || searchParams.get("caseId");

  const [caseInfo, setCaseInfo] = useState<any>(null);
  const [verdicts, setVerdicts] = useState<Record<string, string>>({});
  const [isSavingVerdicts, setIsSavingVerdicts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFacts, setExpandedFacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCaseData = async () => {
      if (!effectiveCaseId) {
        setError("No case ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/cases/${effectiveCaseId}`);
        const data = await response.json();

        if (!data.ok || !data.data) {
          setError("Failed to load case data");
          setLoading(false);
          return;
        }

        setCaseInfo(data.data);

        // Initialize verdicts from database or from charges
        if (data.data.verdict && typeof data.data.verdict === "object") {
          setVerdicts(data.data.verdict);
        } else if (data.data.charges && Array.isArray(data.data.charges)) {
          // Initialize with pending status for all charges
          const initialVerdicts: Record<string, string> = {};
          data.data.charges.forEach((charge: any) => {
            initialVerdicts[charge.id] = "pending";
          });
          setVerdicts(initialVerdicts);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch case data:", err);
        setError("Failed to load case data");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [effectiveCaseId]);

  const handleVerdictChange = (chargeId: string, verdict: string) => {
    setVerdicts((prev) => ({
      ...prev,
      [chargeId]: verdict,
    }));
  };

  const handleSaveVerdicts = async () => {
    if (!effectiveCaseId) return;

    setIsSavingVerdicts(true);
    try {
      const response = await fetch("/api/cases/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: effectiveCaseId,
          field: "verdict",
          value: verdicts,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to save verdicts");
      }

      alert(t("saved"));
    } catch (error) {
      console.error("Failed to save verdicts:", error);
      alert(t("failed"));
    } finally {
      setIsSavingVerdicts(false);
    }
  };

  const isCriminalCase = caseInfo?.case_type === "criminal";

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">{error}</h3>
      </div>
    );
  }

  if (!caseInfo?.charges || !Array.isArray(caseInfo.charges) || caseInfo.charges.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">{t("noCharges")}</h3>
        <p className="text-blue-700">{isCriminalCase ? "This case does not have any charges to set verdicts for." : "This case does not have any claims to set verdicts for."}</p>
      </div>
    );
  }

  const getVerdictColor = (status: string) => {
    if (status === "guilty" || status === "liable") return "#e74c3c";
    if (status === "not_guilty" || status === "non_liable") return "#27ae60";
    return "#95a5a6";
  };

  const getVerdictLabel = (status: string) => {
    if (status === "guilty") return t("status.guilty");
    if (status === "liable") return t("status.liable");
    if (status === "not_guilty") return t("status.notGuilty");
    if (status === "non_liable") return t("status.nonLiable");
    return t("status.pending");
  };

  const getPleaLabel = (plea: string) => {
    if (plea === "guilty") return t("status.guilty");
    if (plea === "liable") return t("status.liable");
    if (plea === "not-guilty") return t("status.notGuilty");
    if (plea === "non-liable" || plea === "non_liable") return t("status.nonLiable");
    if (plea === "nolo") return t("status.noloContendere");
    return t("status.notEntered");
  };

  const getPleaColor = (plea: string) => {
    if (plea === "guilty" || plea === "liable") return "#e74c3c";
    if (plea === "nolo") return "#f39c12";
    if (plea === "not-guilty" || plea === "non-liable" || plea === "non_liable") return "#27ae60";
    return "#95a5a6";
  };

  const toggleExpandedFacts = (chargeId: string) => {
    const newExpanded = new Set(expandedFacts);
    if (newExpanded.has(chargeId)) {
      newExpanded.delete(chargeId);
    } else {
      newExpanded.add(chargeId);
    }
    setExpandedFacts(newExpanded);
  };

  const isFactsLong = (text: string): boolean => {
    return !!(text && text.length > 200);
  };

  const displayFacts = (text: string, chargeId: string): string => {
    if (!isFactsLong(text)) {
      return text;
    }
    const isExpanded = expandedFacts.has(chargeId);
    return isExpanded ? text : text.substring(0, 200) + "...";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8 px-3 sm:px-0">
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">⚖️ {t("title")}</h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-medium">
          {t("description")}
        </p>
      </div>

      {/* Verdict Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {caseInfo.charges.map((charge: any, index: number) => {
          const chargeId = charge.id;
          const currentVerdict = verdicts[chargeId] || "pending";

          return (
            <div
              key={chargeId}
              style={{
                background: "white",
                border: "2px solid #e8e8e8",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Charge Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "16px 20px",
                  borderBottom: "2px solid rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ fontSize: "14px", fontWeight: "600", margin: 0, marginBottom: "4px" }}>
                  {isCriminalCase ? t("charge") : t("claim")} {index + 1}
                </h3>
                <p style={{ fontSize: "13px", margin: 0, opacity: 0.95, lineHeight: "1.4", marginBottom: "8px" }}>
                  {charge.chargeDescription || charge.description || charge.charge_name || charge.name || `${isCriminalCase ? t("charge") : t("claim")} ${index + 1}`}
                </p>
                {charge.statuteNumber && (
                  <p style={{ fontSize: "11px", margin: 0, opacity: 0.85, lineHeight: "1.3" }}>
                    <strong>{t("statute")}:</strong> {charge.statuteNumber}
                  </p>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                {/* Essential Facts Section */}
                {charge.essentialFacts && (
                  <div
                    style={{
                      background: "#f0f4ff",
                      border: "1px solid #d4ddf0",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      marginBottom: "16px",
                    }}
                  >
                    <p style={{ fontSize: "11px", color: "#555", fontWeight: "600", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                      {t("essentialFacts")}:
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#444",
                        margin: 0,
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {displayFacts(charge.essentialFacts, chargeId)}
                    </p>
                    {isFactsLong(charge.essentialFacts) && (
                      <button
                        onClick={() => toggleExpandedFacts(chargeId)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#667eea",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "6px 0",
                          marginTop: "6px",
                          transition: "color 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#764ba2";
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#667eea";
                        }}
                      >
                        {expandedFacts.has(chargeId) ? `${t("showLess")} ▲` : `${t("showMore")} ▼`}
                      </button>
                    )}
                  </div>
                )}

                {/* Three-Column Layout: Plea, Status, Verdict */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  {/* Defendant Plea Section */}
                  <div
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "12px",
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "11px", color: "#666", fontWeight: "600", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {isCriminalCase ? t("defendantPlea") : t("defendantClaim")}
                    </p>
                    {charge.defendantPlea ? (
                      <span
                        style={{
                          display: "inline-block",
                          background: getPleaColor(charge.defendantPlea),
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {getPleaLabel(charge.defendantPlea)}
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#999" }}>{t("status.notEntered")}</span>
                    )}
                  </div>

                  {/* Current Status */}
                  <div
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "12px",
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "11px", color: "#666", fontWeight: "600", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {t("currentStatus")}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        background: getVerdictColor(currentVerdict),
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {getVerdictLabel(currentVerdict)}
                    </span>
                  </div>

                  {/* Court's Verdict Arrow */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    →
                  </div>
                </div>

                {/* Verdict Selection */}
                <div>
                  <p style={{ fontSize: "11px", color: "#666", fontWeight: "600", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {t("setVerdict")}:
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "8px" }}>
                    {/* Pending Button */}
                    <button
                      onClick={() => handleVerdictChange(chargeId, "pending")}
                      style={{
                        background: currentVerdict === "pending" ? "#95a5a6" : "#f0f0f0",
                        color: currentVerdict === "pending" ? "white" : "#333",
                        border: `2px solid ${currentVerdict === "pending" ? "#95a5a6" : "#ddd"}`,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        if (currentVerdict !== "pending") {
                          (e.currentTarget as HTMLElement).style.background = "#e8eaed";
                          (e.currentTarget as HTMLElement).style.borderColor = "#95a5a6";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentVerdict !== "pending") {
                          (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                          (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                        }
                      }}
                    >
                      {t("status.pending")}
                    </button>

                    {isCriminalCase ? (
                      <>
                        {/* Guilty Button */}
                        <button
                          onClick={() => handleVerdictChange(chargeId, "guilty")}
                          style={{
                            background: currentVerdict === "guilty" ? "#e74c3c" : "#f0f0f0",
                            color: currentVerdict === "guilty" ? "white" : "#333",
                            border: `2px solid ${currentVerdict === "guilty" ? "#e74c3c" : "#ddd"}`,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            if (currentVerdict !== "guilty") {
                              (e.currentTarget as HTMLElement).style.background = "#ffe6e6";
                              (e.currentTarget as HTMLElement).style.borderColor = "#e74c3c";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (currentVerdict !== "guilty") {
                              (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                              (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                            }
                          }}
                        >
                          {t("status.guilty")}
                        </button>
                        {/* Not Guilty Button */}
                        <button
                          onClick={() => handleVerdictChange(chargeId, "not_guilty")}
                          style={{
                            background: currentVerdict === "not_guilty" ? "#27ae60" : "#f0f0f0",
                            color: currentVerdict === "not_guilty" ? "white" : "#333",
                            border: `2px solid ${currentVerdict === "not_guilty" ? "#27ae60" : "#ddd"}`,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            if (currentVerdict !== "not_guilty") {
                              (e.currentTarget as HTMLElement).style.background = "#e6f7f0";
                              (e.currentTarget as HTMLElement).style.borderColor = "#27ae60";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (currentVerdict !== "not_guilty") {
                              (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                              (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                            }
                          }}
                        >
                          {t("status.notGuilty")}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Liable Button */}
                        <button
                          onClick={() => handleVerdictChange(chargeId, "liable")}
                          style={{
                            background: currentVerdict === "liable" ? "#e74c3c" : "#f0f0f0",
                            color: currentVerdict === "liable" ? "white" : "#333",
                            border: `2px solid ${currentVerdict === "liable" ? "#e74c3c" : "#ddd"}`,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            if (currentVerdict !== "liable") {
                              (e.currentTarget as HTMLElement).style.background = "#ffe6e6";
                              (e.currentTarget as HTMLElement).style.borderColor = "#e74c3c";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (currentVerdict !== "liable") {
                              (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                              (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                            }
                          }}
                        >
                          {t("status.liable")}
                        </button>
                        {/* Non-Liable Button */}
                        <button
                          onClick={() => handleVerdictChange(chargeId, "non_liable")}
                          style={{
                            background: currentVerdict === "non_liable" ? "#27ae60" : "#f0f0f0",
                            color: currentVerdict === "non_liable" ? "white" : "#333",
                            border: `2px solid ${currentVerdict === "non_liable" ? "#27ae60" : "#ddd"}`,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            if (currentVerdict !== "non_liable") {
                              (e.currentTarget as HTMLElement).style.background = "#e6f7f0";
                              (e.currentTarget as HTMLElement).style.borderColor = "#27ae60";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (currentVerdict !== "non_liable") {
                              (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                              (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                            }
                          }}
                        >
                          {t("status.nonLiable")}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
        <button
          onClick={handleSaveVerdicts}
          disabled={isSavingVerdicts}
          style={{
            background: isSavingVerdicts ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "14px 40px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: isSavingVerdicts ? "not-allowed" : "pointer",
            boxShadow: isSavingVerdicts ? "none" : "0 4px 14px rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s ease",
            opacity: isSavingVerdicts ? 0.7 : 1,
          }}
          onMouseOver={(e) => {
            if (!isSavingVerdicts) {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseOut={(e) => {
            if (!isSavingVerdicts) {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(102, 126, 234, 0.4)";
            }
          }}
        >
          {isSavingVerdicts ? t("saving") : t("saveButton")}
        </button>
      </div>
    </div>
  );
}
