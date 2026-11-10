import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import nextConfig from "./next.config.ts";
import { localeRedirectPath } from "./lib/localeMiddleware.ts";

describe("locale middleware", () => {
  it("does not prefix the PostHog proxy", () => {
    assert.equal(localeRedirectPath("/ingest"), null);
    assert.equal(localeRedirectPath("/ingest/flags/"), null);
    assert.equal(localeRedirectPath("/ingest/static/array.js"), null);
  });

  it("still prefixes pages and country-only paths", () => {
    assert.equal(localeRedirectPath("/"), "/us/en");
    assert.equal(localeRedirectPath("/pricing"), "/us/en/pricing");
    assert.equal(localeRedirectPath("/de"), "/de/de");
    assert.equal(localeRedirectPath("/us/en/pricing"), null);
    assert.equal(localeRedirectPath("/api/auth/signin"), null);
    assert.equal(localeRedirectPath("/admin"), null);
  });

  it("excludes /ingest from the middleware matcher", () => {
    const source = readFileSync(new URL("./middleware.ts", import.meta.url), "utf8");
    assert.match(source, /matcher:\s*\[[\s\S]*ingest/);
    assert.match(source, /\(\?!api\|ingest\|_next\|_vercel/);
  });
});

describe("PostHog rewrites", () => {
  it("proxies /ingest before locale pages and keeps trailing slashes", async () => {
    assert.equal(nextConfig.skipTrailingSlashRedirect, true);
    const rewrites = await nextConfig.rewrites?.();
    assert.ok(rewrites && !Array.isArray(rewrites));
    const before =
      rewrites && !Array.isArray(rewrites) ? rewrites.beforeFiles ?? [] : [];
    assert.deepEqual(
      before.map((rule) => ("source" in rule ? rule.source : "")),
      ["/ingest/static/:path*", "/ingest/:path*"],
    );
    assert.equal(
      before[0] && "destination" in before[0] ? before[0].destination : "",
      "https://eu-assets.i.posthog.com/static/:path*",
    );
    assert.equal(
      before[1] && "destination" in before[1] ? before[1].destination : "",
      "https://eu.i.posthog.com/:path*",
    );
  });
});
