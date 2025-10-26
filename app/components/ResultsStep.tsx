"use client";

import { useRouter } from "next/navigation";

export default function ResultsStep() {
  const router = useRouter();

  // Calculate completion percentage based on what we have
  const completionPercentage = 35; // Quick analysis gives ~35% completion

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-lg animate-pulse">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Preliminary Analysis Complete!
        </h1>
        <p className="text-gray-600">
          Here's your quick case analysis based on the information
          provided
        </p>
      </div>

      {/* Completion Status Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-6xl font-bold text-blue-600">
              {completionPercentage}%
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Analysis Completion
          </p>
          <p className="text-sm text-gray-600">
            Based on basic case information
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {/* What's Included */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3 mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <h4 className="font-semibold text-gray-900 text-sm text-center mb-1">
              Jurisdiction Set
            </h4>
            <p className="text-xs text-gray-600 text-center">
              Location and court identified
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3 mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <h4 className="font-semibold text-gray-900 text-sm text-center mb-1">
              Case Type & Role
            </h4>
            <p className="text-xs text-gray-600 text-center">
              Legal category and position defined
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3 mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <h4 className="font-semibold text-gray-900 text-sm text-center mb-1">
              Basic Information
            </h4>
            <p className="text-xs text-gray-600 text-center">
              Case details and description
            </p>
          </div>
        </div>
      </div>

      {/* Preliminary Results */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Preliminary Insights
        </h2>

        <div className="space-y-6">
          {/* Initial Assessment */}
          <div className="flex items-start">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Initial Case Assessment
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Based on the basic information provided, we've
                established the fundamental parameters of your case.
                This includes jurisdiction, case type, your role, and
                core case details.
              </p>
            </div>
          </div>

          {/* Next Steps Preview */}
          <div className="flex items-start">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg mr-4 flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-600"
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
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                What's Missing for Complete Analysis
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Specific charges or claims details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>
                    Evidence, witnesses, and supporting materials
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Judge selection and judicial history</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>
                    Jury composition and demographics (if applicable)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA to Complete Missing Steps */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-amber-600"
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
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Complete the Analysis
        </h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Use the "Previous" button below to go back and fill in the
          missing details about charges, evidence, witnesses, judge,
          and jury to receive comprehensive predictions and strategic
          recommendations tailored to your specific case.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span>
            Use the step indicators on the right to navigate
          </span>
        </div>
      </div>

      {/* Alternative Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-4">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Return to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Summary
        </button>
      </div>
    </div>
  );
}
