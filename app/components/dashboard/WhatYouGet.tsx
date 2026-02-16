"use client";

import { useTranslations } from "next-intl";

export default function WhatYouGet() {
  const t = useTranslations("whatYouGet");

  const features = [
    {
      titleKey: "feature1Title" as const,
      descKey: "feature1Desc" as const,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      color: "primary",
    },
    {
      titleKey: "feature2Title" as const,
      descKey: "feature2Desc" as const,
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      color: "accent",
    },
    {
      titleKey: "feature3Title" as const,
      descKey: "feature3Desc" as const,
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "success",
    },
    {
      titleKey: "feature4Title" as const,
      descKey: "feature4Desc" as const,
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      color: "warning",
    },
    {
      titleKey: "feature5Title" as const,
      descKey: "feature5Desc" as const,
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
      color: "info",
    },
    {
      titleKey: "feature6Title" as const,
      descKey: "feature6Desc" as const,
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      color: "primary",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary-100", text: "text-primary-600" },
    accent: { bg: "bg-accent-100", text: "text-accent-600" },
    success: { bg: "bg-success-100", text: "text-success-600" },
    warning: { bg: "bg-amber-100", text: "text-amber-600" },
    info: { bg: "bg-info-100", text: "text-info-600" },
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-ink-900 text-center mb-14">
          {t("heading")}
        </h2>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map(({ titleKey, descKey, icon, color }) => {
            const colors = colorMap[color];
            return (
              <div
                key={titleKey}
                className="p-6 bg-surface-050 rounded-2xl border border-border-200 hover:border-primary-200 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-11 h-11 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <svg
                    className={`w-5 h-5 ${colors.text}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ink-900 mb-1">
                  {t(titleKey)}
                </h3>
                <p className="text-sm text-ink-500">
                  {t(descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
