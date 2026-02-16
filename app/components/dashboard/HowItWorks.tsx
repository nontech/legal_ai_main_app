"use client";

import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      titleKey: "step1Title" as const,
      descKey: "step1Desc" as const,
      icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    },
    {
      titleKey: "step2Title" as const,
      descKey: "step2Desc" as const,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    },
    {
      titleKey: "step3Title" as const,
      descKey: "step3Desc" as const,
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      titleKey: "step4Title" as const,
      descKey: "step4Desc" as const,
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    },
    {
      titleKey: "step5Title" as const,
      descKey: "step5Desc" as const,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-surface-050 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-ink-900 text-center mb-14">
          {t("heading")}
        </h2>

        {/* Steps — Grid layout without numbering or strict lines */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(({ titleKey, descKey, icon }, index) => (
              <div 
                key={index} 
                className={`flex ${index === steps.length - 1 ? "md:col-span-2" : ""}`}
              >
                <div className="w-full bg-white rounded-2xl p-6 border border-border-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                      <svg
                        className="w-6 h-6"
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
                    <div>
                      <h3 className="text-xl font-bold text-ink-900 mb-2">
                        {t(titleKey)}
                      </h3>
                      <p className="text-ink-600 leading-relaxed">
                        {t(descKey)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
