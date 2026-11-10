/**
 * Product analytics event names and the only properties each event may carry.
 * Values are ids, counts, sizes, enums, durations, and success or error codes.
 * Document text, file names, prompts, and free-text inputs are not properties.
 */

export const AnalyticsEvent = {
  signed_up: "signed_up",
  logged_in: "logged_in",
  logged_out: "logged_out",
  case_created: "case_created",
  document_uploaded: "document_uploaded",
  document_deleted: "document_deleted",
  document_summarized: "document_summarized",
  analysis_started: "analysis_started",
  analysis_completed: "analysis_completed",
  analysis_failed: "analysis_failed",
  game_plan_generated: "game_plan_generated",
  game_plan_failed: "game_plan_failed",
  rate_limit_hit: "rate_limit_hit",
  backend_error: "backend_error",
  cta_clicked: "cta_clicked",
  wizard_step_viewed: "wizard_step_viewed",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export const FILE_CATEGORIES = [
  "case_information",
  "contracts",
  "evidence_and_supporting_materials",
  "relevant_legal_precedents",
  "key_witness_and_testimony",
  "key_witnesses_and_testimony",
  "police_report",
  "potential_challenges_and_weaknesses",
  "unclassified",
  "other",
] as const;

export type FileCategory = (typeof FILE_CATEGORIES)[number];

export const RATE_LIMITS = [
  "anonymous_case",
  "user_case",
  "user_analysis",
  "user_game_plan",
  "unknown",
] as const;

export type RateLimitName = (typeof RATE_LIMITS)[number];

export const BACKEND_ROUTES = [
  "/api/documents/upload",
  "/api/documents/upload-section",
  "/api/documents/delete",
  "/api/documents/summarize",
  "/api/cases/analyze-streaming",
  "/api/game-plan/generate",
  "unknown",
] as const;

export type BackendRoute = (typeof BACKEND_ROUTES)[number];

export const CTA_NAMES = ["pricing", "start_analysis"] as const;
export type CtaName = (typeof CTA_NAMES)[number];

export const CTA_LOCATIONS = [
  "nav",
  "hero",
  "footer",
  "dashboard",
] as const;
export type CtaLocation = (typeof CTA_LOCATIONS)[number];

export const WIZARD_STEPS = [
  "start",
  "new",
  "case_home",
  "jurisdiction",
  "tenancy",
  "role",
  "case_type",
  "case_details",
  "charges",
  "judge",
  "jury",
  "verdict",
  "results",
  "game_plan",
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];

const PATH_STEPS = new Set([
  "jurisdiction",
  "tenancy",
  "role",
  "case-type",
  "case-details",
  "charges",
  "judge",
  "jury",
  "verdict",
  "results",
  "game-plan",
]);

/** Map a case-analysis pathname to a wizard step. Query strings are ignored. */
export function wizardStepFromPath(pathname: string): WizardStep | null {
  const path = pathname.split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") || "/";
  if (/\/case-analysis\/new$/.test(path)) return "new";
  if (/\/case-analysis$/.test(path)) return "start";
  const match = path.match(/\/case-analysis\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) return null;
  const id = match[1];
  const rawStep = match[2];
  if (id === "new") return "new";
  if (!rawStep) return "case_home";
  if (!PATH_STEPS.has(rawStep)) return null;
  return rawStep.replaceAll("-", "_") as WizardStep;
}

export type AnalyticsProperties = {
  signed_up: {
    method: "password";
    linked_case: boolean;
    email_domain?: string;
  };
  logged_in: {
    method: "password";
    linked_case: boolean;
    email_domain?: string;
  };
  logged_out: Record<string, never>;
  case_created: {
    actor: "anonymous" | "user";
    source: "quick_analysis" | "detailed";
  };
  document_uploaded: {
    file_category: FileCategory;
    size_bytes: number;
    mime_type: string;
    success: boolean;
  };
  document_deleted: {
    file_category: FileCategory;
    success: boolean;
  };
  document_summarized: {
    file_category: FileCategory;
    file_count: number;
    success: boolean;
  };
  analysis_started: Record<string, never>;
  analysis_completed: { duration_ms: number };
  analysis_failed: { duration_ms: number; error_code: string };
  game_plan_generated: { duration_ms: number };
  game_plan_failed: { duration_ms: number; error_code: string };
  rate_limit_hit: { limit: RateLimitName };
  backend_error: { route: BackendRoute; status: number };
  cta_clicked: { cta: CtaName; location: CtaLocation };
  wizard_step_viewed: { step: WizardStep };
};
