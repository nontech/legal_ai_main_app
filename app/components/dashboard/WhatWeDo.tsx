"use client";

import { useTranslations } from "next-intl";
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
    <section className="py-16 md:py-24 bg-surface-000 border-t border-border-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-800 mb-4">
              {t("intro")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-ink-900 mb-5 tracking-tight">
              {t("heading")}
            </h2>
            <p className="text-lg md:text-xl text-ink-600 leading-relaxed max-w-3xl mx-auto">
              {t.rich("lead", {
                bold: (chunks) => (
                  <span className="font-semibold text-ink-900">{chunks}</span>
                ),
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {items.map(({ titleKey, descKey, Illustration }) => (
              <div
                key={titleKey}
                className="group flex flex-col h-full rounded-2xl border border-border-200/90 bg-[#faf8f5] p-6 md:p-8 transition-all duration-300 hover:border-primary-800/25 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]"
              >
                <div className="flex-shrink-0 w-28 h-24 md:w-32 md:h-28 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                  <Illustration />
                </div>
                <h3 className="mt-5 font-display text-lg md:text-xl font-medium text-ink-900">
                  {t.rich(titleKey, {
                    bold: (chunks) => (
                      <span className="text-primary-800 not-italic">{chunks}</span>
                    ),
                  })}
                </h3>
                <p className="mt-3 text-sm md:text-base text-ink-600 leading-relaxed">
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
