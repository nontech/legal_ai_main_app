import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  BackendAuthError,
  backendFetchWithDeps,
  buildBackendAuthHeaders,
  classifyBackendUrl,
  redactSecrets,
  resolveBackendBaseUrl,
  type AuthDependencies,
  type Env,
} from "./backendAuthCore.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const USER_JWT =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEyMyJ9.user-signature-value";
const OIDC = "super-secret-oidc-token-value";
const ACCESS = "super-secret-access-token-value";
const RUN_ORIGIN = "https://analysis.example.run.app";

function fakeJwt(expSeconds: number): string {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ exp: expSeconds, email: "runtime@example.iam.gserviceaccount.com" })).toString("base64url");
  return `${header}.${body}.sig`;
}

function wifEnv(overrides: Env = {}): Env {
  return {
    BACKEND_URL: RUN_ORIGIN,
    GCP_PROJECT_NUMBER: "123456789012",
    GCP_SERVICE_ACCOUNT_EMAIL: "runtime@example.iam.gserviceaccount.com",
    GCP_WORKLOAD_IDENTITY_POOL_ID: "test-pool",
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: "test-provider",
    ...overrides,
  };
}

type Recorded = { url: string; init?: RequestInit };

function googleFetch(idToken: string, options?: { stsStatus?: number; stsBody?: string; idStatus?: number }) {
  const calls: Recorded[] = [];
  const oidcAudiences: Array<string | undefined> = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === "https://sts.googleapis.com/v1/token") {
      return new Response(options?.stsBody ?? JSON.stringify({ access_token: ACCESS, expires_in: 3600 }), {
        status: options?.stsStatus ?? 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes(":generateIdToken")) {
      return new Response(JSON.stringify({ token: idToken }), {
        status: options?.idStatus ?? 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("ok", { status: 200 });
  };
  const deps = (env: Env, now: () => number = () => Date.parse("2026-11-08T12:00:00Z")): AuthDependencies => ({
    env,
    fetch: fetchImpl,
    cache: new Map(),
    now,
    getOidcToken: async (audience) => {
      oidcAudiences.push(audience);
      return OIDC;
    },
  });
  return { calls, oidcAudiences, deps };
}

function stsBody(calls: Recorded[]): Record<string, unknown> {
  const call = calls.find((entry) => entry.url === "https://sts.googleapis.com/v1/token");
  assert.ok(call, "expected a Security Token Service call");
  return JSON.parse(String(call.init?.body)) as Record<string, unknown>;
}

function idTokenCall(calls: Recorded[]): Recorded {
  const call = calls.find((entry) => entry.url.includes(":generateIdToken"));
  assert.ok(call, "expected a generateIdToken call");
  return call;
}

describe("backend URL", () => {
  it("defaults to localhost when unset", () => {
    assert.equal(resolveBackendBaseUrl({}), "http://localhost:8000");
  });

  it("prefers the server-only BACKEND_URL over the public fallback", () => {
    assert.equal(
      resolveBackendBaseUrl({
        BACKEND_URL: "https://analysis.example.run.app/",
        NEXT_PUBLIC_API_URL: "http://localhost:9999",
      }),
      "https://analysis.example.run.app",
    );
  });

  it("treats loopback hosts as local development", () => {
    for (const base of ["http://localhost:8000", "http://127.0.0.1:8000", "http://[::1]:8000"]) {
      assert.equal(classifyBackendUrl(base).local, true, base);
    }
  });

  it("uses the https origin as the Google identity token audience", () => {
    const target = classifyBackendUrl("https://analysis.example.run.app/api/v1/documents/upload");
    assert.equal(target.local, false);
    if (!target.local) {
      assert.equal(target.audience, RUN_ORIGIN);
    }
  });

  it("rejects a non-local http URL", () => {
    assert.throws(
      () => classifyBackendUrl("http://analysis.example.run.app"),
      /must use https/,
    );
  });
});

describe("localhost development", () => {
  it("does not call Google and preserves Authorization", async () => {
    const { calls, oidcAudiences, deps } = googleFetch(fakeJwt(2_000_000_000));
    const headers = await buildBackendAuthHeaders({
      backendBaseUrl: "http://127.0.0.1:8000",
      incomingAuthorization: USER_JWT,
      deps: deps(wifEnv({ BACKEND_URL: "http://127.0.0.1:8000" })),
    });
    assert.equal(headers.Authorization, USER_JWT);
    assert.equal(headers["X-Serverless-Authorization"], undefined);
    assert.equal(calls.length, 0);
    assert.equal(oidcAudiences.length, 0);
  });

  it("omits Authorization when the incoming request has none", async () => {
    const { deps } = googleFetch(fakeJwt(2_000_000_000));
    const headers = await buildBackendAuthHeaders({
      backendBaseUrl: "http://localhost:8000",
      incomingAuthorization: "   ",
      deps: deps({}),
    });
    assert.deepEqual(headers, {});
  });
});

describe("Cloud Run IAM", () => {
  it("sends the Google token in X-Serverless-Authorization and keeps the user JWT", async () => {
    const exp = Math.floor(Date.parse("2026-11-08T14:00:00Z") / 1000);
    const idToken = fakeJwt(exp);
    const { calls, oidcAudiences, deps } = googleFetch(idToken);
    const headers = await buildBackendAuthHeaders({
      backendBaseUrl: `${RUN_ORIGIN}/`,
      incomingAuthorization: USER_JWT,
      deps: deps(wifEnv()),
    });

    assert.equal(headers.Authorization, USER_JWT);
    assert.equal(headers["X-Serverless-Authorization"], `Bearer ${idToken}`);
    assert.notEqual(headers.Authorization, headers["X-Serverless-Authorization"]);

    const sts = stsBody(calls);
    assert.equal(
      sts.audience,
      "//iam.googleapis.com/projects/123456789012/locations/global/workloadIdentityPools/test-pool/providers/test-provider",
    );
    assert.equal(sts.subjectToken, OIDC);
    assert.equal(sts.grantType, "urn:ietf:params:oauth:grant-type:token-exchange");
    assert.deepEqual(oidcAudiences, [undefined]);

    const idCall = idTokenCall(calls);
    const idPayload = JSON.parse(String(idCall.init?.body)) as { audience: string; includeEmail: boolean };
    assert.equal(idPayload.audience, RUN_ORIGIN);
    assert.equal(idPayload.includeEmail, true);
    assert.equal(
      idCall.url,
      "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/runtime%40example.iam.gserviceaccount.com:generateIdToken",
    );
    const idHeaders = new Headers(idCall.init?.headers);
    assert.equal(idHeaders.get("authorization"), `Bearer ${ACCESS}`);
  });

  it("does not invent an Authorization header when the user did not send one", async () => {
    const { deps } = googleFetch(fakeJwt(2_000_000_000));
    const headers = await buildBackendAuthHeaders({
      backendBaseUrl: RUN_ORIGIN,
      deps: deps(wifEnv()),
    });
    assert.equal(headers.Authorization, undefined);
    assert.match(headers["X-Serverless-Authorization"] ?? "", /^Bearer\s+\S+/);
  });

  it("passes GCP_AUDIENCE to Vercel OIDC and still uses the Cloud Run origin for the ID token", async () => {
    const gcpAudience =
      "https://iam.googleapis.com/projects/123456789012/locations/global/workloadIdentityPools/test-pool/providers/test-provider";
    const { calls, oidcAudiences, deps } = googleFetch(fakeJwt(2_000_000_000));
    await buildBackendAuthHeaders({
      backendBaseUrl: RUN_ORIGIN,
      deps: deps(wifEnv({ GCP_AUDIENCE: gcpAudience })),
    });
    assert.deepEqual(oidcAudiences, [gcpAudience]);
    const sts = stsBody(calls);
    assert.equal(
      sts.audience,
      "//iam.googleapis.com/projects/123456789012/locations/global/workloadIdentityPools/test-pool/providers/test-provider",
    );
    const idPayload = JSON.parse(String(idTokenCall(calls).init?.body)) as { audience: string };
    assert.equal(idPayload.audience, RUN_ORIGIN);
  });

  it("reuses a cached Google ID token and refreshes it after expiry", async () => {
    let nowMs = Date.parse("2026-11-08T12:00:00Z");
    const first = fakeJwt(Math.floor(Date.parse("2026-11-08T13:00:00Z") / 1000));
    const second = fakeJwt(Math.floor(Date.parse("2026-11-08T15:00:00Z") / 1000));
    const tokens = [first, second];
    const calls: Recorded[] = [];
    const deps: AuthDependencies = {
      env: wifEnv(),
      cache: new Map(),
      now: () => nowMs,
      getOidcToken: async () => OIDC,
      fetch: async (input, init) => {
        const url = String(input);
        calls.push({ url, init });
        if (url.includes("sts.googleapis.com")) {
          return new Response(JSON.stringify({ access_token: ACCESS }), { status: 200 });
        }
        return new Response(JSON.stringify({ token: tokens.shift() ?? second }), { status: 200 });
      },
    };
    const firstHeaders = await buildBackendAuthHeaders({ backendBaseUrl: RUN_ORIGIN, deps });
    const cachedHeaders = await buildBackendAuthHeaders({ backendBaseUrl: RUN_ORIGIN, deps });
    assert.equal(cachedHeaders["X-Serverless-Authorization"], firstHeaders["X-Serverless-Authorization"]);
    assert.equal(calls.filter((call) => call.url.includes("sts.googleapis.com")).length, 1);

    nowMs = Date.parse("2026-11-08T12:59:30Z");
    await buildBackendAuthHeaders({ backendBaseUrl: RUN_ORIGIN, deps });
    assert.equal(calls.filter((call) => call.url.includes("sts.googleapis.com")).length, 2);
  });
});

describe("failures stay safe", () => {
  it("names missing configuration and does not call Google", async () => {
    const { calls, deps } = googleFetch(fakeJwt(2_000_000_000));
    await assert.rejects(
      () =>
        buildBackendAuthHeaders({
          backendBaseUrl: RUN_ORIGIN,
          deps: deps({ BACKEND_URL: RUN_ORIGIN, GCP_SERVICE_ACCOUNT_EMAIL: "runtime@example.iam.gserviceaccount.com" }),
        }),
      (error: unknown) => {
        assert.ok(error instanceof BackendAuthError);
        assert.match(error.message, /GCP_PROJECT_NUMBER/);
        assert.match(error.message, /GCP_WORKLOAD_IDENTITY_POOL_ID/);
        assert.match(error.message, /GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID/);
        assert.doesNotMatch(error.message, /super-secret/);
        return true;
      },
    );
    assert.equal(calls.length, 0);
  });

  it("rejects a project id used where the numeric project number belongs", async () => {
    const { deps } = googleFetch(fakeJwt(2_000_000_000));
    await assert.rejects(
      () =>
        buildBackendAuthHeaders({
          backendBaseUrl: RUN_ORIGIN,
          deps: deps(wifEnv({ GCP_PROJECT_NUMBER: "project-8531ab21-2146-4309-9b2" })),
        }),
      /numeric project number/,
    );
  });

  it("redacts tokens returned in a token-exchange error", async () => {
    const { deps } = googleFetch(fakeJwt(2_000_000_000), {
      stsStatus: 403,
      stsBody: `denied ${OIDC} Bearer ${ACCESS}`,
    });
    await assert.rejects(
      () => buildBackendAuthHeaders({ backendBaseUrl: RUN_ORIGIN, deps: deps(wifEnv()) }),
      (error: unknown) => {
        assert.ok(error instanceof BackendAuthError);
        assert.match(error.message, /token exchange \(HTTP 403\)/);
        assert.match(error.message, /\[redacted\]/);
        assert.equal(error.message.includes(OIDC), false);
        assert.equal(error.message.includes(ACCESS), false);
        return true;
      },
    );
  });

  it("redacts an OIDC failure message", async () => {
    const deps: AuthDependencies = {
      env: wifEnv({ VERCEL_OIDC_TOKEN: OIDC }),
      fetch: async () => new Response("nope"),
      getOidcToken: async () => {
        throw new Error(`unable to read ${OIDC}`);
      },
    };
    await assert.rejects(
      () => buildBackendAuthHeaders({ backendBaseUrl: RUN_ORIGIN, deps }),
      (error: unknown) => {
        assert.ok(error instanceof BackendAuthError);
        assert.equal(error.message.includes(OIDC), false);
        assert.match(error.message, /Vercel OIDC token/);
        return true;
      },
    );
  });
});

describe("backend fetch wiring", () => {
  it("calls the API with both headers and leaves the user JWT out of the Google call", async () => {
    const idToken = fakeJwt(2_000_000_000);
    const { calls, deps } = googleFetch(idToken);
    const response = await backendFetchWithDeps(
      "/api/v1/documents/summarize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true }),
        incomingAuthorization: USER_JWT,
      },
      deps(wifEnv()),
    );
    assert.equal(response.status, 200);
    const apiCall = calls.find((call) => call.url === `${RUN_ORIGIN}/api/v1/documents/summarize`);
    assert.ok(apiCall);
    const headers = new Headers(apiCall.init?.headers);
    assert.equal(headers.get("authorization"), USER_JWT);
    assert.equal(headers.get("x-serverless-authorization"), `Bearer ${idToken}`);
    assert.equal(headers.get("content-type"), "application/json");
    assert.equal("incomingAuthorization" in (apiCall.init ?? {}), false);
  });
});

describe("server-only source boundaries", () => {
  it("does not read NEXT_PUBLIC_API_URL as a direct client-inlined env access", () => {
    const serverEntry = readFileSync(join(root, "lib/backend.ts"), "utf8");
    const core = readFileSync(join(root, "lib/backendAuthCore.ts"), "utf8");
    assert.match(serverEntry, /import "server-only"/);
    assert.doesNotMatch(serverEntry, /process\.env\.NEXT_PUBLIC_/);
    assert.doesNotMatch(core, /process\.env\.NEXT_PUBLIC_/);
    assert.match(serverEntry, /getVercelOidcToken\(\{ audience \}\)/);
    assert.match(serverEntry, /X-Serverless-Authorization|backendFetchWithDeps/);
  });

  it("is not imported by client components", () => {
    const offenders: string[] = [];
    walk(join(root, "app"), (file) => {
      if (!/\.(tsx|ts)$/.test(file)) return;
      const source = readFileSync(file, "utf8");
      if (!source.includes("use client")) return;
      if (source.includes("@/lib/backend") || source.includes("backendAuthCore")) {
        offenders.push(file);
      }
    });
    assert.deepEqual(offenders, []);
  });
});

describe("redaction helper", () => {
  it("removes exact secrets and bearer values", () => {
    const text = redactSecrets(`token ${OIDC} and Bearer ya29.abcDEF_123`, [OIDC]);
    assert.equal(text.includes(OIDC), false);
    assert.equal(text.includes("ya29."), false);
    assert.match(text, /\[redacted\]/);
    const accessToken = redactSecrets("ya29.abcDEF_123", []);
    assert.match(accessToken, /\[redacted-google-token\]/);
  });
});

function walk(dir: string, visit: (file: string) => void): void {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const info = statSync(path);
    if (info.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(path, visit);
    } else {
      visit(path);
    }
  }
}
