"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/app/components/ScrollReveal";
import {
  SituationAnalysisIllus,
  NextMovesIllus,
  CourtDocsIllus,
  ExitStrategyIllus,
} from "./WhatWeDoIllustrations";

export default function WhatWeDo() {
  const t = useTranslations("whatWeDo");

  const items = [
    {
      titleKey: "item1Title" as const,
      descKey: "item1Desc" as const,
      Illustration: SituationAnalysisIllus,
    },
    {
      titleKey: "item2Title" as const,
      descKey: "item2Desc" as const,
      Illustration: NextMovesIllus,
    },
    {
      titleKey: "item3Title" as const,
      descKey: "item3Desc" as const,
      Illustration: CourtDocsIllus,
    },
    {
      titleKey: "item4Title" as const,
      descKey: "item4Desc" as const,
      Illustration: ExitStrategyIllus,
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 border-t border-border-200/50">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-000 via-[#f2f7fc]/90 to-[#faf6f0]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-80 mix-blend-multiply landing-mesh-drift"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 45% at 10% 20%, rgba(59,119,180,0.12), transparent 50%), radial-gradient(ellipse 55% 40% at 90% 10%, rgba(243,174,61,0.14), transparent 50%), radial-gradient(ellipse 50% 35% at 80% 90%, rgba(35,196,180,0.1), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <ScrollReveal className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-700 via-primary-600 to-highlight-600 bg-clip-text text-transparent">
                {t("intro")}
              </p>
            </ScrollReveal>
            <ScrollReveal className="mb-5" delayMs={90}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-ink-900 tracking-tight">
                {t("heading")}
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={180}>
              <p className="text-lg md:text-xl text-ink-600 leading-relaxed max-w-3xl mx-auto">
                {t.rich("lead", {
                  bold: (chunks) => (
                    <span className="font-semibold text-ink-900">{chunks}</span>
                  ),
                })}
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {items.map(({ titleKey, descKey, Illustration }, index) => (
              <ScrollReveal
                key={titleKey}
                delayMs={index * 100}
                className="group relative rounded-2xl p-px transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_24px_56px_-20px_rgba(22,52,87,0.22)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(243,174,61,0.55) 0%, rgba(59,119,180,0.35) 45%, rgba(35,196,180,0.4) 100%)",
                }}
              >
                <div className="flex flex-col h-full rounded-2xl border border-white/60 bg-white/85 backdrop-blur-sm p-6 md:p-8 transition-colors duration-300 group-hover:bg-white/95">
                  <div className="flex-shrink-0 w-28 h-24 md:w-32 md:h-28 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.06]">
                    <Illustration />
                  </div>
                  <h3 className="mt-5 font-display text-lg md:text-xl font-medium text-ink-900">
                    {t.rich(titleKey, {
                      bold: (chunks) => (
                        <span className="bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent not-italic">
                          {chunks}
                        </span>
                      ),
                    })}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-ink-600 leading-relaxed">
                    {t(descKey)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
