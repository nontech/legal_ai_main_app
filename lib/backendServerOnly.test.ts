import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

describe("server-only module boundary", () => {
  it("refuses to load the backend entry outside the React server runtime", async () => {
    await assert.rejects(
      () => import("./backend.ts"),
      /cannot be imported from a Client Component module/,
    );
  });

  it("loads the backend entry under the react-server condition", () => {
    const result = spawnSync(
      process.execPath,
      [
        "--conditions=react-server",
        "--experimental-strip-types",
        "--eval",
        "import('./lib/backend.ts').then(() => console.log('loaded')).catch((error) => { console.error(error); process.exit(1); })",
      ],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /loaded/);
  });
});
