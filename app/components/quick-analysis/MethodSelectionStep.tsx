"use client";

import { useRouter, useParams } from "next/navigation";

interface MethodSelectionStepProps {
  onUploadDocuments: () => void;
}

export default function MethodSelectionStep({
  onUploadDocuments,
}: MethodSelectionStepProps) {
  const router = useRouter();
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-lg">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Start Your Case Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to begin. Upload documents for quick
            analysis or enter data manually for complete control.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Documents Card */}
          <button
            onClick={onUploadDocuments}
            className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                QUICK
              </div>
            </div>

            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Upload Documents
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Upload your case documents and get a preliminary
              analysis in under a minute. Perfect for quick insights.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
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
                <span>Fast preliminary analysis</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
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
                <span>Minimal data entry required</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
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
                <span>Option to add details later</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-blue-200">
              <span className="text-sm font-medium text-gray-600">
                Takes ~1 minute
              </span>
              <svg
                className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform"
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
            </div>
          </button>

          {/* Enter Data Manually Card */}
          <button
            onClick={() => router.push(`/${country}/${locale}/case-analysis/detailed`)}
            className="group relative bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                DETAILED
              </div>
            </div>

            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Enter Data Manually
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Comprehensive step-by-step form for detailed case
              analysis. Full control over every aspect of your case.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0"
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
                <span>Comprehensive analysis</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0"
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
                <span>Include charges, judge, jury details</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0"
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
                <span>Most accurate predictions</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-amber-200">
              <span className="text-sm font-medium text-gray-600">
                Takes ~5 minutes
              </span>
              <svg
                className="w-6 h-6 text-amber-600 group-hover:translate-x-2 transition-transform"
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
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
