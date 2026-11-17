import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { localeRedirectPath } from "../localeMiddleware.ts";
import { seoPublicPath, seoRewritePath } from "./routes.ts";
import {
  GERMAN_HOME_SEO,
  TENANCY_GUIDES,
  tenancyMetadata,
} from "./tenancyGuides.ts";

function words(value: string): string[] {
  return value
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

describe("tenancy guide SEO", () => {
  it("keeps titles, descriptions, FAQs and lead keywords within the on-page rules", () => {
    assert.equal(TENANCY_GUIDES.length, 8);
    for (const guide of TENANCY_GUIDES) {
      assert.ok(guide.title.length <= 60, guide.title);
      assert.ok(guide.title.endsWith("| TheLawThing"), guide.title);
      assert.ok(guide.description.length <= 155, `${guide.description} (${guide.description.length})`);
      assert.ok(guide.faqs.length >= 4 && guide.faqs.length <= 6, guide.route.slug);
      assert.equal(guide.h1.length > 0, true);

      const lead = words(guide.intro.join(" ")).slice(0, 100).join(" ");
      for (const keyword of guide.leadKeywords) {
        assert.ok(lead.includes(keyword), `${guide.route.slug} missing “${keyword}”`);
      }

      const anchors = guide.related.map((item) => item.label.toLowerCase()).join(" ");
      assert.equal(anchors.includes("hier klicken"), false);
      assert.equal(anchors.includes("click here"), false);

      const meta = tenancyMetadata(guide);
      assert.equal(meta.robots.index, true);
      assert.equal(meta.alternates.canonical.endsWith(guide.route.publicPath), true);
      assert.match(meta.alternates.languages.de, /^https:\/\/www\.thelawthing\.com\//);
      assert.match(meta.alternates.languages.en, /^https:\/\/www\.thelawthing\.com\//);
      assert.match(meta.alternates.languages["x-default"], /^https:\/\/www\.thelawthing\.com\//);
    }
  });

  it("publishes the keyword slugs and rewrites them onto the country locale", () => {
    assert.deepEqual(
      TENANCY_GUIDES.map((guide) => guide.route.publicPath),
      [
        "/de/eigenbedarfskuendigung",
        "/de/mietpreisbremse",
        "/de/mietkaution",
        "/de/nebenkostenabrechnung",
        "/de/mietminderung",
        "/de/mieterschutzverein-alternative",
        "/de/klage-amtsgericht-mietrecht",
        "/en/germany-tenant-rights",
      ],
    );
    assert.equal(
      seoRewritePath("/de/eigenbedarfskuendigung/"),
      "/de/de/eigenbedarfskuendigung",
    );
    assert.equal(
      seoRewritePath("/en/germany-tenant-rights"),
      "/de/en/germany-tenant-rights",
    );
    assert.equal(localeRedirectPath("/de/eigenbedarfskuendigung"), null);
    assert.equal(
      localeRedirectPath("/de/de/eigenbedarfskuendigung"),
      "/de/eigenbedarfskuendigung",
    );
    assert.equal(
      seoPublicPath("/de/en/germany-tenant-rights"),
      "/en/germany-tenant-rights",
    );
    assert.equal(localeRedirectPath("/de"), "/de/de");
    assert.equal(localeRedirectPath("/pricing"), "/us/en/pricing");
  });

  it("puts the German homepage keywords in the hero copy", () => {
    assert.ok(GERMAN_HOME_SEO.title.length <= 60);
    assert.ok(GERMAN_HOME_SEO.description.length <= 155);
    const messages = JSON.parse(
      readFileSync(new URL("../../messages/de.json", import.meta.url), "utf8"),
    ) as { heroV2: { headline: string; subheadline: string } };
    const h1 = words(messages.heroV2.headline).join(" ");
    assert.equal(h1, GERMAN_HOME_SEO.h1);
    const lead = words(messages.heroV2.subheadline).slice(0, 100).join(" ");
    for (const keyword of GERMAN_HOME_SEO.leadKeywords) {
      assert.ok(lead.includes(keyword), keyword);
    }
    assert.ok(GERMAN_HOME_SEO.faqs.length >= 4 && GERMAN_HOME_SEO.faqs.length <= 6);
  });
});
