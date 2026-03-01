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
    <section className="py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              {t("heading")}
            </h2>
            <p className="text-lg md:text-xl text-ink-700 leading-relaxed max-w-3xl mx-auto">
              {t.rich("lead", {
                bold: (chunks) => (
                  <span className="font-semibold text-primary-700">{chunks}</span>
                ),
              })}
            </p>
          </div>

          {/* Label */}
          <p className="text-sm font-semibold tracking-wide text-primary-700 mb-4 text-left">
            {t("intro")}
          </p>

          {/* Capability grid — 4 individual blocks with illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {items.map(({ titleKey, descKey, Illustration }) => (
              <div
                key={titleKey}
                className="flex flex-col h-full rounded-xl bg-white border border-border-200 p-4 md:p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div className="flex-shrink-0 w-24 h-20 md:w-28 md:h-24 mx-auto flex items-center justify-center">
                  <Illustration />
                </div>
                <h3 className="mt-4 text-base md:text-lg font-semibold text-ink-900">
                  {t.rich(titleKey, {
                    bold: (chunks) => (
                      <span className="font-bold text-primary-700">{chunks}</span>
                    ),
                  })}
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
