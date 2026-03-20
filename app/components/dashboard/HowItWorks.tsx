"use client";

import { useTranslations } from "next-intl";
import {
  DescribeSituationIllus,
  AIAnalyzesIllus,
  ClearInsightsDocsIllus,
} from "./HowItWorksIllustrations";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      titleKey: "step1Title" as const,
      descKey: "step1Desc" as const,
      Illustration: DescribeSituationIllus,
    },
    {
      titleKey: "step2Title" as const,
      descKey: "step2Desc" as const,
      Illustration: AIAnalyzesIllus,
    },
    {
      titleKey: "step3Title" as const,
      descKey: "step3Desc" as const,
      Illustration: ClearInsightsDocsIllus,
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#0a1220] to-primary-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(249,196,105,0.12), transparent 55%)",
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-center text-white mb-14 md:mb-16 tracking-tight">
          {t("heading")}
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map(({ titleKey, descKey, Illustration }, index) => (
              <div key={index} className="flex">
                <div className="w-full rounded-2xl border border-white/10 bg-white/[0.07] p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.1]">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-accent-500/90 text-sm font-bold text-primary-950 mb-3">
                      {index + 1}
                    </div>
                    <div className="flex-shrink-0 w-24 h-20 md:w-28 md:h-24 mb-4 flex items-center justify-center opacity-95 [&_svg]:drop-shadow-sm">
                      <Illustration />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-medium text-white mb-2">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed whitespace-pre-line">
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
