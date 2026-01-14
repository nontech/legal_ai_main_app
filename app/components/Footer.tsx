"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { CountrySelector } from "./CountrySelector";

// Suspense wrapper for CountrySelector (uses useSearchParams)
function CountrySelectorWrapper() {
  return (
    <Suspense
      fallback={
        <div className="w-24 h-8 bg-white/10 rounded animate-pulse" />
      }
    >
      <CountrySelector />
    </Suspense>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const params = useParams();
  const country = params.country as string;
  const locale = params.locale as string;

  return (
    <footer className="bg-gradient-to-br from-primary-950 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Country Selector Row - First Row, Extreme Right */}
        <div className="flex justify-end mb-12 pb-8 border-b border-white/10">
          <CountrySelectorWrapper />
        </div>

        {/* Rest of Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.828 2.83-5.657-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">TheLawThing</h3>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              {t("tagline")}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/thelawthing/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("product")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${country}/${locale}`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("features")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/pricing`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/#use-cases`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("useCases")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("resources")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${country}/${locale}/about-us`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/documentation`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("documentation")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/contact`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("support")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/security`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("security")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("legal")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${country}/${locale}/privacy`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/terms`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/cookies`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("cookiePolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/acceptable-use`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("acceptableUse")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${country}/${locale}/imprint`}
                  className="text-sm text-white/70 hover:text-accent-400 transition-colors"
                >
                  {t("imprint")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white/70">
              {t("allRightsReserved", { year: currentYear })}
            </p>
            <p className="text-sm text-white/60">{t("notLawFirm")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
