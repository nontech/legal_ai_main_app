"use client";

import { useState } from "react";

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

const judges: Judge[] = [
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

export default function JudgeSelection() {
  const [selectedJudge, setSelectedJudge] = useState<string | null>(
    null
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Judge Selection
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Select the presiding judge. Their judicial history,
            temperament, and ruling patterns will significantly
            influence the case analysis and outcome predictions.
          </p>
        </div>
      </div>

      {/* Judge Cards */}
      <div className="space-y-4">
        {judges.map((judge) => (
          <div
            key={judge.id}
            onClick={() => setSelectedJudge(judge.id)}
            className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-lg ${
              selectedJudge === judge.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="p-6">
              {/* Judge Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-700"
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
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {judge.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {judge.experience} years experience •{" "}
                      {judge.background}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm flex items-center gap-2 ${getLeaningStyles(
                    judge.leaningColor
                  )}`}
                >
                  <span className="text-lg">
                    {getLeaningIcon(judge.leaningColor)}
                  </span>
                  {judge.leaningLabel}
                </div>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Historical Ruling Patterns */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg">
                    Historical Ruling Patterns
                  </h4>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      Criminal Cases:
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        Conviction: {judge.criminalCases.conviction}%
                      </p>
                      <p className="text-gray-700">
                        Dismissal: {judge.criminalCases.dismissal}%
                      </p>
                      <p className="text-gray-700">
                        Plea Deals: {judge.criminalCases.pleaDeals}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      Civil Cases:
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        Plaintiff Wins:{" "}
                        {judge.civilCases.plaintiffWins}%
                      </p>
                      <p className="text-gray-700">
                        Defendant Wins:{" "}
                        {judge.civilCases.defendantWins}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notable Decision Patterns */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg">
                    Notable Decision Patterns
                  </h4>
                  <ul className="space-y-2">
                    {judge.notablePatterns.map((pattern, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-blue-600 mt-0.5">
                          •
                        </span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Judicial Temperament */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg">
                    Judicial Temperament
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {judge.temperament}
                  </p>
                  <div className="pt-2">
                    <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">
                        {judge.experience} years experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedJudge === judge.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-semibold">
                      Selected as Presiding Judge
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      {selectedJudge && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
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
              <h4 className="font-bold text-gray-900 mb-2">
                Judge Selection Confirmed
              </h4>
              <p className="text-gray-700 text-sm">
                You have selected{" "}
                <span className="font-semibold">
                  {judges.find((j) => j.id === selectedJudge)?.name}
                </span>{" "}
                as the presiding judge. This selection will influence
                case strategy recommendations, risk assessments, and
                outcome predictions throughout the analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
