/**
 * Server-side Cloud Run IAM for the analysis API.
 *
 * Private Cloud Run checks a Google identity token. That token is sent in
 * `X-Serverless-Authorization` so an end-user `Authorization` JWT, when the
 * incoming request has one, is forwarded unchanged.
 *
 * Vercel OIDC is exchanged for a short-lived Google token through Workload
 * Identity Federation. No service-account JSON key is read. The OIDC token
 * itself is not cached; only the resulting Google ID token is cached until
 * shortly before it expires.
 *
 * Local loopback URLs skip Google auth so `next dev` can call uvicorn.
 */

const DEFAULT_BACKEND_URL = "http://localhost:8000";
const STS_TOKEN_URL = "https://sts.googleapis.com/v1/token";
const ID_TOKEN_REFRESH_SKEW_MS = 60_000;
const ID_TOKEN_FALLBACK_TTL_MS = 50 * 60 * 1000;

export type Env = Record<string, string | undefined>;

export type BackendFetchInit = RequestInit & {
  incomingAuthorization?: string | null;
};

export type IdTokenCacheEntry = {
  token: string;
  expiresAtMs: number;
};

export type AuthDependencies = {
  env: Env;
  fetch: typeof fetch;
  getOidcToken: (audience?: string) => Promise<string>;
  cache?: Map<string, IdTokenCacheEntry>;
  now?: () => number;
};

export class BackendAuthError extends Error {
  constructor(message: string, secrets: Array<string | undefined> = []) {
    super(redactSecrets(message, secrets));
    this.name = "BackendAuthError";
  }
}

export function redactSecrets(
  input: string,
  secrets: Array<string | undefined> = [],
): string {
  let output = input;
  const unique = [...new Set(secrets.filter((secret): secret is string => Boolean(secret && secret.length >= 8)))];
  unique.sort((a, b) => b.length - a.length);
  for (const secret of unique) {
    output = output.split(secret).join("[redacted]");
  }
  output = output.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "Bearer [redacted]");
  output = output.replace(
    /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
    "[redacted-jwt]",
  );
  output = output.replace(/\bya29\.[A-Za-z0-9_-]+\b/g, "[redacted-google-token]");
  return output;
}

export function resolveBackendBaseUrl(env: Env): string {
  const configured = env.BACKEND_URL?.trim() || readOptional(env, "NEXT_PUBLIC_API_URL");
  const base = configured ? configured : DEFAULT_BACKEND_URL;
  return base.replace(/\/+$/, "");
}

export const backendPaths = {
  upload: "/api/v1/documents/upload",
  uploadToSection: "/api/v1/documents/upload-to-section",
  summarize: "/api/v1/documents/summarize",
  deleteFile: "/api/v1/documents/delete-file",
  analyzeCaseStreaming: "/api/v1/prediction/analyze-case-streaming",
  generateGamePlanStreaming: "/api/v1/prediction/generate-game-plan-streaming",
} as const;

type RemoteTarget = {
  local: false;
  baseUrl: string;
  /** Cloud Run URL origin. This is the Google ID token audience. */
  audience: string;
};

type LocalTarget = {
  local: true;
  baseUrl: string;
};

export function classifyBackendUrl(backendBaseUrl: string): RemoteTarget | LocalTarget {
  let url: URL;
  try {
    url = new URL(backendBaseUrl);
  } catch {
    throw new BackendAuthError("BACKEND_URL is not a valid absolute URL.");
  }

  const baseUrl = backendBaseUrl.replace(/\/+$/, "");
  if (isLocalHostname(url.hostname)) {
    return { local: true, baseUrl };
  }
  if (url.protocol !== "https:") {
    throw new BackendAuthError(
      "BACKEND_URL must use https when it is not a local development host.",
    );
  }
  return { local: false, baseUrl, audience: url.origin };
}

export async function buildBackendAuthHeaders(args: {
  backendBaseUrl: string;
  incomingAuthorization?: string | null;
  deps: AuthDependencies;
}): Promise<Record<string, string>> {
  const target = classifyBackendUrl(args.backendBaseUrl);
  const headers: Record<string, string> = {};
  const userAuthorization = normalizeIncomingAuthorization(args.incomingAuthorization);
  if (userAuthorization) {
    headers.Authorization = userAuthorization;
  }
  if (target.local) {
    return headers;
  }

  const idToken = await getGoogleIdToken(target.audience, args.deps);
  headers["X-Serverless-Authorization"] = `Bearer ${idToken}`;
  return headers;
}

