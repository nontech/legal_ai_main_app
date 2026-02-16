"use client";

import { useTranslations } from "next-intl";

export default function WhoItsFor() {
  const t = useTranslations("whoItsFor");

  const items = [
    "item1" as const,
    "item2" as const,
    "item3" as const,
    "item4" as const,
    "item5" as const,
  ];

  return (
    <section className="py-20 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Heading and Intro */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-6">
              {t("heading")}
            </h2>
            <p className="text-xl text-primary-700 font-semibold mb-4">
              {t("subheading")}
            </p>
            <p className="text-lg text-ink-600 leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Right: Qualifying checklist in a modern card */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg border border-border-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-5">
                {items.map((key) => (
                  <div key={key} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success-100 text-success-600 flex items-center justify-center mt-0.5 group-hover:bg-success-600 group-hover:text-white transition-colors duration-200">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-ink-700 text-base md:text-lg leading-relaxed group-hover:text-ink-900 transition-colors duration-200">
                      {t(key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
