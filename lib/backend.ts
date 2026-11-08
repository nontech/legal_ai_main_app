import "server-only";

import { getVercelOidcToken } from "@vercel/oidc";
import {
  backendFetchWithDeps,
  backendPaths,
  resolveBackendBaseUrl,
  type BackendFetchInit,
  type IdTokenCacheEntry,
} from "./backendAuthCore.ts";

const idTokenCache = new Map<string, IdTokenCacheEntry>();

/**
 * Call the analysis API from a server route.
 *
 * `BACKEND_URL` is the server-only origin. Loopback skips Cloud Run IAM.
 * Any other host must be https and is called with a Google identity token in
 * `X-Serverless-Authorization`. `incomingAuthorization` is copied as-is when
 * the browser request included an `Authorization` header.
 */
export async function backendFetch(
  path: string,
  init: BackendFetchInit = {},
): Promise<Response> {
  return backendFetchWithDeps(path, init, {
    env: process.env,
    fetch: globalThis.fetch,
    cache: idTokenCache,
    getOidcToken: (audience) =>
      audience ? getVercelOidcToken({ audience }) : getVercelOidcToken(),
  });
}

export { backendPaths, resolveBackendBaseUrl };
export type { BackendFetchInit };
