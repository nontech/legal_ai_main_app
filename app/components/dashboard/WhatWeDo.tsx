"use client";

import { useTranslations } from "next-intl";

export default function WhatWeDo() {
  const t = useTranslations("whatWeDo");

  const items = [
    {
      titleKey: "item1Title" as const,
      descKey: "item1Desc" as const,
      icon: "M3 10h11M3 6h15M3 14h11m4-4v10m0 0l-3-3m3 3l3-3",
    },
    {
      titleKey: "item2Title" as const,
      descKey: "item2Desc" as const,
      icon: "M13 7l5 5m0 0l-5 5m5-5H6",
    },
    {
      titleKey: "item3Title" as const,
      descKey: "item3Desc" as const,
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      titleKey: "item4Title" as const,
      descKey: "item4Desc" as const,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
  ];

  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              {t("heading")}
            </h2>
            <p className="text-lg md:text-xl text-ink-700 leading-relaxed max-w-3xl mx-auto">
              {t("leadPart1")}
              <span className="font-semibold">
                {t("leadHighlightRate")}
              </span>
              {t("leadPart2")}
              <span className="font-semibold">
                {t("leadHighlightTime")}
              </span>
              {t("leadPart3")}
            </p>
          </div>

          {/* Label */}
          <p className="text-sm font-semibold tracking-wide text-primary-700 mb-4 text-left">
            {t("intro")}
          </p>

          {/* Capability grid — 4 individual blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {items.map(({ titleKey, descKey, icon }) => (
              <div
                key={titleKey}
                className="flex flex-col h-full rounded-xl bg-white border border-border-100 p-4 md:p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-primary-600"
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
                <h3 className="mt-4 text-base md:text-lg font-semibold text-ink-900">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm md:text-base text-ink-600 leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
