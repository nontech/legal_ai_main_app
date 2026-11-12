import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  PROXY_MAX_DURATION_SECONDS,
  PROXY_ROUTES,
  PROXY_RUNTIME,
} from "./proxyDuration.ts";

describe("proxy route duration", () => {
  it("caps every long proxy at the Hobby maximum and the nodejs runtime", () => {
    assert.equal(PROXY_MAX_DURATION_SECONDS, 300);
    for (const route of PROXY_ROUTES) {
      const source = readFileSync(new URL(`../${route}`, import.meta.url), "utf8");
      assert.match(
        source,
        new RegExp(`export const maxDuration = ${PROXY_MAX_DURATION_SECONDS};`),
        route,
      );
      assert.match(source, new RegExp(`export const runtime = "${PROXY_RUNTIME}";`), route);
    }
  });
});
