"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CONSENT_EVENT, readConsentFromStorage } from "@/lib/consent";
import PostHogDevTestButton from "@/app/components/PostHogDevTestButton";

/** Tutorial / template values — never use these as the resolved API key. */
function looksLikePosthogPlaceholder(value: string): boolean {
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

/**
 * Project API key for the browser SDK.
 * Prefers `NEXT_PUBLIC_POSTHOG_TOKEN` (PostHog Next.js docs), then `NEXT_PUBLIC_POSTHOG_KEY`.
 * Ignores obvious KEY placeholders so a leftover `phc_YOUR_KEY_HERE` cannot override a real TOKEN.
 * @see https://posthog.com/docs/libraries/next-js
 */
function getPosthogProjectApiKey(): string | undefined {
  const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN?.trim() || undefined;
  const keyVar = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || undefined;

  if (token && !looksLikePosthogPlaceholder(token)) {
    return token;
  }
  if (keyVar && !looksLikePosthogPlaceholder(keyVar)) {
    return keyVar;
  }
  // Do not fall back to token/key if they failed placeholder checks — that used to
  // return phc_YOUR_KEY_HERE and block init with a confusing "placeholder" warning.
  return undefined;
}

/**
 * Browser SDK must use the **Project API key** (`phc_…`), not a Personal API key (`phx_…`).
 * Wrong type → 401 "invalid or has expired" and broken remote config (404-style failures).
 */
function isPersonalApiKey(apiKey: string): boolean {
  return apiKey.startsWith("phx_");
}

/**
 * PostHog Cloud **ingestion** host must be `*.i.posthog.com`, not the dashboard
 * URL (`eu.posthog.com` / `us.posthog.com`). Wrong host → 404 "not_found" from the SDK.
 * @see https://posthog.com/docs/libraries/next-js
 */
function getPosthogApiHost(): string {
  const raw = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim().replace(/\/$/, "");
  if (!raw) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[PostHog] NEXT_PUBLIC_POSTHOG_HOST unset — using US ingestion (https://us.i.posthog.com). EU projects must set https://eu.i.posthog.com or you may see 404.",
      );
    }
    return "https://us.i.posthog.com";
  }
  // Common misconfiguration: UI / account domain instead of ingestion API
  if (raw === "https://eu.posthog.com" || raw === "http://eu.posthog.com") {
    return "https://eu.i.posthog.com";
  }
  if (raw === "https://us.posthog.com" || raw === "http://us.posthog.com") {
    return "https://us.i.posthog.com";
  }
  if (raw === "https://app.posthog.com" || raw === "http://app.posthog.com") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[PostHog] NEXT_PUBLIC_POSTHOG_HOST is set to app.posthog.com — use https://us.i.posthog.com or https://eu.i.posthog.com instead.",
      );
    }
    return "https://us.i.posthog.com";
  }
  return raw;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      const url =
        window.location.origin +
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const init = () => {
      const apiKey = getPosthogProjectApiKey();
      if (!apiKey) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[PostHog] No usable project token — set NEXT_PUBLIC_POSTHOG_TOKEN=phc_… in .env or .env.local, remove any placeholder NEXT_PUBLIC_POSTHOG_KEY, restart `pnpm dev`, then accept cookies again.",
          );
        }
        return;
      }

      if (isPersonalApiKey(apiKey)) {
        console.error(
          "[PostHog] You are using a Personal API key (phx_…). The browser SDK requires the Project API key (phc_…): PostHog → Project settings → Project API key. Personal keys cause 401 and remote config errors.",
        );
        return;
      }

      if (
        process.env.NODE_ENV === "development" &&
        !apiKey.startsWith("phc_")
      ) {
        console.warn(
          "[PostHog] Project API keys usually start with phc_. If you see 401, copy the key again from PostHog → Project settings (and match EU vs US host).",
        );
      }

      if (!posthog.__loaded) {
        const apiHost = getPosthogApiHost();
        if (process.env.NODE_ENV === "development") {
          console.info("[PostHog] api_host:", apiHost);
        }
        posthog.init(apiKey, {
          api_host: apiHost,
          defaults: "2026-01-30",
          capture_pageview: false,
          person_profiles: "identified_only",
          disable_session_recording: false,
          debug: process.env.NODE_ENV === "development",
          // Session replay loads recorder.js asynchronously; starting capture here avoids
          // racing init() + immediate startSessionRecording() (see PostHog replay troubleshooting).
          loaded: (ph) => {
            if (readConsentFromStorage() !== "accepted") return;
            ph.opt_in_capturing();
            if (typeof ph.startSessionRecording === "function") {
              ph.startSessionRecording();
            }
          },
        });
      }
    };

    const handleConsent = () => {
      const consent = readConsentFromStorage();
      if (consent === "accepted") {
        init();
        if (!posthog.__loaded) return;
        posthog.opt_in_capturing();
        if (typeof posthog.startSessionRecording === "function") {
          posthog.startSessionRecording();
        }
      } else if (consent === "declined") {
        if (posthog.__loaded) posthog.opt_out_capturing();
      }
    };

    handleConsent();
    window.addEventListener(CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(CONSENT_EVENT, handleConsent);
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      <PostHogDevTestButton />
      {children}
    </PHProvider>
  );
}
