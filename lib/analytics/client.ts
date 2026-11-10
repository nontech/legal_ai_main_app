"use client";

import posthog from "posthog-js";
import { readConsentFromStorage } from "@/lib/consent";
import type { AnalyticsEventName, AnalyticsProperties } from "./events.ts";
import { emailDomain, isUserId, sanitizeProperties } from "./privacy.ts";

type Identity = { id: string; email?: string | null };

let pendingIdentity: Identity | null = null;

function canCapture(): boolean {
  return readConsentFromStorage() === "accepted" && posthog.__loaded;
}

/** Identify with the Supabase user id. Person properties are the email domain only. */
export function identifyUser(user: Identity): void {
  if (!isUserId(user.id)) return;
  pendingIdentity = { id: user.id, email: user.email ?? null };
  if (!canCapture()) return;
  const domain = emailDomain(user.email);
  posthog.identify(user.id, domain ? { email_domain: domain } : {});
}

/** Called after the visitor opts in, so a restored session is identified. */
export function flushPendingIdentity(): void {
  if (pendingIdentity) identifyUser(pendingIdentity);
}

export function resetAnalyticsUser(): void {
  pendingIdentity = null;
  if (posthog.__loaded) posthog.reset();
}

export function trackClientEvent<E extends AnalyticsEventName>(
  event: E,
  properties: AnalyticsProperties[E],
): void {
  if (!canCapture()) return;
  posthog.capture(event, sanitizeProperties(event, properties));
}
