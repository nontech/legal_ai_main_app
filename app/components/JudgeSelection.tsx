"use client";

import { useState } from "react";
import SaveCaseButton from "./SaveCaseButton";
import { useEffect } from "react";

interface Judge {
  id: string;
  name: string;
  experience: number;
  background: string;
  leaningLabel: string;
  leaningColor: "yellow" | "green" | "red";
  temperament: string;
  temperamentDetails: string[];
  criminalCases: {
    conviction: number;
    dismissal: number;
    pleaDeals: number;
  };
  civilCases: {
    plaintiffWins: number;
    defendantWins: number;
  };
  notablePatterns: string[];
}

const DEFAULT_JUDGES: Judge[] = [
  {
    id: "1",
    name: "Judge Patricia Anderson",
    experience: 18,
    background:
      "Former Federal Prosecutor, Extensive Trial Experience",
    leaningLabel: "Moderate",
    leaningColor: "yellow",
    temperament: "Balanced, Professional, Fair-minded",
    temperamentDetails: ["Balanced", "Professional", "Fair-minded"],
    criminalCases: {
      conviction: 68,
      dismissal: 18,
      pleaDeals: 14,
    },
    civilCases: {
      plaintiffWins: 50,
      defendantWins: 50,
    },
    notablePatterns: [
      "Fair and impartial in most rulings",
      "Strong focus on evidentiary standards",
      "Respects both prosecution and defense rights",
    ],
  },
  {
    id: "2",
    name: "Judge David Rodriguez",
    experience: 12,
    background:
      "Former Criminal Defense Attorney, Constitutional Scholar",
    leaningLabel: "Pro-Defense",
    leaningColor: "green",
    temperament: "Thoughtful, Rights-focused, Deliberative",
    temperamentDetails: [
      "Thoughtful",
      "Rights-focused",
      "Deliberative",
    ],
    criminalCases: {
      conviction: 55,
      dismissal: 28,
      pleaDeals: 17,
    },
    civilCases: {
      plaintiffWins: 42,
      defendantWins: 58,
    },
    notablePatterns: [
      "Strong protector of constitutional rights",
      "Careful scrutiny of evidence",
      "Ensures fair trial procedures",
    ],
  },
  {
    id: "3",
    name: "Judge Sarah Mitchell",
    experience: 22,
    background: "Former District Attorney, Victim Rights Advocate",
    leaningLabel: "Pro-Prosecution",
    leaningColor: "red",
    temperament: "Strict, Efficient, Law-and-Order",
    temperamentDetails: ["Strict", "Efficient", "Law-and-Order"],
    criminalCases: {
      conviction: 75,
      dismissal: 12,
      pleaDeals: 13,
    },
    civilCases: {
      plaintiffWins: 55,
      defendantWins: 45,
    },
    notablePatterns: [
      "Tends to favor prosecution arguments",
      "Strict interpretation of criminal statutes",
      "Limited tolerance for procedural delays",
    ],
  },
];

