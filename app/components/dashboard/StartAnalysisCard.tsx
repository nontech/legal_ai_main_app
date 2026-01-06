"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function StartAnalysisCard() {
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-100 rounded-3xl blur-xl opacity-50"></div>
      <div className="relative backdrop-blur-md bg-gradient-to-br from-amber-50/90 to-orange-50/90 rounded-3xl p-8 shadow-xl border border-amber-200/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-lg mb-6 animate-pulse">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Start New Analysis
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Launch comprehensive case analysis with AI-powered
            insights and strategic recommendations
          </p>
          <Link
            href={`/${country}/${locale}/case-analysis`}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>+ New Case Analysis</span>
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Setup takes less than 5 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
