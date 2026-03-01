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
    <section className="bg-gradient-to-br from-surface-050 via-white to-primary-50/30 text-ink-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:py-20 lg:py-24 w-full relative z-10">
        
        {/* Top Centered Section: Headline & Subheadline */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16 space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-ink-900 tracking-tight">
             {t("headline")}
           </h1>
           <p className="text-lg md:text-xl text-ink-600 leading-relaxed max-w-3xl mx-auto">
             {t.rich("subheadline", {
               bold: (chunks) => <span className="font-bold text-primary-700">{chunks}</span>
             })}
           </p>
        </div>

        {/* Split Section: Who It's For (Left) vs Illustration (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Who It's For + CTA */}
          <div className="flex flex-col text-left space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 order-2 lg:order-1">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-ink-900 uppercase tracking-wider text-sm">
                {t("whoItsForTitle")}
              </h3>
              <ul className="space-y-3">
                {[1, 2, 3].map((item, index) => (
                  <li 
                    key={item} 
                    className="flex items-start gap-3 text-ink-700 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-backwards"
                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                  >
                    <svg className="w-6 h-6 text-success-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">
                      {t.rich(`whoItsForList${item}`, {
                        bold: (chunks) => <span className="font-semibold text-ink-900">{chunks}</span>
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href={`/${country}/${locale}/case-analysis`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-accent-500 hover:to-accent-400 transition-all duration-300 shadow-lg hover:shadow-accent-500/25 hover:-translate-y-1 w-full sm:w-auto min-w-[200px]"
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

          {/* Right Column: Illustration */}
          <div className="flex justify-center items-center relative animate-in fade-in zoom-in-95 duration-1000 delay-300 order-1 lg:order-2">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100/40 to-transparent rounded-full blur-3xl transform scale-90 -z-10" />
            
            <HeroIllustration />
          </div>

        </div>
      </div>
    </section>
  );
}
