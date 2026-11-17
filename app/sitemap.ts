import type { MetadataRoute } from "next";
import { ENGLISH_HOME_PATH, GERMAN_HOME_PATH, SEO_ROUTES, SITE_ORIGIN } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-17");
  return [
    {
      url: `${SITE_ORIGIN}${GERMAN_HOME_PATH}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_ORIGIN}${ENGLISH_HOME_PATH}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SEO_ROUTES.map((route) => ({
      url: `${SITE_ORIGIN}${route.publicPath}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
