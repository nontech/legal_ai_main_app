import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isShareToken, sharePath, toSharedCaseView } from "./caseShare.ts";

describe("share tokens", () => {
  it("accepts a uuid and rejects anything else", () => {
    assert.equal(isShareToken("3f1c2a90-7b34-4d2e-8a11-9c0b6e5d4a32"), true);
    assert.equal(isShareToken("3F1C2A90-7B34-4D2E-8A11-9C0B6E5D4A32"), true);
    assert.equal(isShareToken(""), false);
    assert.equal(isShareToken("not-a-uuid"), false);
    assert.equal(isShareToken("3f1c2a90-7b34-4d2e-8a11-9c0b6e5d4a32-extra"), false);
  });

  it("builds a public path and does not include the case id", () => {
    const token = "3f1c2a90-7b34-4d2e-8a11-9c0b6e5d4a32";
    assert.equal(sharePath(token), `/share/${token}`);
  });
});

describe("shared case view", () => {
  it("keeps display fields and drops owner, token, and file addresses", () => {
    const blob = "https://storage.googleapis.com/bucket/secret.pdf";
    const view = toSharedCaseView({
      owner_id: "user-1",
      share_token: "3f1c2a90-7b34-4d2e-8a11-9c0b6e5d4a32",
      case_type: "civil",
      role: "plaintiff",
      jurisdiction: {
        city: "Berlin",
        state: "BE",
        country: "DE",
        court: "Amtsgericht",
        file_url: blob,
      },
      case_details: {
        case_information: { caseName: "Smith v Jones" },
        evidence_and_supporting_materials: {
          files: [{ name: "lease.pdf", address: blob }],
        },
      },
      result: { predicted_outcome: { win_probability: 0.42 } },
      game_plan: { opening: { opening_statement: { core_theme: "Theme" } } },
    } as Parameters<typeof toSharedCaseView>[0]);

    assert.deepEqual(Object.keys(view).sort(), [
      "case_type",
      "game_plan",
      "jurisdiction",
      "result",
      "role",
      "title",
    ]);
    assert.equal(view.title, "Smith v Jones");
    assert.equal(view.jurisdiction?.court, "Amtsgericht");
    assert.equal("file_url" in (view.jurisdiction ?? {}), false);
    const serialized = JSON.stringify(view);
    assert.equal(serialized.includes(blob), false);
    assert.equal(serialized.includes("user-1"), false);
    assert.equal(serialized.includes("3f1c2a90-7b34-4d2e-8a11-9c0b6e5d4a32"), false);
    assert.equal(serialized.includes("lease.pdf"), false);
  });
});
