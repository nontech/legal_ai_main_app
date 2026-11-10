"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense, useRef } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, readConsentFromStorage } from "@/lib/consent";
import PostHogDevTestButton from "@/app/components/PostHogDevTestButton";
import { wizardStepFromPath } from "@/lib/analytics/events";
import { flushPendingIdentity, trackClientEvent } from "@/lib/analytics/client";
import {
  EU_UI_HOST,
  readPosthogProjectToken,
  redactBrowserCapture,
} from "@/lib/analytics/privacy";

function startRecording() {
  if (typeof posthog.startSessionRecording === "function") {
    posthog.startSessionRecording();
  }
}

function stopRecording() {
  if (typeof posthog.stopSessionRecording === "function") {
    posthog.stopSessionRecording();
  }
}

function PostHogPageView() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    const step = wizardStepFromPath(pathname);
    if (!step) return;
    lastPath.current = pathname;
    trackClientEvent("wizard_step_viewed", { step });
  }, [pathname]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const init = () => {
      const apiKey = readPosthogProjectToken();
      if (!apiKey) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[PostHog] No usable project token. Set NEXT_PUBLIC_POSTHOG_TOKEN=phc_… and restart the dev server.",
          );
        }
        return;
      }

      if (!apiKey.startsWith("phc_") && process.env.NODE_ENV === "development") {
        console.warn(
          "[PostHog] Project API keys usually start with phc_. Copy the project token from PostHog project settings.",
        );
      }

      if (!posthog.__loaded) {
        posthog.init(apiKey, {
          api_host: "/ingest",
          ui_host: EU_UI_HOST,
          defaults: "2026-01-30",
          person_profiles: "identified_only",
          capture_pageview: "history_change",
          capture_pageleave: true,
          opt_out_capturing_by_default: true,
          disable_session_recording: false,
          enable_recording_console_log: false,
          capture_exceptions: {
            capture_unhandled_errors: true,
            capture_unhandled_rejections: true,
            capture_console_errors: false,
          },
          mask_all_text: true,
          mask_all_element_attributes: true,
          autocapture: {
            dom_event_allowlist: ["click"],
            element_allowlist: ["a", "button"],
            css_selector_allowlist: ["[data-ph-capture]"],
            capture_copied_text: false,
          },
          session_recording: {
            maskAllInputs: true,
            maskTextSelector: "*",
            maskTextFn: () => "*",
            recordBody: false,
            recordHeaders: false,
          },
          before_send: (event) => redactBrowserCapture(event),
          debug: process.env.NODE_ENV === "development",
          loaded: (ph) => {
            if (readConsentFromStorage() !== "accepted") return;
            ph.opt_in_capturing();
            startRecording();
            flushPendingIdentity();
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
        startRecording();
        flushPendingIdentity();
      } else if (consent === "declined") {
        if (!posthog.__loaded) return;
        stopRecording();
        posthog.opt_out_capturing();
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
