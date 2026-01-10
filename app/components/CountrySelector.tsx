"use client";

import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { COUNTRIES } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";

export function CountrySelector() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const currentCountry = (params.country as string) || "us";
  const currentLocale = (params.locale as string) || "en";
  
  // Get current query string
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : "";

  const handleCountryChange = (newCountry: string) => {
    const country = COUNTRIES.find((c) => c.code === newCountry);
    const newLocale = country?.locales.includes(currentLocale as any)
      ? currentLocale
      : country?.defaultLocale || "en";

    // Preserve the rest of the path and query parameters
    const pathParts = pathname.split("/");
    const restOfPath = pathParts.slice(3).join("/");
    const newPath = `/${newCountry}/${newLocale}${
      restOfPath ? "/" + restOfPath : ""
    }${queryPart}`;

    setIsCountryOpen(false);
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsCountryOpen(!isCountryOpen)}
        disabled={isPending}
        className="group flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer"
      >
        <span className="text-white/70">{t("selector.country")}</span>
        <Globe className="w-4 h-4 text-white/70 group-hover:text-accent-400 transition-colors" />
        <span>{t(`countries.${currentCountry}`)}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
            isCountryOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isCountryOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsCountryOpen(false)}
          />
          <div className="absolute bottom-full mb-2 right-0 bg-surface-000 rounded-xl shadow-lg border border-border-200 py-1.5 z-20 min-w-[200px] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-bottom-right">
            <div className="px-3 py-2 text-xs font-semibold text-ink-400 uppercase tracking-wider">
              {t("selector.selectJurisdiction")}
            </div>
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountryChange(country.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                  currentCountry === country.code
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-ink-700 hover:bg-surface-100"
                }`}
              >
                <span>{t(`countries.${country.code}`)}</span>
                {currentCountry === country.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {isPending && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
