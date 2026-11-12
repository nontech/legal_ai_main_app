import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapWithConcurrency, UPLOAD_CONCURRENCY } from "./uploadPool.ts";

describe("mapWithConcurrency", () => {
  it("keeps result order when later work finishes first", async () => {
    const resolvers: Array<() => void> = [];
    const pending = mapWithConcurrency(["a", "b", "c", "d"], 3, (value) => {
      return new Promise<string>((resolve) => {
        resolvers.push(() => resolve(value));
      });
    });

    await Promise.resolve();
    assert.equal(resolvers.length, 3);

    resolvers[2]();
    resolvers[0]();
    await Promise.resolve();
    assert.equal(resolvers.length, 4);
    resolvers[1]();
    resolvers[3]();

    assert.deepEqual(await pending, ["a", "b", "c", "d"]);
  });

  it("never runs more than the cap at once", async () => {
    let active = 0;
    let peak = 0;
    const resolvers: Array<() => void> = [];

    const pending = mapWithConcurrency([1, 2, 3, 4, 5, 6], UPLOAD_CONCURRENCY, async (value) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise<void>((resolve) => {
        resolvers.push(() => {
          active -= 1;
          resolve();
        });
      });
      return value;
    });

    await Promise.resolve();
    assert.equal(peak, UPLOAD_CONCURRENCY);
    assert.equal(active, UPLOAD_CONCURRENCY);

    while (resolvers.length > 0) {
      const finish = resolvers.shift();
      finish?.();
      await Promise.resolve();
      assert.ok(active <= UPLOAD_CONCURRENCY);
    }

    assert.deepEqual(await pending, [1, 2, 3, 4, 5, 6]);
    assert.equal(active, 0);
  });
});