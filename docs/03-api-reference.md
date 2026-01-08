# API Reference

All API routes are located in `app/api/`. There are **20 API endpoints** organized into 5 categories.

---

## API Summary Table

| # | Endpoint | Method | Purpose | Database |
|---|----------|--------|---------|----------|
| 1 | `/api/cases` | GET | List user's cases | Main |
| 2 | `/api/cases` | POST | Create new case | Main |
| 3 | `/api/cases` | DELETE | Delete a case | Main |
| 4 | `/api/cases/[id]` | GET | Get single case by ID | Main |
| 5 | `/api/cases/update` | PATCH | Update case fields | Main |
| 6 | `/api/cases/analyze-streaming` | POST | Run AI analysis (SSE) | Main + Azure |
| 7 | `/api/auth/signin` | POST | Sign in user | Main |
| 8 | `/api/auth/signup` | POST | Register new user | Main |
| 9 | `/api/auth/signout` | POST | Sign out user | Main |
| 10 | `/api/auth/forgot-password` | POST | Send reset email | Main |
| 11 | `/api/documents/upload` | POST | Upload & classify docs | Main + Azure |
| 12 | `/api/documents/summarize` | POST | Summarize documents | Azure |
| 13 | `/api/documents/delete` | DELETE | Delete uploaded file | Main + Azure |
| 14 | `/api/documents/upload-section` | POST | Upload to case section | Main + Azure |
| 15 | `/api/game-plan/generate` | POST | Generate game plan (SSE) | Main + Azure |
| 16 | `/api/admin/countries` | GET | List active countries | CMS |
| 17 | `/api/admin/jurisdictions` | GET | List jurisdictions | CMS |
| 18 | `/api/admin/case-types` | GET | Get case types | CMS |
| 19 | `/api/admin/roles` | GET | Get roles | CMS |
| 20 | `/api/admin/courts` | GET | List courts | CMS |
| 21 | `/api/admin/judges` | GET | Get judges | CMS |
| 22 | `/api/admin/jury` | GET | Get jury options | CMS |
| 23 | `/api/supabase/health` | GET | Check session health | Main |

---

## Authentication APIs

### POST `/api/auth/signin`

