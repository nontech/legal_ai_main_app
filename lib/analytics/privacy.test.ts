import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AnalyticsEvent, wizardStepFromPath } from "./events.ts";
import {
  distinctIdFromCookieHeader,
  emailDomain,
  readPosthogServerHost,
  redactBrowserCapture,
  sanitizeProperties,
  stripUrl,
} from "./privacy.ts";

describe("analytics privacy", () => {
  it("keeps only the email domain", () => {
    assert.equal(emailDomain("ada@Example.com"), "example.com");
    assert.equal(emailDomain("not-an-email"), undefined);
    assert.equal(emailDomain("ada@"), undefined);
  });

  it("drops document text, file names, and full emails from event properties", () => {
    const uploaded = sanitizeProperties("document_uploaded", {
      file_category: "contracts",
      size_bytes: 1200,
      mime_type: "application/pdf",
      success: true,
      file_name: "complaint.pdf",
      summary: "the defendant failed to pay",
      email: "ada@example.com",
    } as never);
    assert.deepEqual(uploaded, {
      file_category: "contracts",
      size_bytes: 1200,
      mime_type: "application/pdf",
      success: true,
    });

    const auth = sanitizeProperties("logged_in", {
      method: "password",
      linked_case: false,
      email_domain: "example.com",
      email: "ada@example.com",
      name: "Ada",
    } as never);
    assert.deepEqual(auth, {
      method: "password",
      linked_case: false,
      email_domain: "example.com",
    });
    assert.equal(JSON.stringify(auth).includes("ada@"), false);
  });

  it("replaces free-text error codes and unknown file categories", () => {
    const failed = sanitizeProperties("analysis_failed", {
      duration_ms: 40,
      error_code: "the contract clause was unenforceable",
    });
    assert.equal(failed.error_code, "unknown");
    assert.equal(
      sanitizeProperties("analysis_failed", {
        duration_ms: 40,
        error_code: "http_502",
      }).error_code,
      "http_502",
    );
    assert.equal(
      sanitizeProperties("document_deleted", {
        file_category: "My pleading.pdf",
        success: false,
      }).file_category,
      "other",
    );
  });

  it("strips query strings and exception messages", () => {
    assert.equal(
      stripUrl("https://www.thelawthing.com/us/en/case?q=secret#section"),
      "https://www.thelawthing.com/us/en/case",
    );
    const event = redactBrowserCapture({
      properties: {
        $current_url: "https://www.thelawthing.com/us/en?prompt=ignore",
        $el_text: "Complaint against Smith",
        $exception_message: "failed while reading the lease",
        $exception_list: [{ type: "Error", value: "lease text" }],
      },
      $set: { email: "ada@example.com", email_domain: "example.com" },
    });
    assert.equal(
      event?.properties?.$current_url,
      "https://www.thelawthing.com/us/en",
    );
    assert.equal(event?.properties?.$el_text, undefined);
    assert.equal(event?.properties?.$exception_message, "[redacted]");
    assert.equal(
      (event?.properties?.$exception_list as { value: string }[])[0]?.value,
      "[redacted]",
    );
    assert.equal(event?.$set?.email, undefined);
    assert.equal(event?.$set?.email_domain, "example.com");
  });

  it("reads the PostHog distinct id and ignores other cookies", () => {
    const header =
      "session=ada@example.com; ph_phc_test_posthog=" +
      encodeURIComponent(JSON.stringify({ distinct_id: "user_abc123" }));
    assert.equal(distinctIdFromCookieHeader(header), "user_abc123");
    assert.equal(distinctIdFromCookieHeader("email=ada@example.com"), null);
  });

  it("maps wizard paths without keeping the query string", () => {
    assert.equal(
      wizardStepFromPath("/us/en/case-analysis/new?details=secret"),
      "new",
    );
    assert.equal(
      wizardStepFromPath("/us/en/case-analysis/abc/case-type"),
      "case_type",
    );
    assert.equal(
      wizardStepFromPath("/us/en/case-analysis/abc/notes"),
      null,
    );
  });

  it("uses the EU ingestion host", () => {
    const previous = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://us.i.posthog.com";
    try {
      assert.equal(readPosthogServerHost(), "https://eu.i.posthog.com");
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
      else process.env.NEXT_PUBLIC_POSTHOG_HOST = previous;
    }
  });

  it("keeps event names in snake_case", () => {
    for (const name of Object.values(AnalyticsEvent)) {
      assert.match(name, /^[a-z0-9_]+$/);
    }
  });
});
