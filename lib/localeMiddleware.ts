import { COUNTRIES, DEFAULT_COUNTRY } from "../i18n/routing.ts";
import { normalizePathname, seoPublicPath, seoRewritePath } from "./seo/routes.ts";

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
  const path = normalizePathname(pathname);
  if (seoRewritePath(path)) return null;
  const canonicalSeoPath = seoPublicPath(path);
  if (canonicalSeoPath) return canonicalSeoPath;

  if (
    path.startsWith("/api") ||
    path === "/ingest" ||
    path.startsWith("/ingest/") ||
    path.startsWith("/_next") ||
    path.startsWith("/_vercel") ||
    path.startsWith("/admin") ||
    path === "/share" ||
    path.startsWith("/share/") ||
    path.includes(".")
  ) {
    return null;
  }

  const pathnameHasCountryLocale = countries.some((country) =>
    locales.some(
      (locale) =>
        path.startsWith(`/${country}/${locale}/`) ||
        path === `/${country}/${locale}`,
    ),
  );
  if (pathnameHasCountryLocale) return null;

  if (path === "/") {
    const defaultLocale = countryDefaults[DEFAULT_COUNTRY] || "en";
    return `/${DEFAULT_COUNTRY}/${defaultLocale}`;
  }

  const countryMatch = path.match(/^\/([a-z]{2})$/);
  if (countryMatch && countries.includes(countryMatch[1])) {
    const country = countryMatch[1];
    const locale = countryDefaults[country] || "en";
    return `/${country}/${locale}`;
  }

  const defaultLocale = countryDefaults[DEFAULT_COUNTRY] || "en";
  return `/${DEFAULT_COUNTRY}/${defaultLocale}${path}`;
}
