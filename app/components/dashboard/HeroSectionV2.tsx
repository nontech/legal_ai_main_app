"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function HeroSectionV2() {
  const t = useTranslations("heroV2");
  const params = useParams();
  const country = params.country as string;
  const locale = params.locale as string;

  return (
    <section className="bg-gradient-to-br from-surface-050 via-white to-primary-50/30 text-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-32 lg:pt-14 lg:pb-40">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8 whitespace-nowrap">
            <span className="text-ink-900">{t("headline")}</span>
          </h1>
          <p className="text-base md:text-lg font-semibold text-primary-700 mb-10">
            {t("tagline")}
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-ink-600 leading-relaxed mb-14 max-w-2xl mx-auto">
            {t("descriptionPart1")}
            <span className="font-semibold text-primary-700">
              {t("descriptionHighlight")}
            </span>
            {t("descriptionPart2")}
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-6 mb-16">
            <Link
              href={`/${country}/${locale}/case-analysis`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-accent-500 hover:to-accent-400 transition-all duration-300 shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5"
            >
              <span>{t("cta")}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
