# Main Application

The main user-facing application is located at `/[country]/[locale]/` and provides legal case analysis functionality.

---

## User Flows

### 1. Unauthenticated User Flow

```
Landing Page (/)
    └── Redirects to /us/en (default)
           └── Shows Hero + Case Portfolio (empty/demo)
                  └── Click "Start New Analysis"
                         └── /case-analysis (Quick Analysis)
                                └── Upload documents
                                └── Fill form (auto-populated from docs)
                                └── Click "Calculate Results"
                                       └── Streaming analysis
                                       └── Redirects to /case-analysis/detailed?step=7
                                              └── Prompt to sign in/up to save
```

### 2. Authenticated User Flow

```
Dashboard (/)
    └── Shows personalized welcome
    └── Case Portfolio with saved cases
    └── Click case → /case-analysis/detailed?caseId=xxx
    └── Click "New Analysis" → /case-analysis
```

---

## Page Components Breakdown

### Dashboard (`/[country]/[locale]/page.tsx`)

**Components used:**
- `HeroSection` - Marketing hero with features
- `CasePortfolio` - Lists user's analyzed cases
- `ConfidentialByDesign` - Security features section
- `UseCases` - Target audience sections
- `PretrialProcess` - Modal for pretrial procedures

**APIs called:**
- `GET /api/cases` - Check auth + list cases

---

### Quick Analysis (`/[country]/[locale]/case-analysis/page.tsx`)

**3-step wizard:**

| Step | Component | Purpose |
|------|-----------|---------|
| 1 | `DocumentUploadStep` | Upload & classify documents |
| 2 | `QuickAnalysisForm` | Fill case details (pre-populated) |
| 3 | `VerdictStep` | (Placeholder for future) |

**Key Components:**
- `HorizontalStepper` - Step navigation
- `StreamingAnalysisDisplay` - Shows AI analysis in real-time
- `JurisdictionSection` - Country/state/court selection
- `CompactCaseType` - Case type picker
- `CompactRole` - Role selector

**APIs called:**
- `POST /api/cases?type=quick-analysis` - Create empty case
- `POST /api/documents/upload` - Upload files
- `PATCH /api/cases/update` - Save form data
- `POST /api/cases/analyze-streaming` - Run analysis

---

### Detailed Analysis (`/[country]/[locale]/case-analysis/detailed/page.tsx`)

**10-step wizard with sidebar:**

| Step | Component | Purpose |
|------|-----------|---------|
| 0 | `JurisdictionSection` | Country, state, court |
| 1 | `CaseTypeSelector` | Criminal, civil, etc. |
| 2 | `RoleSelector` | Plaintiff/defendant |
| 3 | `ChargesSection` | Add charges/claims |
| 4 | `CaseDetailsSection` | 6 document categories |
| 5 | `JudgeSelection` | Select presiding judge |
| 6 | `JuryComposition` | Configure jury demographics |
| 7 | `ResultsStep` | View AI analysis |
| 8 | `ResultsStep` (game plan only) | View game plan |
| 9 | `VerdictStep` | Set verdict for charges |

**Key Components:**
- `ProgressStepper` - Sidebar navigation
- `MobileProgressBar` - Mobile step navigation
- `PretrialProcess` - Modal

---

## Component-to-API Mapping

| Component | API(s) Called |
|-----------|---------------|
| `Navbar` | `GET /api/cases`, `POST /api/auth/signout` |
| `CasePortfolio` | `GET /api/cases`, `DELETE /api/cases` |
| `DocumentUploadStep` | `POST /api/cases?type=quick-analysis`, `POST /api/documents/upload` |
| `QuickAnalysisForm` | `GET /api/cases/[id]`, `PATCH /api/cases/update`, `POST /api/cases` |
| `StreamingAnalysisDisplay` | `POST /api/cases/analyze-streaming` |
| `JurisdictionSection` | `GET /api/admin/countries`, `GET /api/admin/jurisdictions`, `GET /api/admin/courts` |
| `CaseTypeSelector` | `GET /api/admin/case-types`, `PATCH /api/cases/update` |
| `RoleSelector` | `GET /api/admin/roles`, `PATCH /api/cases/update` |
| `ChargesSection` | `PATCH /api/cases/update` |
| `CaseDetailsSection` | `POST /api/documents/upload-section`, `POST /api/documents/summarize`, `DELETE /api/documents/delete` |
| `JudgeSelection` | `GET /api/admin/judges`, `PATCH /api/cases/update` |
| `JuryComposition` | `GET /api/admin/jury`, `PATCH /api/cases/update` |
| `ResultsStep` | `GET /api/cases/[id]` |
| `StreamingGamePlanDisplay` | `POST /api/game-plan/generate` |
| `SaveCaseButton` | `PATCH /api/cases/update` |

---

## Key Components Explained

### `JurisdictionSection`
Multi-select for location: Country → Jurisdiction (state) → Court

Fetches data from CMS database via admin APIs.

### `CaseDetailsSection`
Manages 6 document categories:
1. Case Information
2. Evidence & Supporting Materials
3. Relevant Legal Precedents
4. Key Witnesses & Testimony
5. Police Report
6. Potential Challenges & Weaknesses

Each category can have:
- Uploaded files (stored in Azure)
- AI-generated summaries

### `StreamingAnalysisDisplay`
Modal that shows real-time AI analysis:
- Connects to SSE endpoint
- Shows progress steps
- Displays streaming text
- Saves result on completion

### `ResultsStep`
Displays the saved analysis result:
- Case summary
- Win probability scenarios
- Strengths/weaknesses
- Recommended actions
- Option to generate game plan

---

## Authentication Check Pattern

Components check auth by calling `/api/cases`:

```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/cases");
      setIsAuthenticated(res.status !== 401);
    } catch {
      setIsAuthenticated(false);
    }
  };
  checkAuth();
}, []);
```

---

## State Management

The app uses React's built-in state management:

- **Local state:** `useState` for component-specific data
- **Session storage:** Temporary data during analysis flow
- **URL params:** Case ID and step tracking
- **Database:** Persistent case data

No external state library (Redux, Zustand) is used.

