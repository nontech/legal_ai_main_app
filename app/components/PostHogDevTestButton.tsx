"use client";

import posthog from "posthog-js";
import { useCallback, useState } from "react";

/**
 * Development-only: send one custom event to verify PostHog (key, host, consent).
 * In PostHog: Activity → Live (or Events) and filter by event name `local_dev_posthog_test`.
 * You must accept cookies first so PostHog initializes.
 */
export default function PostHogDevTestButton() {
  const [last, setLast] = useState<string | null>(null);

  const ping = useCallback(() => {
    if (!posthog.__loaded) {
      const msg =
        "PostHog not loaded — set phc_ key + *.i.posthog.com host, restart dev, accept cookies.";
      console.warn("[PostHog test]", msg);
      setLast(msg);
      return;
    }
    posthog.capture("local_dev_posthog_test", {
      source: "PostHogDevTestButton",
      at: new Date().toISOString(),
    });
    console.info(
      "[PostHog test] Sent event local_dev_posthog_test — check PostHog → Activity → Live",
    );
    setLast("Sent local_dev_posthog_test");
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-[200] flex max-w-xs flex-col gap-1 rounded-lg border border-amber-500/40 bg-zinc-950/95 p-2 text-xs text-zinc-200 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={ping}
        className="rounded bg-amber-600 px-2 py-1.5 font-medium text-white hover:bg-amber-500"
      >
        PostHog: send test event
      </button>
      {last ? (
        <p className="text-[10px] leading-tight text-zinc-400">{last}</p>
      ) : (
        <p className="text-[10px] leading-tight text-zinc-500">
          Accept cookies first (or set{" "}
          <code className="text-zinc-400">tlc_cookie_consent=accepted</code> in
          localStorage + reload).
        </p>
      )}
    </div>
  );
}