export default function JudgeSelection({ caseId, onSaveSuccess, jurisdictionId }: { caseId?: string; onSaveSuccess?: () => void; jurisdictionId?: string }) {
  const [judges, setJudges] = useState<Judge[]>(DEFAULT_JUDGES);
  const [selectedJudge, setSelectedJudge] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingJudges, setIsFetchingJudges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch judges when jurisdiction changes
  useEffect(() => {
    if (!jurisdictionId) {
      setJudges(DEFAULT_JUDGES);
      return;
    }

    const fetchJudgesFromAPI = async () => {
      try {
        setIsFetchingJudges(true);
        const res = await fetch(`/api/admin/judges?jurisdiction_id=${jurisdictionId}`);
        const json = await res.json();

        if (json.ok && json.data && Array.isArray(json.data)) {
          // Transform API response to Judge format
          const apiJudges = json.data.map((judgeInfo: any, index: number) => ({
            id: judgeInfo.id || `judge-${index}`,
            name: judgeInfo.name || "",
            experience: judgeInfo.experience || 0,
            background: judgeInfo.background || "",
            leaningLabel: judgeInfo.leaningLabel || judgeInfo.leaning_label || "Moderate",
            leaningColor: judgeInfo.leaningColor || judgeInfo.leaning_color || "yellow",
            temperament: judgeInfo.temperament || "",
            temperamentDetails: judgeInfo.temperamentDetails || judgeInfo.temperament_details || [],
            criminalCases: judgeInfo.criminalCases || judgeInfo.criminal_cases || { conviction: 0, dismissal: 0, pleaDeals: 0 },
            civilCases: judgeInfo.civilCases || judgeInfo.civil_cases || { plaintiffWins: 0, defendantWins: 0 },
            notablePatterns: judgeInfo.notablePatterns || judgeInfo.notable_patterns || [],
          }));
          setJudges(apiJudges);
        } else {
          setJudges(DEFAULT_JUDGES);
          setError(json.error || "Failed to fetch judges");
        }
      } catch (err) {
        console.error("Failed to fetch judges:", err);
        setJudges(DEFAULT_JUDGES);
        setError("Failed to fetch judges");
      } finally {
        setIsFetchingJudges(false);
      }
    };

    fetchJudgesFromAPI();
  }, [jurisdictionId]);

  useEffect(() => {
    const loadSavedJudge = async () => {
      if (caseId) {
        try {
          const response = await fetch(`/api/cases/${caseId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const json = await response.json();
          if (json.ok && json.data?.judge) {
            setSelectedJudge(json.data.judge);
          } else {
            setSelectedJudge(null);
          }
        } catch (error) {
          console.error("Failed to load saved judge:", error);
          setSelectedJudge(null);
        }
      }
    };

    loadSavedJudge();
  }, [caseId]);

  const getLeaningStyles = (color: "yellow" | "green" | "red") => {
    switch (color) {
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "green":
        return "bg-green-100 text-green-800 border-green-300";
      case "red":
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  const getLeaningIcon = (color: "yellow" | "green" | "red") => {
    switch (color) {
      case "yellow":
        return "—";
      case "green":
        return "↘";
      case "red":
        return "↗";
    }
  };

  const handleJudgeSelect = (judgeId: string) => {
    setSelectedJudge(judgeId);
    setIsModalOpen(false);
  };

  const selectedJudgeData = judges.find(
    (j) => j.id === selectedJudge
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-4 sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-ink-900 mb-2 sm:mb-4">
              Judge Selection
            </h2>
            <p className="text-sm sm:text-lg text-ink-600 max-w-4xl mx-auto">
              Select the presiding judge. Their judicial history,
              temperament, and ruling patterns will significantly
              influence the case analysis and outcome predictions.
            </p>
          </div>
        </div>

        {/* Summary Card */}
        {selectedJudge && (
          <div className="bg-highlight-200 rounded-lg border border-transparent p-3 sm:p-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-highlight-600 flex-shrink-0 mt-0.5 sm:mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-bold text-ink-900 mb-1 sm:mb-2 text-sm sm:text-base">
                  Judge Selection Confirmed
                </h4>
                <p className="text-ink-600 text-xs sm:text-sm">
                  You have selected{" "}
                  <span className="font-semibold">
                    {selectedJudgeData?.name}
                  </span>{" "}
                  as the presiding judge. This selection will
                  influence case strategy recommendations, risk
                  assessments, and outcome predictions throughout the
                  analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compact Display with Button */}
        <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-4 sm:p-8">
          {!selectedJudgeData ? (
            /* Empty State */
            <div className="text-center py-6 sm:py-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 sm:mb-2">
                No Judge Selected
              </h3>
              <p className="text-ink-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                Select a judge to analyze their judicial history, temperament, and ruling patterns for your case.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm text-sm sm:text-base"
              >
                Select a Judge
              </button>
            </div>
          ) : (
            /* Selected Judge Display */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex-shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-ink-900">
                    Presiding Judge
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600 truncate">
                    {selectedJudgeData.name}
                  </p>
                </div>
              </div>

              {/* Centered Judge Name - Hidden on mobile */}
              <div className="hidden sm:flex flex-1 justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold text-ink-900">
                    {selectedJudgeData.name}
                  </p>
                  <p className="text-sm text-ink-600">
                    {selectedJudgeData.experience} years experience
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap shadow-sm"
              >
                Change Judge
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 pt-4 pb-20">
            <div
              className="fixed inset-0 bg-primary-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative inline-block w-full max-w-6xl my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-surface-050 shadow-2xl rounded-lg sm:rounded-2xl">
              <div className="flex flex-col max-h-[80vh]">
                <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                      Select Judge
                    </h2>
                    <p className="text-primary-100 text-xs sm:text-sm hidden sm:block">
                      Choose the judge who will preside over your case
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-surface-200 transition-colors rounded-full p-2 flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Judge Cards in Modal */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-surface-000">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  {judges.map((judge) => (
                    <div
                      key={judge.id}
                      onClick={() => handleJudgeSelect(judge.id)}
                      className={`bg-surface-000 rounded-xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-lg ${selectedJudge === judge.id
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-border-200 hover:border-primary-300"
                        }`}
                    >
                      <div className="p-3 sm:p-6">
                        {/* Judge Header */}
                        <div className="flex items-start justify-between mb-3 sm:mb-6 gap-2">
                          <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 sm:w-8 sm:h-8 text-primary-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base sm:text-2xl font-bold text-ink-900 truncate">
                                {judge.name}
                              </h3>
                              <p className="text-ink-600 mt-1 text-xs sm:text-sm truncate hidden sm:block">
                                {judge.experience} years experience • {judge.background}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 flex-shrink-0 ${getLeaningStyles(
                              judge.leaningColor
                            )}`}
                          >
                            <span className="text-sm sm:text-lg">
                              {getLeaningIcon(judge.leaningColor)}
                            </span>
                            <span className="hidden sm:inline">{judge.leaningLabel}</span>
                          </div>
                        </div>

                        {/* Three Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 hidden sm:grid">
                      {/* Historical Ruling Patterns */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-ink-900 text-lg">
                          Historical Ruling Patterns
                        </h4>

                        <div>
                          <p className="font-semibold text-ink-800 mb-2">
                            Criminal Cases:
                          </p>
                          <div className="space-y-1 text-sm">
                            <p className="text-ink-600">
                              Conviction:{" "}
                              {judge.criminalCases.conviction}%
                            </p>
                            <p className="text-ink-600">
                              Dismissal:{" "}
                              {judge.criminalCases.dismissal}%
                            </p>
                            <p className="text-ink-600">
                              Plea Deals:{" "}
                              {judge.criminalCases.pleaDeals}%
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold text-ink-800 mb-2">
                            Civil Cases:
                          </p>
                          <div className="space-y-1 text-sm">
                            <p className="text-ink-600">
                              Plaintiff Wins:{" "}
                              {judge.civilCases.plaintiffWins}%
                            </p>
                            <p className="text-ink-600">
                              Defendant Wins:{" "}
                              {judge.civilCases.defendantWins}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Notable Decision Patterns */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-ink-900 text-lg">
                          Notable Decision Patterns
                        </h4>
                        <ul className="space-y-2">
                          {judge.notablePatterns.map(
                            (pattern, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-ink-600"
                              >
                                <span className="text-primary-500 mt-0.5">
                                  •
                                </span>
                                <span>{pattern}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Judicial Temperament */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-ink-900 text-lg">
                          Judicial Temperament
                        </h4>
                        <p className="text-ink-600 text-sm">
                          {judge.temperament}
                        </p>
                        <div className="pt-2">
                          <div className="inline-block bg-surface-100 px-4 py-2 rounded-lg">
                            <p className="text-sm font-semibold text-ink-900">
                              {judge.experience} years experience
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
      <SaveCaseButton
        caseId={caseId}
        field="judge"
        value={selectedJudge}
        onSave={onSaveSuccess}
      />
    </>
  );
}
