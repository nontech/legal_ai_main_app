export const SITE_ORIGIN = "https://www.thelawthing.com";

export type SeoRoute = {
  slug: string;
  country: "de";
  locale: "de" | "en";
  publicPath: string;
  internalPath: string;
  navLabel: string;
};

/** Public keyword URLs, rendered inside the existing /de/{locale} tree. */
export const SEO_ROUTES: readonly SeoRoute[] = [
  {
    slug: "eigenbedarfskuendigung",
    country: "de",
    locale: "de",
    publicPath: "/de/eigenbedarfskuendigung",
    internalPath: "/de/de/eigenbedarfskuendigung",
    navLabel: "Eigenbedarfskündigung prüfen",
  },
  {
    slug: "mietpreisbremse",
    country: "de",
    locale: "de",
    publicPath: "/de/mietpreisbremse",
    internalPath: "/de/de/mietpreisbremse",
    navLabel: "Mietpreisbremse prüfen",
  },
  {
    slug: "mietkaution",
    country: "de",
    locale: "de",
    publicPath: "/de/mietkaution",
    internalPath: "/de/de/mietkaution",
    navLabel: "Mietkaution zurückfordern",
  },
  {
    slug: "nebenkostenabrechnung",
    country: "de",
    locale: "de",
    publicPath: "/de/nebenkostenabrechnung",
    internalPath: "/de/de/nebenkostenabrechnung",
    navLabel: "Nebenkostenabrechnung prüfen",
  },
  {
    slug: "mietminderung",
    country: "de",
    locale: "de",
    publicPath: "/de/mietminderung",
    internalPath: "/de/de/mietminderung",
    navLabel: "Mietminderung einordnen",
  },
  {
    slug: "mieterschutzverein-alternative",
    country: "de",
    locale: "de",
    publicPath: "/de/mieterschutzverein-alternative",
    internalPath: "/de/de/mieterschutzverein-alternative",
    navLabel: "Mieterschutzbund Alternative",
  },
  {
    slug: "klage-amtsgericht-mietrecht",
    country: "de",
    locale: "de",
    publicPath: "/de/klage-amtsgericht-mietrecht",
    internalPath: "/de/de/klage-amtsgericht-mietrecht",
    navLabel: "Klage beim Amtsgericht Mietrecht",
  },
  {
    slug: "germany-tenant-rights",
    country: "de",
    locale: "en",
    publicPath: "/en/germany-tenant-rights",
    internalPath: "/de/en/germany-tenant-rights",
    navLabel: "Tenant rights Germany",
  },
] as const;

export const GERMAN_HOME_PATH = "/de/de";
export const ENGLISH_HOME_PATH = "/de/en";
export const ENGLISH_HUB_PATH = "/en/germany-tenant-rights";

export const CASE_ANALYSIS_DE = "/de/de/case-analysis";
export const CASE_ANALYSIS_EN = "/de/en/case-analysis";

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}

export function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return normalizePathname(pathname.slice(0, -1));
  }
  return pathname;
}

export function seoRewritePath(pathname: string): string | null {
  const path = normalizePathname(pathname);
  return SEO_ROUTES.find((route) => route.publicPath === path)?.internalPath ?? null;
}

export function seoPublicPath(pathname: string): string | null {
  const path = normalizePathname(pathname);
  return SEO_ROUTES.find((route) => route.internalPath === path)?.publicPath ?? null;
}

export function hreflangLanguages(dePath: string, enPath: string, xDefaultPath: string) {
  return {
    de: absoluteUrl(dePath),
    en: absoluteUrl(enPath),
    "x-default": absoluteUrl(xDefaultPath),
  };
}
