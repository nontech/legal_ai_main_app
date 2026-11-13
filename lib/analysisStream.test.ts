import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ANALYSIS_IDLE_ABORT_MS,
  ANALYSIS_IDLE_NOTE_MS,
  ANALYSIS_PING_FRAME,
  ANALYSIS_PIPELINE_STEP_ORDER,
  ANALYSIS_TOO_LONG_MESSAGE,
  analysisDurationExceeded,
  analysisErrorFrame,
  interpretSseBlock,
  monotonicAnalysisProgress,
  takeCompleteSseEvents,
} from "./analysisStream.ts";

describe("analysis SSE proxy", () => {
  it("turns keepalive comments into a ping frame", () => {
    const split = takeCompleteSseEvents(": keepalive\n\n");
    assert.deepEqual(split.events, [": keepalive"]);
    assert.deepEqual(interpretSseBlock(split.events[0]), [
      { action: "ping", frame: ANALYSIS_PING_FRAME },
    ]);
    assert.equal(ANALYSIS_PING_FRAME, 'data: {"type":"ping"}\n\n');
  });

  it("passes a backend ping data event through", () => {
    const raw = 'data: {"type":"ping","seq":2}';
    const [action] = interpretSseBlock(raw);
    assert.equal(action.action, "ping");
    if (action.action !== "ping") return;
    assert.equal(action.frame, `${raw}\n\n`);
  });

  it("forwards a normal data event and keeps the complete result", () => {
    const raw = 'data: {"type":"complete","result":{"ok":true}}';
    const [action] = interpretSseBlock(raw);
    assert.equal(action.action, "event");
    if (action.action !== "event") return;
    assert.equal(action.type, "complete");
    assert.deepEqual(action.result, { ok: true });
    assert.equal(action.frame, `${raw}\n\n`);
  });

  it("emits the timeout error only inside the last 15s without a complete event", () => {
    assert.equal(analysisDurationExceeded(0, 284_999, false), false);
    assert.equal(analysisDurationExceeded(0, 285_000, false), true);
    assert.equal(analysisDurationExceeded(0, 299_000, true), false);
    assert.match(analysisErrorFrame(ANALYSIS_TOO_LONG_MESSAGE), /please retry/);
  });
});

describe("analysis progress", () => {
  it("lists charges analysis before entity relationships", () => {
    const charges = ANALYSIS_PIPELINE_STEP_ORDER.indexOf("charges_analysis");
    const entities = ANALYSIS_PIPELINE_STEP_ORDER.indexOf("entity_relationships");
    assert.ok(charges !== -1 && entities !== -1 && charges < entities);
  });

  it("never decreases progress", () => {
    const total = ANALYSIS_PIPELINE_STEP_ORDER.filter((step) => step !== "finalization").length;
    const charges = ANALYSIS_PIPELINE_STEP_ORDER.filter((step) => step !== "finalization").indexOf(
      "charges_analysis",
    );
    const entities = ANALYSIS_PIPELINE_STEP_ORDER.filter((step) => step !== "finalization").indexOf(
      "entity_relationships",
    );
    const afterCharges = monotonicAnalysisProgress(0, charges, total);
    const afterEarlierStep = monotonicAnalysisProgress(afterCharges, 0, total);
    const afterEntities = monotonicAnalysisProgress(afterCharges, entities, total);
    assert.equal(afterEarlierStep, afterCharges);
    assert.ok(afterEntities > afterCharges);
  });

  it("uses a 45s note and a 120s abort", () => {
    assert.equal(ANALYSIS_IDLE_NOTE_MS, 45_000);
    assert.equal(ANALYSIS_IDLE_ABORT_MS, 120_000);
    assert.ok(ANALYSIS_IDLE_NOTE_MS < ANALYSIS_IDLE_ABORT_MS);
  });
});
