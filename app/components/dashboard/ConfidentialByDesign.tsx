"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import ScrollReveal from "@/app/components/ScrollReveal";

export default function ConfidentialByDesign() {
  const t = useTranslations("confidentialByDesign");
  const params = useParams();
  const country = (params?.country as string) || "us";
  const locale = (params?.locale as string) || "en";
  return (
    <section className="relative overflow-hidden py-20 md:py-28 border-t border-border-200/50">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#f8f2e8] via-[#f0ebe3] to-[#e8f4f2]/60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70 landing-mesh-drift-slow"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 45% at 0% 30%, rgba(59,119,180,0.12), transparent 50%), radial-gradient(ellipse 55% 40% at 100% 70%, rgba(243,174,61,0.15), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="mb-6">
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-center text-ink-900 tracking-tight">
              {t("headingPrimary")}{" "}
              <span className="bg-gradient-to-r from-primary-800 via-primary-600 to-highlight-600 bg-clip-text text-transparent">
                {t("headingAccent")}
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal className="mb-12" delayMs={100}>
            <p className="text-lg md:text-xl text-ink-600 text-center leading-relaxed max-w-3xl mx-auto">
              {t("subheading")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Data Privacy */}
            <ScrollReveal delayMs={80} className="p-6 md:p-7 bg-white/90 rounded-2xl border border-white/80 shadow-md shadow-primary-900/5 ring-1 ring-primary-100/80 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-100 to-info-100/60 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">
                    {t("card1Title")}
                  </h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{t("card1Item1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{t("card1Item2")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Encryption */}
            <ScrollReveal delayMs={160} className="p-6 md:p-7 bg-white/90 rounded-2xl border border-white/80 shadow-md shadow-primary-900/5 ring-1 ring-success-500/15 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-100 to-highlight-200/50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-success-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">
                    {t("card2Title")}
                  </h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-success-600 mt-1">•</span>
                      <span>{t("card2Item1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success-600 mt-1">•</span>
                      <span>{t("card2Item2")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Access Control */}
            <ScrollReveal delayMs={240} className="p-6 md:p-7 bg-white/90 rounded-2xl border border-white/80 shadow-md shadow-primary-900/5 ring-1 ring-accent-500/20 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-100 to-amber-100/80 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">
                    {t("card3Title")}
                  </h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 mt-1">•</span>
                      <span>{t("card3Item1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 mt-1">•</span>
                      <span>{t("card3Item2")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Compliance */}
            <ScrollReveal delayMs={320} className="p-6 md:p-7 bg-white/90 rounded-2xl border border-white/80 shadow-md shadow-primary-900/5 ring-1 ring-info-500/20 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-info-100 to-primary-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-info-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">
                    {t("card4Title")}
                  </h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-info-600 mt-1">•</span>
                      <span>{t("card4Item1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-info-600 mt-1">•</span>
                      <span>{t("card4Item2")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="mt-14 text-center" delayMs={120}>
            <Link
              href={`/${country}/${locale}/security`}
              className="inline-flex items-center gap-2 text-primary-800 hover:text-primary-950 font-semibold transition-colors text-sm uppercase tracking-wide"
            >
              {t("cta")}
              <svg
                className="w-4 h-4"
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

