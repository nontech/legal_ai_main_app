"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import ScrollReveal from "@/app/components/ScrollReveal";
import HeroIllustration from "./HeroIllustration";

export default function HeroSectionV2() {
  const t = useTranslations("heroV2");
  const params = useParams();
  const country = params.country as string;
  const locale = params.locale as string;

  return (
    <section className="text-ink-900 overflow-hidden">
      {/* Night band — layered color like enterprise hero sites (e.g. Shiji-style gold + blue + teal washes) */}
      <div className="relative pt-24 min-h-[min(92vh,52rem)] bg-gradient-to-b from-[#040811] via-[#0a1628] to-[#0f1f35] text-white">
        {/* Base color wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-900/90 via-transparent to-[#1a0a28]/35" />

        {/* Animated mesh orbs */}
        <div className="pointer-events-none absolute -left-[20%] -top-[30%] h-[85%] w-[70%] rounded-[50%] blur-3xl landing-mesh-drift opacity-90 mix-blend-screen">
          <div
            className="h-full w-full rounded-[50%]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(243,174,61,0.45) 0%, rgba(249,196,105,0.18) 42%, transparent 70%)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute -right-[15%] top-0 h-[75%] w-[65%] rounded-[50%] blur-3xl landing-mesh-drift-slow opacity-80 mix-blend-screen">
          <div
            className="h-full w-full rounded-[50%]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(56,130,200,0.42) 0%, rgba(35,196,180,0.22) 38%, transparent 68%)",
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 100% 60% at 50% 120%, rgba(26,180,168,0.25), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(220,140,50,0.2), transparent 50%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%)",
          }}
        />
        {/* Slow light sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent landing-hero-shimmer"
            style={{ left: "0%" }}
          />
        </div>

        <div className="relative z-10 flex min-h-[min(92vh,52rem)] max-w-7xl mx-auto items-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8 w-full">
            <p className="landing-animate-fade-up text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent-300/90">
              TheLawThing
            </p>
            <h1 className="landing-animate-fade-up landing-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-medium leading-[1.12] tracking-tight text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]">
              {t.rich("headline", {
                accent: (chunks) => (
                  <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text font-normal italic text-transparent">
                    {chunks}
                  </span>
                ),
              })}
            </h1>
            <p className="landing-animate-fade-up landing-delay-2 text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              {t.rich("subheadline", {
                bold: (chunks) => (
                  <span className="font-semibold text-white">{chunks}</span>
                ),
              })}
            </p>
            <div className="landing-animate-fade-up landing-delay-3 flex flex-col items-center gap-5 sm:gap-6 pt-3 w-full max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-3 text-center">
                <span
                  className="h-px w-14 sm:w-16 rounded-full bg-gradient-to-r from-transparent via-accent-400/90 to-transparent"
                  aria-hidden={true}
                />
                <p className="font-display text-[1.35rem] sm:text-2xl md:text-[1.75rem] font-normal leading-[1.35] text-balance text-white/92 tracking-[-0.02em] [text-shadow:0_2px_28px_rgba(0,0,0,0.4)]">
                  {t.rich("ctaLead", {
                    emph: (chunks) => (
                      <span className="font-semibold not-italic text-transparent bg-clip-text bg-gradient-to-r from-amber-50 via-accent-200 to-amber-200 [filter:drop-shadow(0_0_20px_rgba(251,191,36,0.25))]">
                        {chunks}
                      </span>
                    ),
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full">
                <Link
                  href={`/${country}/${locale}/case-analysis`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 px-7 py-3.5 text-base font-semibold text-primary-950 shadow-lg shadow-amber-900/25 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/30 hover:brightness-105"
                  aria-label={`${t("ctaLeadPlain")} ${t("cta")}`}
                >
                  <span>{t("cta")}</span>
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden={true}
                    focusable={false}
                  >
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
                  className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-accent-400/50 hover:bg-white/15 hover:shadow-[0_0_24px_-4px_rgba(249,196,105,0.35)]"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day band — soft tinted mesh */}
      <div className="relative border-t border-white/10 bg-gradient-to-b from-[#faf6f0] via-[#f5f0e8] to-[#faf8f5]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 15% 0%, rgba(212,225,243,0.55), transparent 50%), radial-gradient(ellipse 60% 45% at 92% 30%, rgba(255,237,213,0.7), transparent 45%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(220,245,242,0.35), transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col text-left space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <ScrollReveal>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
                    {t("whoItsForTitle")}
                  </h2>
                </ScrollReveal>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item, index) => (
                    <ScrollReveal
                      key={item}
                      as="li"
                      delayMs={80 + index * 90}
                      className="flex items-start gap-3 text-ink-700"
                    >
                      <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-700 to-primary-900 text-[10px] font-bold text-white shadow-md shadow-primary-900/20">
                        {index + 1}
                      </span>
                      <span className="text-lg leading-snug">
                        {t.rich(`whoItsForList${item}`, {
                          bold: (chunks) => (
                            <span className="font-semibold text-ink-900">{chunks}</span>
                          ),
                        })}
                      </span>
                    </ScrollReveal>
                  ))}
                </ul>
              </div>
              <ScrollReveal delayMs={380}>
                <div className="flex flex-col gap-4 sm:gap-5">
                  <div className="relative pl-4 sm:pl-5 border-l-[3px] sm:border-l-4 border-accent-500/90 rounded-l-sm">
                    <p className="font-display text-xl sm:text-2xl font-normal text-ink-900 leading-snug text-balance tracking-[-0.02em]">
                      {t.rich("ctaLead", {
                        emph: (chunks) => (
                          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-900 via-accent-600 to-primary-800">
                            {chunks}
                          </span>
                        ),
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/${country}/${locale}/case-analysis`}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-transparent bg-gradient-to-r from-primary-800 to-primary-700 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-900/25 transition-all duration-300 hover:from-primary-700 hover:to-primary-600 hover:scale-[1.02] hover:shadow-xl self-start"
                    aria-label={`${t("ctaLeadPlain")} ${t("cta")}`}
                  >
                    <span>{t("cta")}</span>
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden={true}
                      focusable={false}
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
              </ScrollReveal>
            </div>

            <ScrollReveal className="flex justify-center items-center relative order-1 lg:order-2" variant="fade-right" delayMs={120}>
              <div
                className="absolute inset-0 -z-10 scale-110 blur-3xl opacity-70 landing-mesh-drift"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 40%, rgba(59,130,180,0.25), transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(243,174,61,0.2), transparent 50%)",
                }}
              />
              <div className="rounded-2xl border border-white/80 bg-white/75 p-6 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.28)] backdrop-blur-md ring-1 ring-primary-200/40 transition-transform duration-500 hover:scale-[1.01]">
                <HeroIllustration />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
