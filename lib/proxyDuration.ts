/**
 * Vercel project legal-ai-main-app (team nontechs-projects) is on the Hobby plan.
 * With Fluid compute, Hobby functions can run for 300 seconds, which matches
 * the Cloud Run timeout. Pro would be required only to go past 300.
 * https://vercel.com/docs/functions/limitations
 *
 * The upload proxies still buffer the request with request.formData().
 * Streaming the body through with fetch duplex "half" is not safe here:
 * the route checks case ownership, rewrites `section` to `file_category`,
 * injects `user_id`, records size and mime, and merges the returned files
 * into case_details. A raw stream would skip all of that.
 *
 * Vercel also limits a function request body to about 4.5 MB. The follow-up
 * is a signed URL so the browser uploads straight to Cloud Storage and this
 * app only receives the object name. That is not built yet.
 */
export const PROXY_MAX_DURATION_SECONDS = 300;
export const PROXY_RUNTIME = "nodejs" as const;

export const PROXY_ROUTES = [
  "app/api/documents/upload-section/route.ts",
  "app/api/documents/upload/route.ts",
  "app/api/documents/summarize/route.ts",
  "app/api/documents/delete/route.ts",
  "app/api/cases/analyze-streaming/route.ts",
  "app/api/game-plan/generate/route.ts",
] as const;
