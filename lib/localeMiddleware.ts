import { COUNTRIES, DEFAULT_COUNTRY } from "../i18n/routing.ts";

const countries: string[] = COUNTRIES.map((country) => country.code);
const locales = ["en", "de"];

const countryDefaults: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((country) => [country.code, country.defaultLocale]),
);

/**
 * Path the locale middleware should redirect to.
 * `null` means the request should continue without a locale prefix.
 * `/ingest` is included so the PostHog rewrite in next.config can run.
 */
export function localeRedirectPath(pathname: string): string | null {
  if (
    pathname.startsWith("/api") ||
    pathname === "/ingest" ||
    pathname.startsWith("/ingest/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    return null;
  }

  const pathnameHasCountryLocale = countries.some((country) =>
    locales.some(
      (locale) =>
        pathname.startsWith(`/${country}/${locale}/`) ||
        pathname === `/${country}/${locale}`,
    ),
  );
  if (pathnameHasCountryLocale) return null;

  if (pathname === "/") {
    const defaultLocale = countryDefaults[DEFAULT_COUNTRY] || "en";
    return `/${DEFAULT_COUNTRY}/${defaultLocale}`;
  }

  const countryMatch = pathname.match(/^\/([a-z]{2})$/);
  if (countryMatch && countries.includes(countryMatch[1])) {
    const country = countryMatch[1];
    const locale = countryDefaults[country] || "en";
    return `/${country}/${locale}`;
  }

  const defaultLocale = countryDefaults[DEFAULT_COUNTRY] || "en";
  return `/${DEFAULT_COUNTRY}/${defaultLocale}${pathname}`;
}
