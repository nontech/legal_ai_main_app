import { PROXY_MAX_DURATION_SECONDS } from "./proxyDuration.ts";

/** Backend SSE comments (`: keepalive`) are rewritten to this frame. */
export const ANALYSIS_PING_FRAME = 'data: {"type":"ping"}\n\n';

export const ANALYSIS_TOO_LONG_MESSAGE =
  "Analysis is taking too long, please retry";

/** Emit the timeout error this long before the function's maxDuration. */
export const ANALYSIS_DEADLINE_MARGIN_MS = 15_000;

/** Show a quiet note when the browser has seen no SSE events for this long. */
export const ANALYSIS_IDLE_NOTE_MS = 45_000;

/** Abort the reader when the browser has seen no SSE events for this long. */
export const ANALYSIS_IDLE_ABORT_MS = 120_000;

/**
 * Backend emits charges analysis before the entity graph. Progress uses this
 * order so a later step cannot paint an earlier percentage.
 */
export const ANALYSIS_PIPELINE_STEP_ORDER = [
  "status",
  "charges_analysis",
  "entity_relationships",
  "precedent_retrieval",
  "outcome_prediction",
  "factors_analysis",
  "legal_assessment",
  "strategic_recommendations",
  "executive_summary",
  "finalization",
] as const;

export function analysisProxyDeadlineMs(
  maxDurationSeconds: number = PROXY_MAX_DURATION_SECONDS,
): number {
  return maxDurationSeconds * 1000 - ANALYSIS_DEADLINE_MARGIN_MS;
}

export function analysisDurationExceeded(
  startedAtMs: number,
  nowMs: number,
  sawComplete: boolean,
  maxDurationSeconds: number = PROXY_MAX_DURATION_SECONDS,
): boolean {
  if (sawComplete) return false;
  return nowMs - startedAtMs >= analysisProxyDeadlineMs(maxDurationSeconds);
}

export type SseAction =
  | { action: "ping"; frame: string }
  | { action: "event"; frame: string; type?: string; result?: unknown }
  | { action: "ignore" };

/** Split a byte buffer into complete SSE blocks, keeping a partial tail. */
export function takeCompleteSseEvents(buffer: string): {
  events: string[];
  rest: string;
} {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  return { events: parts, rest };
}

/**
 * Turn one SSE block into frames for the browser.
 * Comment lines (including `: keepalive`) become a ping. A `data` ping is
 * forwarded unchanged. Other `data` lines are forwarded unchanged.
 */
export function interpretSseBlock(block: string): SseAction[] {
  const actions: SseAction[] = [];
  for (const rawLine of block.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (!line || line.startsWith("event:") || line.startsWith("id:")) continue;
    if (line.startsWith(":")) {
      actions.push({ action: "ping", frame: ANALYSIS_PING_FRAME });
      continue;
    }
    if (!line.startsWith("data:")) continue;
    const data = line.slice(5).replace(/^ /, "");
    if (!data.trim()) continue;
    let parsed: { type?: string; result?: unknown };
    try {
      parsed = JSON.parse(data) as { type?: string; result?: unknown };
    } catch {
      actions.push({ action: "ignore" });
      continue;
    }
    const frame = `data: ${data}\n\n`;
    if (parsed.type === "ping") {
      actions.push({ action: "ping", frame });
      continue;
    }
    actions.push({
      action: "event",
      frame,
      type: parsed.type,
      result: parsed.type === "complete" ? parsed.result : undefined,
    });
  }
  return actions;
}

export function analysisErrorFrame(message: string): string {
  return `data: ${JSON.stringify({ type: "error", message })}\n\n`;
}

/** Progress for a pipeline step. Never returns a value lower than `current`. */
export function monotonicAnalysisProgress(
  current: number,
  stepIndex: number,
  totalSteps: number,
): number {
  if (stepIndex < 0 || totalSteps <= 0) return current;
  const next = Math.min(Math.round(((stepIndex + 1) / totalSteps) * 100), 99);
  return Math.max(current, next);
}
