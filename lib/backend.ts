/**
 * Legal case analysis API (FastAPI).
 *
 * The service is moving to Cloud Run in europe-west3. That URL is not
 * assigned yet, so set NEXT_PUBLIC_API_URL when it is. Until then the
 * app talks to a local uvicorn process.
 *
 * Browser code calls this app's own /api routes. Those routes call the
 * analysis API from the server, with no bearer token. CORS on Cloud Run
 * does not apply to those server-side requests.
 */

const DEFAULT_BACKEND_URL = "http://localhost:8000";

export const backendPaths = {
  upload: "/api/v1/documents/upload",
  uploadToSection: "/api/v1/documents/upload-to-section",
  summarize: "/api/v1/documents/summarize",
  deleteFile: "/api/v1/documents/delete-file",
  analyzeCaseStreaming: "/api/v1/prediction/analyze-case-streaming",
  generateGamePlanStreaming: "/api/v1/prediction/generate-game-plan-streaming",
} as const;

export function getBackendBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const base = configured ? configured : DEFAULT_BACKEND_URL;
  return base.replace(/\/+$/, "");
}

export function backendUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalized}`;
}
