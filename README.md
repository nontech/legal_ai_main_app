# TheLawThing

Next.js app for legal case analysis. It stores cases in Supabase and calls a FastAPI analysis service for uploads, OCR, case analysis, and game plans.

The analysis service runs on Google Cloud: Vertex AI Gemini for the model, Document AI for OCR, and Cloud Storage bucket `thelawthing-legal-docs` in `europe-west3` for documents. Precedent search is moving to Postgres with pgvector inside that service. The API is being deployed as a private, IAM-authenticated Cloud Run service in `europe-west3` (project `project-8531ab21-2146-4309-9b2`). Its URL is not known yet.

This Next.js app is hosted on Vercel. The GitHub homepage is `https://legal-ai-main-app.vercel.app`, which responds with `server: Vercel` and redirects to `https://www.thelawthing.com/` (also served by Vercel). There is no Vercel team slug or project id in this repo.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The analysis API defaults to `http://localhost:8000`. Set the server-only `BACKEND_URL` to the Cloud Run origin when that URL exists. Copy `.env.example` for the full list. Never commit `.env` or `.env.local`.

```env
BACKEND_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_CMS_URL=
NEXT_PUBLIC_SUPABASE_CMS_PUBLISHABLE_KEY=
```

Uploaded file addresses are GCS signed URLs (`https://storage.googleapis.com/...`) or `gs://` URIs. The Next.js image config allows `storage.googleapis.com`. Browser code calls this app's `/api` routes. Those routes call Cloud Run.

## Private Cloud Run authentication

`lib/backend.ts` is server-only. Every analysis call goes through `backendFetch`.

- Loopback (`localhost`, `127.0.0.1`, `::1`) does not obtain a Google token.
- Any other `BACKEND_URL` must be `https`. The Google ID token audience is that URL's origin, with no path.
- The identity token is sent only as `X-Serverless-Authorization: Bearer <token>`.
- If the incoming request has an `Authorization` header, that value is forwarded unchanged. It is not replaced by the Google token.
- Vercel OIDC (`getVercelOidcToken` from `@vercel/oidc`) is exchanged at `https://sts.googleapis.com/v1/token`. The federated access token calls `generateIdToken` on the configured service account. No JSON key is read. Tokens are not returned to the browser. Error text is redacted.

Copy these from the console after you create the pool. This repo does not choose their values.

| Input | Where it comes from |
| --- | --- |
| `GCP_PROJECT_ID` | IAM settings. This service's project id is `project-8531ab21-2146-4309-9b2`. Not used to build the token audience. |
| `GCP_PROJECT_NUMBER` | IAM settings. Numeric. Not the project id. |
| `GCP_SERVICE_ACCOUNT_EMAIL` | The runtime service account that Cloud Run will see in the ID token. |
| `GCP_WORKLOAD_IDENTITY_POOL_ID` | Workload Identity pool id. |
| `GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID` | OIDC provider id on that pool. |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Optional full resource, instead of the three fields above. |
| `GCP_AUDIENCE` | Optional. The provider's default audience (`https://iam.googleapis.com/projects/.../providers/...`), passed to `getVercelOidcToken`. |
| `VERCEL_OIDC_TOKEN` | Injected by Vercel when OIDC is enabled. Also sent on `x-vercel-oidc-token` during a function invocation. |
| `BACKEND_URL` | Cloud Run origin, when known. |

Vercel and Google settings that have to match:

1. Enable OIDC for the Vercel project. Issuer is `https://oidc.vercel.com/[TEAM_SLUG]` in team mode, or `https://oidc.vercel.com` in global mode. The team slug is the path in the Vercel dashboard URL. It is not stored in this repo.
2. Workload Identity provider issuer must be that issuer. Map `google.subject` to `assertion.sub`.
3. Audience: either allow `https://vercel.com/[TEAM_SLUG]` and leave `GCP_AUDIENCE` unset, or select Google's default audience, set `GCP_AUDIENCE` to that exact `https://iam.googleapis.com/...` URL, and use the team issuer (a custom audience always uses the team issuer).
4. Grant the workload principal `roles/iam.serviceAccountTokenCreator` on the runtime service account so it can call `generateIdToken`.
5. Grant that service account `roles/run.invoker` on the Cloud Run service.
6. Put the env vars above on the Vercel project for Production, Preview, and Development. Do not create a service-account JSON key.

For local calls to the private service, `vercel link` then `vercel env pull` writes a development OIDC token. Leave `BACKEND_URL` unset to keep using `http://localhost:8000` with no Google call.

## Product analytics

PostHog runs on the EU cloud. The browser SDK uses `api_host: "/ingest"` and `ui_host: https://eu.posthog.com`. `next.config.ts` proxies `/ingest` to `https://eu.i.posthog.com` and `/ingest/static` to `https://eu-assets.i.posthog.com`. API routes use `posthog-node` against `https://eu.i.posthog.com` and flush before the function returns.

Capturing stays off until the cookie banner is accepted. Session replay masks every input and every text node, and it does not record console logs. Autocapture is limited to elements marked `data-ph-capture`. Event names live in `lib/analytics/events.ts`. Properties are ids, counts, sizes, enums, durations, and status codes. Document text, file names, prompts, and full email addresses are not sent. `posthog.identify` receives the Supabase user id and, when present, the email domain only. Logout calls `posthog.reset()`.

## Scripts

```bash
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

Developer notes live in [docs/README.md](docs/README.md).
