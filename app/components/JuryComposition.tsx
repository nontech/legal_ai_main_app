"use client";

import { useState } from "react";

interface JuryCharacteristic {
  id: string;
  label: string;
  description: string;
}

export default function JuryComposition() {
  const [selectedDemographics, setSelectedDemographics] = useState<
    string[]
  >([]);
  const [selectedPsychological, setSelectedPsychological] = useState<
    string[]
  >([]);

  const demographics: JuryCharacteristic[] = [
    {
      id: "young-adults",
      label: "Young Adults (18-35)",
      description:
        "Generally more progressive, tech-savvy, less traditional",
    },
    {
      id: "middle-aged",
      label: "Middle-Aged (36-55)",
      description:
        "Balanced perspective, life experience, practical approach",
    },
    {
      id: "seniors",
      label: "Seniors (55+)",
      description:
        "Conservative tendencies, respect for authority, traditional values",
    },
    {
      id: "college-educated",
      label: "College-Educated",
      description:
        "Analytical thinking, complex reasoning, evidence-focused",
    },
    {
      id: "blue-collar",
      label: "Blue-Collar Workers",
      description:
        "Practical approach, common sense, skeptical of experts",
    },
    {
      id: "white-collar",
      label: "White-Collar Professionals",
      description:
        "Business-minded, process-oriented, detail-focused",
    },
    {
      id: "parents",
      label: "Parents with Children",
      description:
        "Protective instincts, emotional responses, safety-conscious",
    },
    {
      id: "urban",
      label: "Urban Residents",
      description:
        "Diverse perspectives, liberal tendencies, crime awareness",
    },
    {
      id: "suburban",
      label: "Suburban Residents",
      description:
        "Middle-class values, moderate views, family-oriented",
    },
    {
      id: "rural",
      label: "Rural Residents",
      description:
        "Conservative values, self-reliance, traditional approach",
    },
  ];

  const psychological: JuryCharacteristic[] = [
    {
      id: "analytical",
      label: "Analytical Thinkers",
      description:
        "Focus on evidence, logic, and detailed examination",
    },
    {
      id: "emotional",
      label: "Emotionally-Driven",
      description:
        "Respond to narratives, victim impact, personal stories",
    },
    {
      id: "authority-respecting",
      label: "Authority-Respecting",
      description:
        "Trust in institutions, law enforcement, expert testimony",
    },
    {
      id: "authority-skeptical",
      label: "Authority-Skeptical",
      description:
        "Question official accounts, distrust institutions",
    },
    {
      id: "risk-averse",
      label: "Risk-Averse",
      description:
        "Prefer certainty, conservative in decision-making",
    },
    {
      id: "risk-tolerant",
      label: "Risk-Tolerant",
      description:
        "Comfortable with uncertainty, willing to take chances",
    },
    {
      id: "detail-oriented",
      label: "Detail-Oriented",
      description:
        "Focus on specifics, inconsistencies, technical aspects",
    },
    {
      id: "big-picture",
      label: "Big-Picture Focused",
      description:
        "Consider overall narrative, context, broader implications",
    },
  ];

  const toggleDemographic = (id: string) => {
    setSelectedDemographics((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const togglePsychological = (id: string) => {
    setSelectedPsychological((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Jury Composition
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Select the demographic and psychological characteristics
            that best represent your anticipated jury pool. These
            factors significantly influence case outcomes.
          </p>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selection Summary
            </h3>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-600">Demographics:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {selectedDemographics.length} selected
                </span>
              </div>
              <div>
                <span className="text-gray-600">Psychological:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {selectedPsychological.length} selected
                </span>
              </div>
            </div>
          </div>
          {(selectedDemographics.length > 0 ||
            selectedPsychological.length > 0) && (
            <button
              onClick={() => {
                setSelectedDemographics([]);
                setSelectedPsychological([]);
              }}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Demographics
            </h3>
          </div>

          <div className="space-y-3">
            {demographics.map((item) => (
              <label
                key={item.id}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDemographics.includes(item.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDemographics.includes(item.id)}
                  onChange={() => toggleDemographic(item.id)}
                  className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Psychological Characteristics Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Psychological Characteristics
            </h3>
          </div>

          <div className="space-y-3">
            {psychological.map((item) => (
              <label
                key={item.id}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPsychological.includes(item.id)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPsychological.includes(item.id)}
                  onChange={() => togglePsychological(item.id)}
                  className="mt-1 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights (Conditional) */}
      {(selectedDemographics.length > 0 ||
        selectedPsychological.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-300 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                AI-Powered Jury Analysis
              </h4>
              <p className="text-gray-700 mb-4">
                Based on your selections, our AI will analyze how
                these jury characteristics might influence your case
                strategy, identify potential challenges, and recommend
                tailored approaches for voir dire and trial
                presentation.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Generate Jury Profile Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

