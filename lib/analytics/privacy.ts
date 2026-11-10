import {
  BACKEND_ROUTES,
  CTA_LOCATIONS,
  CTA_NAMES,
  FILE_CATEGORIES,
  RATE_LIMITS,
  WIZARD_STEPS,
  type AnalyticsEventName,
  type AnalyticsProperties,
  type BackendRoute,
  type CtaLocation,
  type CtaName,
  type FileCategory,
  type RateLimitName,
  type WizardStep,
} from "./events.ts";

export const EU_INGEST_HOST = "https://eu.i.posthog.com";
export const EU_UI_HOST = "https://eu.posthog.com";
export const EU_ASSET_HOST = "https://eu-assets.i.posthog.com";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DISTINCT_ID = /^[A-Za-z0-9_-]{8,200}$/;
const DOMAIN = /^[a-z0-9.-]+\.[a-z]{2,24}$/;
const ERROR_CODE = /^[a-z0-9_]{1,40}$/;
const HTTP_ERROR = /^http_[1-5][0-9]{2}$/;
const MIME = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/;

const fileCategories = new Set<string>(FILE_CATEGORIES);
const rateLimits = new Set<string>(RATE_LIMITS);
const backendRoutes = new Set<string>(BACKEND_ROUTES);
const ctaNames = new Set<string>(CTA_NAMES);
const ctaLocations = new Set<string>(CTA_LOCATIONS);
const wizardSteps = new Set<string>(WIZARD_STEPS);

function looksLikePlaceholder(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    v === "phc_" ||
    v === "phc_..." ||
    v.includes("your_key_here") ||
    v.includes("<your") ||
    v.includes("paste_your") ||
    v === "placeholder" ||
    v.startsWith("phc_your_")
  );
}

/** Project token (`phc_`). Personal keys (`phx_`) and placeholders are rejected. */
export function readPosthogProjectToken(): string | undefined {
  const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN?.trim();
  const legacy = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const chosen =
    token && !looksLikePlaceholder(token)
      ? token
      : legacy && !looksLikePlaceholder(legacy)
        ? legacy
        : undefined;
  if (!chosen || chosen.startsWith("phx_")) return undefined;
  return chosen;
}

/**
 * Server SDK host. The EU project is the only destination.
 * A leftover US or dashboard host is ignored.
 */
export function readPosthogServerHost(): string {
  return EU_INGEST_HOST;
}

export function isUserId(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** Supabase user id, or a PostHog distinct id. Anything else becomes "anonymous". */
export function safeDistinctId(value: string | null | undefined): string {
  if (typeof value === "string" && DISTINCT_ID.test(value)) return value;
  return "anonymous";
}

/** Domain only. The local part of an email is never returned. */
export function emailDomain(
  email: string | null | undefined,
): string | undefined {
  if (!email) return undefined;
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return undefined;
  const domain = email.slice(at + 1).trim().toLowerCase();
  if (!DOMAIN.test(domain) || domain.length > 80) return undefined;
  return domain;
}

export function stripUrl(value: string): string {
  const withoutHash = value.split("#")[0] ?? value;
  const query = withoutHash.indexOf("?");
  return query === -1 ? withoutHash : withoutHash.slice(0, query);
}

export function distinctIdFromCookieHeader(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const name = trimmed.slice(0, eq);
    if (!name.startsWith("ph_") || !name.endsWith("_posthog")) continue;
    const raw = trimmed.slice(eq + 1);
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      decoded = raw;
    }
    try {
      const parsed = JSON.parse(decoded) as { distinct_id?: unknown };
      if (
        typeof parsed.distinct_id === "string" &&
        DISTINCT_ID.test(parsed.distinct_id)
      ) {
        return parsed.distinct_id;
      }
    } catch {
      continue;
    }
  }
  return null;
}

export function normalizeFileCategory(value: unknown): FileCategory {
  return typeof value === "string" && fileCategories.has(value)
    ? (value as FileCategory)
    : "other";
}

export function normalizeMime(value: unknown): string {
  if (typeof value !== "string") return "unknown";
  const mime = value.toLowerCase().split(";")[0]?.trim() ?? "";
  if (!mime || mime.length > 80 || !MIME.test(mime)) return "unknown";
  return mime;
}

export function normalizeCount(value: unknown, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), max);
}

export function normalizeErrorCode(value: unknown): string {
  if (typeof value !== "string") return "unknown";
  const code = value.trim().toLowerCase();
  if (HTTP_ERROR.test(code) || ERROR_CODE.test(code)) return code;
  return "unknown";
}

function enumValue<T extends string>(
  value: unknown,
  allowed: Set<string>,
): T | undefined {
  return typeof value === "string" && allowed.has(value)
    ? (value as T)
    : undefined;
}

