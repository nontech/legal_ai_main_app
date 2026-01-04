"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/40 text-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">
              {t("title")}
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
            {t("description")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href="/case-analysis"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-accent-500 hover:to-accent-400 transition-all duration-300 shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5"
            >
              <span>{t("cta")}</span>
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
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4"
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
              <span>{t("setupTime")}</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16">
          {/* Column 1 */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors duration-300 shadow-sm">
            <div className="w-12 h-12 bg-success-500/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-success-300"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("feature1Title")}
            </h3>
            <ul className="text-gray-700 leading-relaxed text-sm space-y-2 list-disc list-inside text-left">
              <li>{t("feature1Item1")}</li>
              <li>{t("feature1Item2")}</li>
              <li>{t("feature1Item3")}</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors duration-300 shadow-sm">
            <div className="w-12 h-12 bg-primary-500/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-300"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("feature2Title")}
            </h3>
            <ul className="text-gray-700 leading-relaxed text-sm space-y-2 list-disc list-inside text-left">
              <li>{t("feature2Item1")}</li>
              <li>{t("feature2Item2")}</li>
              <li>{t("feature2Item3")}</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors duration-300 shadow-sm">
            <div className="w-12 h-12 bg-accent-500/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-accent-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("feature3Title")}
            </h3>
            <ul className="text-gray-700 leading-relaxed text-sm space-y-2 list-disc list-inside text-left">
              <li>{t("feature3Item1")}</li>
              <li>{t("feature3Item2")}</li>
              <li>{t("feature3Item3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
