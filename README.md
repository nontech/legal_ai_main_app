# TheLawThing

Next.js app for legal case analysis. It stores cases in Supabase and calls a FastAPI analysis service for uploads, OCR, case analysis, and game plans.

The analysis service runs on Google Cloud: Vertex AI Gemini for the model, Document AI for OCR, and Cloud Storage bucket `thelawthing-legal-docs` in `europe-west3` for documents. Precedent search is moving to Postgres with pgvector inside that service. Deployment to Cloud Run in `europe-west3` is next, and that URL is not known yet.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The analysis API defaults to `http://localhost:8000`. Point `NEXT_PUBLIC_API_URL` at Cloud Run when that URL exists. Copy `.env.example` for the full list. Never commit `.env` or `.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_CMS_URL=
NEXT_PUBLIC_SUPABASE_CMS_PUBLISHABLE_KEY=
```

Uploaded file addresses are GCS signed URLs (`https://storage.googleapis.com/...`) or `gs://` URIs. The Next.js image config allows `storage.googleapis.com`. This app calls the analysis API from server routes under `app/api`, so browser CORS against Cloud Run is not required for those calls. The routes do not send a bearer token.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

Developer notes live in [docs/README.md](docs/README.md).