function compact(
  props: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

/** Keep only the allowlisted properties for an event. Everything else is dropped. */
export function sanitizeProperties<E extends AnalyticsEventName>(
  event: E,
  properties: AnalyticsProperties[E] | Record<string, unknown>,
): Record<string, string | number | boolean> {
  const input = (properties ?? {}) as Record<string, unknown>;
  switch (event) {
    case "signed_up":
    case "logged_in":
      return compact({
        method: "password",
        linked_case: input.linked_case === true,
        email_domain:
          typeof input.email_domain === "string"
            ? emailDomain(`user@${input.email_domain}`)
            : undefined,
      });
    case "logged_out":
    case "analysis_started":
      return {};
    case "case_created":
      return compact({
        actor: input.actor === "user" ? "user" : "anonymous",
        source:
          input.source === "detailed" ? "detailed" : "quick_analysis",
      });
    case "document_uploaded":
      return {
        file_category: normalizeFileCategory(input.file_category),
        size_bytes: normalizeCount(input.size_bytes, 2_000_000_000),
        mime_type: normalizeMime(input.mime_type),
        success: input.success === true,
      };
    case "document_deleted":
      return {
        file_category: normalizeFileCategory(input.file_category),
        success: input.success === true,
      };
    case "document_summarized":
      return {
        file_category: normalizeFileCategory(input.file_category),
        file_count: normalizeCount(input.file_count, 100),
        success: input.success === true,
      };
    case "analysis_completed":
    case "game_plan_generated":
      return { duration_ms: normalizeCount(input.duration_ms, 3_600_000) };
    case "analysis_failed":
    case "game_plan_failed":
      return {
        duration_ms: normalizeCount(input.duration_ms, 3_600_000),
        error_code: normalizeErrorCode(input.error_code),
      };
    case "rate_limit_hit":
      return {
        limit: enumValue<RateLimitName>(input.limit, rateLimits) ?? "unknown",
      };
    case "backend_error":
      return {
        route: enumValue<BackendRoute>(input.route, backendRoutes) ?? "unknown",
        status: (() => {
          const status = normalizeCount(input.status, 599);
          return status >= 100 ? status : 0;
        })(),
      };
    case "cta_clicked":
      return compact({
        cta: enumValue<CtaName>(input.cta, ctaNames),
        location: enumValue<CtaLocation>(input.location, ctaLocations),
      });
    case "wizard_step_viewed":
      return compact({
        step: enumValue<WizardStep>(input.step, wizardSteps),
      });
    default:
      return {};
  }
}

const URL_KEYS = new Set([
  "$current_url",
  "$pathname",
  "$referrer",
  "$initial_current_url",
  "$initial_referrer",
]);

const PII_KEYS = new Set([
  "email",
  "$email",
  "name",
  "$name",
  "first_name",
  "last_name",
  "phone",
  "file_name",
  "filename",
  "file_names",
  "prompt",
  "content",
  "summary",
  "case_text",
  "$el_text",
]);

function scrubBag(props: Record<string, unknown> | undefined, person: boolean) {
  if (!props) return;
  if (Array.isArray(props.$exception_list)) {
    for (const item of props.$exception_list) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      if ("value" in record) record.value = "[redacted]";
    }
  }
  if (typeof props.$exception_message === "string") {
    props.$exception_message = "[redacted]";
  }
  for (const key of Object.keys(props)) {
    if (PII_KEYS.has(key)) {
      delete props[key];
      continue;
    }
    const value = props[key];
    if (typeof value !== "string") continue;
    if (URL_KEYS.has(key) || key.includes("url") || key.includes("referrer")) {
      props[key] = stripUrl(value);
      continue;
    }
    if (key === "email_domain") {
      const domain = emailDomain(`user@${value}`);
      if (domain) props[key] = domain;
      else delete props[key];
      continue;
    }
    if (value.includes("@") || (person && key !== "email_domain")) {
      if (value.includes("@")) props[key] = "[redacted]";
    }
    if (typeof props[key] === "string" && (props[key] as string).length > 180 && !URL_KEYS.has(key)) {
      props[key] = "[redacted]";
    }
  }
}

/** Last-line scrub for autocapture, pageviews, and exception events. */
export function redactBrowserCapture<
  T extends {
    properties?: Record<string, unknown>;
    $set?: Record<string, unknown>;
    $set_once?: Record<string, unknown>;
  } | null,
>(event: T): T {
  if (!event) return event;
  scrubBag(event.properties, false);
  scrubBag(event.$set, true);
  scrubBag(event.$set_once, true);
  return event;
}
