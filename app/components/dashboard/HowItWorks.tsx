"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/app/components/ScrollReveal";
import {
  DescribeSituationIllus,
  AIAnalyzesIllus,
  ClearInsightsDocsIllus,
} from "./HowItWorksIllustrations";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      id: "step-1",
      titleKey: "step1Title" as const,
      descKey: "step1Desc" as const,
      Illustration: DescribeSituationIllus,
    },
    {
      id: "step-2",
      titleKey: "step2Title" as const,
      descKey: "step2Desc" as const,
      Illustration: AIAnalyzesIllus,
    },
    {
      id: "step-3",
      titleKey: "step3Title" as const,
      descKey: "step3Desc" as const,
      Illustration: ClearInsightsDocsIllus,
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#071018] via-[#0d1a2e] to-[#132845]" />
      <div
        className="pointer-events-none absolute inset-0 landing-mesh-drift opacity-95 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 15% 20%, rgba(243,174,61,0.28), transparent 55%), radial-gradient(ellipse 80% 60% at 85% 15%, rgba(56,140,210,0.35), transparent 50%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(35,196,180,0.22), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(125deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(249,196,105,0.06) 55%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-y-[-20%] w-[40%] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent landing-hero-shimmer"
          style={{ left: "10%" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-center text-white tracking-tight drop-shadow-sm">
            {t("heading")}
          </h2>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map(({ id, titleKey, descKey, Illustration }, index) => (
              <div key={id} className="flex">
                <ScrollReveal
                  className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.05] p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-accent-400/40 hover:from-white/[0.16] hover:to-white/[0.08] hover:shadow-[0_20px_48px_-24px_rgba(0,0,0,0.45)] hover:-translate-y-1"
                  delayMs={100 + index * 120}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-sm font-bold text-primary-950 shadow-lg shadow-amber-900/30 mb-3">
                      {index + 1}
                    </div>
                    <div className="flex-shrink-0 w-24 h-20 md:w-28 md:h-24 mb-4 flex items-center justify-center opacity-95 [&_svg]:drop-shadow-md">
                      <Illustration />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-medium text-white mb-2">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm md:text-base text-white/75 leading-relaxed whitespace-pre-line">
                      {t(descKey)}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
