"use client";

import { useTranslations } from "next-intl";

export default function WhatWeDo() {
  const t = useTranslations("whatWeDo");

  const items = [
    { key: "item1" as const, icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    { key: "item2" as const, icon: "M13 7l5 5m0 0l-5 5m5-5H6" },
    { key: "item3" as const, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { key: "item4" as const, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { key: "item5" as const, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { key: "item6" as const, icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
    { key: "item7" as const, icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
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
            <p className="text-xl text-ink-700 font-medium mb-2">
              {t("subheading")}
            </p>
            <p className="text-lg text-ink-500">
              {t("description")}
            </p>
          </div>

          {/* Intro */}
          <p className="text-base font-semibold text-primary-700 mb-6">
            {t("intro")}
          </p>

          {/* Capability list — 2 columns in one card */}
          <div className="rounded-2xl border border-border-200 bg-surface-050 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-5">
              {items.map(({ key, icon }) => (
                <div
                  key={key}
                  className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-primary-50/40 transition-colors duration-200"
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
                  <span className="text-ink-700 text-sm md:text-base leading-relaxed pt-1.5 md:pt-2">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
