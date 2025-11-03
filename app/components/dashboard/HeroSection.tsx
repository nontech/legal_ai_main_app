"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-primary-950 to-primary-700 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - CTA Card */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-100 to-surface-000 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative backdrop-blur-md bg-gradient-to-br from-surface-000/95 to-accent-100/80 rounded-3xl p-8 shadow-2xl border border-border-200/60">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl shadow-lg mb-6 animate-pulse">
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
                <h2 className="text-2xl font-bold text-ink-900 mb-3">
                  Start New Analysis
                </h2>
                <p className="text-ink-600 mb-6 text-sm">
                  Launch comprehensive case analysis with AI-powered
                  insights and strategic recommendations
                </p>
                <Link
                  href="/case-analysis"
                  className="w-full bg-gradient-to-r from-primary-700 to-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-800 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
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
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-500">
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

          {/* Right Column - Hero Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-400 rounded-xl shadow-lg">
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
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-5xl font-bold leading-tight">
                  Legal Analytics
                </h1>
                <p className="text-accent-400 text-2xl font-semibold">
                  Command Center
                </p>
              </div>
            </div>

            <p className="text-lg text-surface-200 mb-6 leading-relaxed">
              Empower your legal practice with AI-driven case
              analysis, strategic insights, and comprehensive case
              management tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5"
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
                <span className="text-sm leading-relaxed">
                  Predicts case outcomes
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
                <span className="text-sm leading-relaxed">
                  Generates tailored game plans
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5"
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
                <span className="text-sm leading-relaxed">
                  Structures content into insights
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-sm leading-relaxed">
                  Provides pre-drafted motions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
