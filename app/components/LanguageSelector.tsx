"use client";

import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
] as const;

export function LanguageSelector() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const currentCountry = (params.country as string) || "us";
  const currentLocale = (params.locale as string) || "en";
  
  // Get current query string
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : "";

  const handleLocaleChange = (newLocale: string) => {
    const pathParts = pathname.split("/");
    const restOfPath = pathParts.slice(3).join("/");
    const newPath = `/${currentCountry}/${newLocale}${
      restOfPath ? "/" + restOfPath : ""
    }${queryPart}`;

    setIsLanguageOpen(false);
    startTransition(() => {
      router.push(newPath);
    });
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        disabled={isPending}
        className="group flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors cursor-pointer"
      >
        <span>{currentLocale.toUpperCase()}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-ink-400 transition-transform duration-200 ${
            isLanguageOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isLanguageOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsLanguageOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-surface-000 rounded-xl shadow-lg border border-border-200 py-1.5 z-20 min-w-[200px] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <div className="px-3 py-2 text-xs font-semibold text-ink-400 uppercase tracking-wider">
              {t("selector.selectLanguage")}
            </div>
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLocaleChange(language.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                  currentLocale === language.code
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-ink-700 hover:bg-surface-100"
                }`}
              >
                <span>{language.name} ({language.code})</span>
                {currentLocale === language.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {isPending && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