Sign in an existing user. Optionally links an anonymous case to the user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "caseId": "optional-case-id-to-link"
}
```

**Response:**
```json
{
  "ok": true,
  "user": { "id": "...", "email": "..." },
  "email": "user@example.com",
  "caseId": "linked-case-id"
}
```

**Called from:** `app/[country]/[locale]/auth/signin/page.tsx`

---

### POST `/api/auth/signup`

Register a new user. Optionally links an anonymous case.

**Request Body:** Same as signin

**Called from:** `app/[country]/[locale]/auth/signup/page.tsx`

---

### POST `/api/auth/signout`

Sign out the current user.

**Called from:** `app/components/Navbar.tsx`

---

### POST `/api/auth/forgot-password`

Send password reset email.

**Request Body:**
```json
{ "email": "user@example.com" }
```

**Called from:** `app/[country]/[locale]/auth/forgot-password/page.tsx`

---

## Case APIs

### GET `/api/cases`

List all cases owned by the authenticated user.

**Response:**
```json
{
  "ok": true,
  "cases": [{ "id": "...", "case_details": {...}, ... }]
}
```

**Called from:**
- `app/components/dashboard/CasePortfolio.tsx`
- `app/components/Navbar.tsx` (auth check)
- `app/[country]/[locale]/page.tsx` (auth check)

---

### POST `/api/cases`

Create a new case.

**Query params:** `?type=quick-analysis` creates empty case

**Request Body (full creation):**
```json
{
  "caseName": "Smith v. Jones",
  "caseDescription": "Description...",
  "jurisdiction": { "country": "US", "state": "CA", ... },
  "case_type": "civil",
  "role": "plaintiff",
  "charges": [...]
}
```

**Called from:**
- `app/components/quick-analysis/DocumentUploadStep.tsx`
- `app/components/quick-analysis/QuickAnalysisForm.tsx`

---

### DELETE `/api/cases?id={caseId}`

Delete a case.

**Called from:** `app/components/dashboard/CasePortfolio.tsx`

---

### GET `/api/cases/[id]`

Get a single case by ID.

**Called from:**
- `app/[country]/[locale]/case-analysis/detailed/page.tsx`
- `app/components/quick-analysis/QuickAnalysisForm.tsx`
- `app/components/ResultsStep.tsx`

---

### PATCH `/api/cases/update`

Update specific case fields.

**Request Body:**
```json
{
  "caseId": "uuid",
  "field": "case_details",
  "value": { "case_information": {...} },
  "case_type": "criminal",
  "role": "defendant",
  "jurisdiction": {...},
  "charges": [...]
}
```

**Called from:**
- `app/components/quick-analysis/QuickAnalysisForm.tsx`
- `app/components/JurisdictionSection.tsx`
- `app/components/CaseTypeSelector.tsx`
- `app/components/RoleSelector.tsx`
- `app/components/ChargesSection.tsx`
- `app/components/CaseDetailsSection.tsx`
- `app/components/JudgeSelection.tsx`
- `app/components/JuryComposition.tsx`
- `app/components/SaveCaseButton.tsx`

---

### POST `/api/cases/analyze-streaming`

Run AI analysis on a case. Returns Server-Sent Events (SSE) stream.

**Request Body:**
```json
{ "caseId": "uuid" }
```

**Called from:** `app/components/StreamingAnalysisDisplay.tsx`

---

## Document APIs

### POST `/api/documents/upload`

Upload files for classification. Streams response.

**Request:** FormData with files, user_id, case_id, tenant_id

**Called from:** `app/components/quick-analysis/DocumentUploadStep.tsx`

---

### POST `/api/documents/summarize`

Generate summary for documents.

**Request Body:**
```json
{
  "file_addresses": ["addr1", "addr2"],
  "file_names": ["file1.pdf", "file2.pdf"],
  "file_category": "evidence_and_supporting_materials"
}
```

**Called from:** `app/components/CaseDetailsSection.tsx`

---

### DELETE `/api/documents/delete`

Delete a file from Azure and update case.

**Request Body:**
```json
{
  "fileAddress": "azure-blob-address",
  "section": "evidence_and_supporting_materials",
  "caseId": "uuid"
}
```

**Called from:** `app/components/CaseDetailsSection.tsx`

---

### POST `/api/documents/upload-section`

Upload files directly to a case section.

**Request:** FormData with files, section, case_id

**Called from:** `app/components/CaseDetailsSection.tsx`

---

## Game Plan API

### POST `/api/game-plan/generate`

Generate AI game plan. Returns SSE stream.

**Request Body:**
```json
{
  "caseId": "uuid",
  "case_analysis": {...},
  "case_info": {...}
}
```

**Called from:** `app/components/StreamingGamePlanDisplay.tsx`

---

## Admin APIs (CMS Database)

All admin APIs use the CMS Supabase database for reference data.

### GET `/api/admin/countries`

List active countries.

**Called from:**
- `app/components/admin/CountriesManager.tsx`
- `app/components/JurisdictionSection.tsx`
- `app/components/quick-analysis/CompactCaseType.tsx`

---

### GET `/api/admin/jurisdictions?country_id={id}`

List jurisdictions for a country.

**Called from:**
- `app/components/admin/JurisdictionsManager.tsx`
- `app/components/JurisdictionSection.tsx`

---

### GET `/api/admin/case-types?country_id={id}`

Get case types for a country.

**Called from:**
- `app/components/admin/CaseTypesManager.tsx`
- `app/components/CaseTypeSelector.tsx`
- `app/components/quick-analysis/CompactCaseType.tsx`

---

### GET `/api/admin/roles?country_id={id}`

Get roles for a country.

**Called from:**
- `app/components/admin/RolesManager.tsx`
- `app/components/RoleSelector.tsx`
- `app/components/quick-analysis/CompactRole.tsx`

---

### GET `/api/admin/courts?country={code}&locale={locale}`

Get courts for a country.

**Called from:**
- `app/components/admin/CourtsManager.tsx`
- `app/components/JurisdictionSection.tsx`

---

### GET `/api/admin/judges?jurisdiction_id={id}`

Get judges for a jurisdiction.

**Called from:**
- `app/components/admin/JudgesManager.tsx`
- `app/components/JudgeSelection.tsx`

---

### GET `/api/admin/jury?country_id={id}`

Get jury configuration for a country.

**Called from:**
- `app/components/admin/JuryManager.tsx`
- `app/components/JuryComposition.tsx`

---

## Health Check API

### GET `/api/supabase/health`

Check if user has an active session.

**Response:**
```json
{ "ok": true, "hasSession": true }
```

---

## Streaming APIs Pattern

The `/api/cases/analyze-streaming` and `/api/game-plan/generate` endpoints use Server-Sent Events:

```typescript
// Response headers
{
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive"
}

// Event format
data: {"type": "progress", "step": "analyzing", "content": "..."}
data: {"type": "complete", "result": {...}}
```

