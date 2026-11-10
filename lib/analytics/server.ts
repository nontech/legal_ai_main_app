import "server-only";
import { PostHog } from "posthog-node";
import type { AnalyticsEventName, AnalyticsProperties } from "./events.ts";
import {
  distinctIdFromCookieHeader,
  emailDomain,
  isUserId,
  normalizeFileCategory,
  readPosthogProjectToken,
  readPosthogServerHost,
  safeDistinctId,
  sanitizeProperties,
} from "./privacy.ts";

let client: PostHog | null = null;
let clientToken: string | undefined;

function getClient(): PostHog | null {
  const token = readPosthogProjectToken();
  if (!token) return null;
  if (!client || clientToken !== token) {
    client = new PostHog(token, {
      host: readPosthogServerHost(),
      flushAt: 1,
      flushInterval: 0,
    });
    clientToken = token;
  }
  return client;
}

async function flush(ph: PostHog): Promise<void> {
  await Promise.race([
    ph.flush(),
    new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    }),
  ]);
}

export function distinctIdFromRequest(
  request: Request,
  userId?: string | null,
): string {
  if (isUserId(userId)) return userId;
  return distinctIdFromCookieHeader(request.headers.get("cookie")) ?? "anonymous";
}

export async function captureServerEvent<E extends AnalyticsEventName>(
  distinctId: string,
  event: E,
  properties: AnalyticsProperties[E],
): Promise<void> {
  try {
    const ph = getClient();
    if (!ph) return;
    ph.capture({
      distinctId: safeDistinctId(distinctId),
      event,
      properties: sanitizeProperties(event, properties),
      disableGeoip: true,
    });
    await flush(ph);
  } catch {
    console.error("[analytics] capture failed");
  }
}

/** Person properties are the email domain only. Full emails and names are not set. */
export async function identifyServerUser(
  userId: string,
  email?: string | null,
): Promise<void> {
  try {
    const ph = getClient();
    if (!ph || !isUserId(userId)) return;
    const domain = emailDomain(email);
    ph.identify({
      distinctId: userId,
      properties: domain ? { email_domain: domain } : {},
      disableGeoip: true,
    });
    await flush(ph);
  } catch {
    console.error("[analytics] identify failed");
  }
}

export async function captureDocumentUploads(args: {
  request: Request;
  userId: string | null;
  files: Array<{ size: number; type: string }>;
  fileCategory: string;
  success: boolean;
  route?: AnalyticsProperties["backend_error"]["route"];
  status?: number;
}): Promise<void> {
  const distinctId = distinctIdFromRequest(args.request, args.userId);
  const files = args.files.slice(0, 20);
  for (const file of files) {
    await captureServerEvent(distinctId, "document_uploaded", {
      file_category: normalizeFileCategory(args.fileCategory),
      size_bytes: file.size,
      mime_type: file.type,
      success: args.success,
    });
  }
  if (!args.success && args.route && typeof args.status === "number") {
    await captureServerEvent(distinctId, "backend_error", {
      route: args.route,
      status: args.status,
    });
  }
}
