"use client";

import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      titleKey: "step1Title" as const,
      descKey: "step1Desc" as const,
    },
    {
      titleKey: "step2Title" as const,
      descKey: "step2Desc" as const,
    },
    {
      titleKey: "step3Title" as const,
      descKey: "step3Desc" as const,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-surface-050 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-ink-900 text-center mb-14">
          {t("heading")}
        </h2>

        {/* Steps — three boxes side by side on desktop */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ titleKey, descKey }, index) => (
              <div key={index} className="flex">
                <div className="w-full bg-white rounded-2xl p-6 border border-border-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-semibold text-base md:text-lg mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-ink-900 mb-2">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm md:text-base text-ink-600 leading-relaxed">
                      {t(descKey)}
                    </p>
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