export async function backendFetchWithDeps(
  path: string,
  init: BackendFetchInit,
  deps: AuthDependencies,
): Promise<Response> {
  const baseUrl = resolveBackendBaseUrl(deps.env);
  const authHeaders = await buildBackendAuthHeaders({
    backendBaseUrl: baseUrl,
    incomingAuthorization: init.incomingAuthorization,
    deps,
  });
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(authHeaders)) {
    headers.set(name, value);
  }
  const { incomingAuthorization: _ignored, headers: _headers, ...rest } = init;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return deps.fetch(`${baseUrl}${normalized}`, {
    ...rest,
    headers,
  });
}

function readOptional(env: Env, name: string): string | undefined {
  const value = env[name]?.trim();
  return value ? value : undefined;
}

function normalizeIncomingAuthorization(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

type WorkloadIdentity = {
  stsAudience: string;
  oidcAudience?: string;
  serviceAccountEmail: string;
};

function resolveWorkloadIdentity(env: Env): WorkloadIdentity {
  const serviceAccountEmail = readOptional(env, "GCP_SERVICE_ACCOUNT_EMAIL");
  if (!serviceAccountEmail) {
    throw new BackendAuthError(
      "Cloud Run authentication is not configured: missing GCP_SERVICE_ACCOUNT_EMAIL.",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(serviceAccountEmail)) {
    throw new BackendAuthError(
      "GCP_SERVICE_ACCOUNT_EMAIL must be a service account email address.",
    );
  }

  const configuredAudience = readOptional(env, "GCP_AUDIENCE");
  if (configuredAudience) {
    return {
      serviceAccountEmail,
      stsAudience: toStsAudience(configuredAudience, "GCP_AUDIENCE"),
      oidcAudience: toOidcAudience(configuredAudience),
    };
  }

  const providerResource = readOptional(env, "GCP_WORKLOAD_IDENTITY_PROVIDER");
  if (providerResource) {
    return {
      serviceAccountEmail,
      stsAudience: toStsAudience(providerResource, "GCP_WORKLOAD_IDENTITY_PROVIDER"),
    };
  }

  const projectNumber = readOptional(env, "GCP_PROJECT_NUMBER");
  const poolId = readOptional(env, "GCP_WORKLOAD_IDENTITY_POOL_ID");
  const providerId = readOptional(env, "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  const missing: string[] = [];
  if (!projectNumber) missing.push("GCP_PROJECT_NUMBER");
  if (!poolId) missing.push("GCP_WORKLOAD_IDENTITY_POOL_ID");
  if (!providerId) missing.push("GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  if (missing.length > 0) {
    throw new BackendAuthError(
      `Cloud Run authentication is not configured: missing ${missing.join(", ")}.`,
    );
  }
  if (!/^\d+$/.test(projectNumber!)) {
    throw new BackendAuthError(
      "GCP_PROJECT_NUMBER must be the numeric project number from IAM settings, not the project id.",
    );
  }

  const pool = assertResourceId(poolId!, "GCP_WORKLOAD_IDENTITY_POOL_ID");
  const provider = assertResourceId(providerId!, "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  return {
    serviceAccountEmail,
    stsAudience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${pool}/providers/${provider}`,
  };
}

function assertResourceId(value: string, envName: string): string {
  if (!/^[a-z0-9](?:[a-z0-9-]{2,61}[a-z0-9])$/.test(value)) {
    throw new BackendAuthError(
      `${envName} must be the pool or provider id from Workload Identity Federation (lowercase letters, numbers, and hyphens).`,
    );
  }
  return value;
}

function toStsAudience(value: string, envName: string): string {
  let resource = value.trim();
  if (resource.startsWith("https://iam.googleapis.com/")) {
    resource = `//iam.googleapis.com/${resource.slice("https://iam.googleapis.com/".length)}`;
  } else if (resource.startsWith("projects/")) {
    resource = `//iam.googleapis.com/${resource}`;
  }
  if (
    !/^\/\/iam\.googleapis\.com\/projects\/\d+\/locations\/global\/workloadIdentityPools\/[a-z0-9][a-z0-9-]{1,61}\/providers\/[a-z0-9][a-z0-9-]{1,61}$/.test(
      resource,
    )
  ) {
    throw new BackendAuthError(
      `${envName} must be a Workload Identity provider resource name.`,
    );
  }
  return resource;
}

function toOidcAudience(value: string): string {
  if (value.startsWith("//iam.googleapis.com/")) {
    return `https://iam.googleapis.com/${value.slice("//iam.googleapis.com/".length)}`;
  }
  return value;
}

async function getGoogleIdToken(audience: string, deps: AuthDependencies): Promise<string> {
  const identity = resolveWorkloadIdentity(deps.env);
  const cache = deps.cache;
  const now = deps.now ?? Date.now;
  const key = `${identity.stsAudience}\n${identity.serviceAccountEmail}\n${audience}`;
  const cached = cache?.get(key);
  if (cached && cached.expiresAtMs - ID_TOKEN_REFRESH_SKEW_MS > now()) {
    return cached.token;
  }

  const secrets: Array<string | undefined> = [deps.env.VERCEL_OIDC_TOKEN];
  let oidcToken: string;
  try {
    oidcToken = (await deps.getOidcToken(identity.oidcAudience)).trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    throw new BackendAuthError(
      `Cloud Run authentication failed while reading the Vercel OIDC token: ${message}`,
      secrets,
    );
  }
  if (!oidcToken) {
    throw new BackendAuthError(
      "Cloud Run authentication failed while reading the Vercel OIDC token: token was empty. Enable OIDC for the Vercel project.",
    );
  }
  secrets.push(oidcToken);

  const accessToken = await exchangeForAccessToken(oidcToken, identity.stsAudience, deps, secrets);
  secrets.push(accessToken);
  const idToken = await generateIdToken(
    accessToken,
    identity.serviceAccountEmail,
    audience,
    deps,
    secrets,
  );
  secrets.push(idToken);

  cache?.set(key, {
    token: idToken,
    expiresAtMs: jwtExpiryMs(idToken) ?? now() + ID_TOKEN_FALLBACK_TTL_MS,
  });
  return idToken;
}

async function exchangeForAccessToken(
  oidcToken: string,
  stsAudience: string,
  deps: AuthDependencies,
  secrets: Array<string | undefined>,
): Promise<string> {
  const body = await googlePost(
    STS_TOKEN_URL,
    {
      audience: stsAudience,
      grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
      requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
      scope: "https://www.googleapis.com/auth/cloud-platform",
      subjectTokenType: "urn:ietf:params:oauth:token-type:jwt",
      subjectToken: oidcToken,
    },
    undefined,
    "token exchange",
    deps,
    secrets,
  );
  if (typeof body.access_token !== "string" || body.access_token.length === 0) {
    throw new BackendAuthError(
      "Cloud Run authentication failed during token exchange: response did not include an access token.",
      secrets,
    );
  }
  return body.access_token;
}

async function generateIdToken(
  accessToken: string,
  serviceAccountEmail: string,
  audience: string,
  deps: AuthDependencies,
  secrets: Array<string | undefined>,
): Promise<string> {
  const url = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(serviceAccountEmail)}:generateIdToken`;
  const body = await googlePost(
    url,
    { audience, includeEmail: true },
    accessToken,
    "identity token",
    deps,
    secrets,
  );
  if (typeof body.token !== "string" || body.token.length === 0) {
    throw new BackendAuthError(
      "Cloud Run authentication failed during identity token: response did not include a token.",
      secrets,
    );
  }
  return body.token;
}

async function googlePost(
  url: string,
  payload: Record<string, unknown>,
  bearer: string | undefined,
  stage: string,
  deps: AuthDependencies,
  secrets: Array<string | undefined>,
): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await deps.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "network error";
    throw new BackendAuthError(
      `Cloud Run authentication failed during ${stage}: ${message}`,
      secrets,
    );
  }

  const text = await response.text();
  if (!response.ok) {
    const snippet = redactSecrets(text, secrets).slice(0, 300);
    throw new BackendAuthError(
      `Cloud Run authentication failed during ${stage} (HTTP ${response.status}). ${snippet}`,
      secrets,
    );
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof BackendAuthError) throw error;
    throw new BackendAuthError(
      `Cloud Run authentication failed during ${stage}: response was not JSON.`,
      secrets,
    );
  }
}

function jwtExpiryMs(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      exp?: unknown;
    };
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}
