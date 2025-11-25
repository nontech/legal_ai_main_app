"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerdictStep() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [caseInfo, setCaseInfo] = useState<any>(null);
  const [verdicts, setVerdicts] = useState<Record<string, string>>({});
  const [isSavingVerdicts, setIsSavingVerdicts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseData = async () => {
      if (!caseId) {
        setError("No case ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/cases/${caseId}`);
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
  }, [caseId]);

  const handleVerdictChange = (chargeId: string, verdict: string) => {
    setVerdicts((prev) => ({
      ...prev,
      [chargeId]: verdict,
    }));
  };

  const handleSaveVerdicts = async () => {
    if (!caseId) return;

    setIsSavingVerdicts(true);
    try {
      const response = await fetch("/api/cases/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          field: "verdict",
          value: verdicts,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to save verdicts");
      }

      alert("Verdicts saved successfully!");
    } catch (error) {
      console.error("Failed to save verdicts:", error);
      alert("Failed to save verdicts. Please try again.");
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
          <p className="text-gray-600">Loading verdict step...</p>
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
        <h3 className="text-lg font-semibold text-blue-900 mb-2">No Charges Available</h3>
        <p className="text-blue-700">This case does not have any charges to set verdicts for.</p>
      </div>
    );
  }

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
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">⚖️ Verdict</h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-medium">
          Review the {isCriminalCase ? "charges" : "claims"} and enter the verdict for each decided by the court.
        </p>
      </div>

      {/* Verdict Section */}
      <div
        style={{
          background: "white",
          border: "1px solid #e8e8e8",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "24px" }}>
          {caseInfo.charges.map((charge: any) => {
            const chargeId = charge.id;
            const currentVerdict = verdicts[chargeId] || "pending";

            const getVerdictColor = (status: string) => {
              if (status === "guilty" || status === "liable") return "#e74c3c";
              if (status === "not_guilty" || status === "non_liable") return "#27ae60";
              return "#95a5a6";
            };

            const getVerdictLabel = (status: string) => {
              if (status === "guilty") return "Guilty";
              if (status === "liable") return "Liable";
              if (status === "not_guilty") return "Not Guilty";
              if (status === "non_liable") return "Non-Liable";
              return "Pending";
            };

            return (
              <div
                key={chargeId}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", color: "#666", margin: 0, lineHeight: "1.5" }}>
                      {charge.chargeDescription || charge.description || charge.charge_name || charge.name || `Charge ${charge.id}`}
                    </p>
                  </div>

                  {/* Verdict Badge */}
                  <span
                    style={{
                      background: getVerdictColor(currentVerdict),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      minWidth: "90px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getVerdictLabel(currentVerdict)}
                  </span>
                </div>

                {/* Verdict Buttons */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleVerdictChange(chargeId, "pending")}
                    style={{
                      background: currentVerdict === "pending" ? "#95a5a6" : "#f0f0f0",
                      color: currentVerdict === "pending" ? "white" : "#333",
                      border: "1px solid #ddd",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      if (currentVerdict !== "pending") {
                        (e.currentTarget as HTMLElement).style.background = "#e8eaed";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentVerdict !== "pending") {
                        (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                      }
                    }}
                  >
                    Pending
                  </button>

                  {isCriminalCase ? (
                    <>
                      <button
                        onClick={() => handleVerdictChange(chargeId, "guilty")}
                        style={{
                          background: currentVerdict === "guilty" ? "#e74c3c" : "#f0f0f0",
                          color: currentVerdict === "guilty" ? "white" : "#333",
                          border: "1px solid #ddd",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (currentVerdict !== "guilty") {
                            (e.currentTarget as HTMLElement).style.background = "#ffe6e6";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentVerdict !== "guilty") {
                            (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                          }
                        }}
                      >
                        Guilty
                      </button>
                      <button
                        onClick={() => handleVerdictChange(chargeId, "not_guilty")}
                        style={{
                          background: currentVerdict === "not_guilty" ? "#27ae60" : "#f0f0f0",
                          color: currentVerdict === "not_guilty" ? "white" : "#333",
                          border: "1px solid #ddd",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (currentVerdict !== "not_guilty") {
                            (e.currentTarget as HTMLElement).style.background = "#e6f7f0";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentVerdict !== "not_guilty") {
                            (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                          }
                        }}
                      >
                        Not Guilty
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleVerdictChange(chargeId, "liable")}
                        style={{
                          background: currentVerdict === "liable" ? "#e74c3c" : "#f0f0f0",
                          color: currentVerdict === "liable" ? "white" : "#333",
                          border: "1px solid #ddd",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (currentVerdict !== "liable") {
                            (e.currentTarget as HTMLElement).style.background = "#ffe6e6";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentVerdict !== "liable") {
                            (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                          }
                        }}
                      >
                        Liable
                      </button>
                      <button
                        onClick={() => handleVerdictChange(chargeId, "non_liable")}
                        style={{
                          background: currentVerdict === "non_liable" ? "#27ae60" : "#f0f0f0",
                          color: currentVerdict === "non_liable" ? "white" : "#333",
                          border: "1px solid #ddd",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (currentVerdict !== "non_liable") {
                            (e.currentTarget as HTMLElement).style.background = "#e6f7f0";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentVerdict !== "non_liable") {
                            (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                          }
                        }}
                      >
                        Non-Liable
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <button
            onClick={handleSaveVerdicts}
            disabled={isSavingVerdicts}
            style={{
              background: isSavingVerdicts ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isSavingVerdicts ? "not-allowed" : "pointer",
              boxShadow: isSavingVerdicts ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              opacity: isSavingVerdicts ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isSavingVerdicts) {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!isSavingVerdicts) {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {isSavingVerdicts ? "Saving..." : "💾 Save Verdicts"}
          </button>
        </div>
      </div>
    </div>
  );
}

