"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import HeroIllustration from "./HeroIllustration";

export default function HeroSectionV2() {
  const t = useTranslations("heroV2");
  const params = useParams();
  const country = params.country as string;
  const locale = params.locale as string;

  return (
    <section className="text-ink-900 overflow-hidden">
      {/* Night band — enterprise hero (reference: high-contrast platform sites) */}
      <div className="relative bg-gradient-to-b from-[#060b14] via-primary-950 to-[#0d1829] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 120% 80% at 20% -20%, rgba(217,150,41,0.25), transparent 50%), radial-gradient(ellipse 80% 60% at 90% 10%, rgba(56,120,180,0.2), transparent 45%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              TheLawThing
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-medium leading-[1.12] tracking-tight text-white">
              {t.rich("headline", {
                accent: (chunks) => (
                  <span className="text-accent-400 font-normal italic">{chunks}</span>
                ),
              })}
            </h1>
            <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              {t.rich("subheadline", {
                bold: (chunks) => (
                  <span className="font-semibold text-white">{chunks}</span>
                ),
              })}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link
                href={`/${country}/${locale}/case-analysis`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 px-7 py-3.5 text-base font-semibold text-primary-950 shadow-lg shadow-black/20 transition-all hover:bg-accent-400"
              >
                <span>{t("cta")}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href={`/${country}/${locale}/pricing`}
                className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Day band — audience + illustration */}
      <div className="relative bg-[#faf8f5] border-t border-border-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col text-left space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-xs font-semibold text-primary-800 uppercase tracking-[0.2em]">
                  {t("whoItsForTitle")}
                </h2>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item, index) => (
                    <li key={item} className="flex items-start gap-3 text-ink-700">
                      <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-800 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-lg leading-snug">
                        {t.rich(`whoItsForList${item}`, {
                          bold: (chunks) => (
                            <span className="font-semibold text-ink-900">{chunks}</span>
                          ),
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/${country}/${locale}/case-analysis`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-primary-800/20 bg-surface-000 px-6 py-3.5 text-base font-semibold text-primary-900 shadow-sm transition-all hover:border-primary-800/35 hover:shadow-md"
              >
                <span>{t("cta")}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            <div className="flex justify-center items-center relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-200/35 to-transparent rounded-[40%] blur-3xl scale-90 -z-10" />
              <div className="rounded-2xl border border-border-200/80 bg-surface-000/80 p-6 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.2)] backdrop-blur-sm">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
