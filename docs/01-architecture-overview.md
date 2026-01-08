# Architecture Overview

## Entry Points & File Connections

### Application Entry Flow

```
app/
├── layout.tsx              ← Root layout (HTML shell, metadata)
├── page.tsx                ← Root page (redirects to /us/en)
├── globals.css             ← Global styles
│
├── [country]/[locale]/     ← Internationalized routes
│   ├── layout.tsx          ← Provides NextIntlClientProvider, Navbar, Footer
│   ├── page.tsx            ← Dashboard/home page
│   └── ...pages            ← All user-facing pages
│
├── admin/                  ← Admin panel (separate context)
│   ├── layout.tsx          ← Admin-specific layout
│   └── page.tsx            ← Admin dashboard with tabs
│
├── api/                    ← All backend API routes
│   ├── auth/               ← Authentication endpoints
│   ├── cases/              ← Case CRUD & analysis
│   ├── documents/          ← File upload/summarize
│   ├── game-plan/          ← Game plan generation
│   └── admin/              ← Admin data endpoints
│
└── components/             ← Reusable UI components
    ├── admin/              ← Admin-specific components
    ├── dashboard/          ← Dashboard components
    ├── quick-analysis/     ← Quick analysis flow
    └── ui/                 ← Base UI components (Radix)
```

---

## Routing Structure

### Middleware (`middleware.ts`)
The middleware handles URL redirection for internationalization:

- Skips `/api`, `/_next`, `/_vercel`, static files, and `/admin` routes
- Redirects root `/` to `/{DEFAULT_COUNTRY}/{locale}` (default: `/us/en`)
- Adds country/locale prefix to paths missing them

### Main App Routes (`/[country]/[locale]/`)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Dashboard with case portfolio |
| `/case-analysis` | `case-analysis/page.tsx` | Quick analysis wizard |
| `/case-analysis/detailed` | `case-analysis/detailed/page.tsx` | 10-step detailed analysis |
| `/auth/signin` | `auth/signin/page.tsx` | User sign-in |
| `/auth/signup` | `auth/signup/page.tsx` | User registration |
| `/auth/forgot-password` | `auth/forgot-password/page.tsx` | Password reset request |
| `/auth/reset-password` | `auth/reset-password/page.tsx` | Password reset form |
| `/auth/email-confirmed` | `auth/email-confirmed/page.tsx` | Email confirmation success |
| `/pricing` | `pricing/page.tsx` | Pricing page |
| `/documentation` | `documentation/page.tsx` | User documentation |
| `/contact` | `contact/page.tsx` | Contact form |
| `/legal-professionals` | `legal-professionals/page.tsx` | Info for lawyers |
| `/individuals` | `individuals/page.tsx` | Info for individuals |
| `/privacy` | `privacy/page.tsx` | Privacy policy |
| `/terms` | `terms/page.tsx` | Terms of service |
| `/cookies` | `cookies/page.tsx` | Cookie policy |
| `/security` | `security/page.tsx` | Security information |
| `/imprint` | `imprint/page.tsx` | Legal imprint |
| `/acceptable-use` | `acceptable-use/page.tsx` | Acceptable use policy |
| `/verdict` | `verdict/page.tsx` | Verdict display |

### Admin Routes (`/admin`)
Single page with tabbed interface - no sub-routes.

---

## Component Hierarchy

### Main App Layout Chain
```
RootLayout (app/layout.tsx)
  └── LocaleLayout (app/[country]/[locale]/layout.tsx)
        ├── NextIntlClientProvider
        ├── Navbar
        ├── {page content}
        └── ConditionalFooter
```

### Key Shared Components

| Component | Location | Used By |
|-----------|----------|---------|
| `Navbar` | `components/Navbar.tsx` | All main app pages |
| `Footer` | `components/Footer.tsx` | Most pages (via ConditionalFooter) |
| `CountryLanguageSelector` | `components/CountryLanguageSelector.tsx` | Navbar |
| `Button`, `Input`, etc. | `components/ui/` | Throughout the app |
| `Toaster` | `components/ui/toaster.tsx` | Layout components |

---

## Data Flow

### Case Analysis Flow

```
1. User uploads documents
   └── POST /api/documents/upload → Azure API
   
2. User fills quick analysis form
   └── Creates/updates case via POST/PATCH /api/cases

3. User clicks "Calculate Results"
   └── POST /api/cases/analyze-streaming
       └── Calls Azure AI API (streaming)
       └── Saves result to Main Supabase

4. User views results
   └── GET /api/cases/[id]

5. User generates game plan
   └── POST /api/game-plan/generate
       └── Calls Azure AI API (streaming)
       └── Saves to Main Supabase
```

### Admin Data Flow

```
Admin Panel (client)
  └── GET /api/admin/countries    ← CMS Supabase
  └── GET /api/admin/jurisdictions
  └── GET /api/admin/case-types
  └── GET /api/admin/roles
  └── GET /api/admin/courts
  └── GET /api/admin/judges
  └── GET /api/admin/jury
  
Main App Form Fields
  └── Uses same admin APIs to populate dropdowns
```

---

## External Dependencies

### Azure AI API
Base URL: `https://legal-case-analysis-main-api-efbsdwd2bsdxced6.germanywestcentral-01.azurewebsites.net`

| Endpoint | Purpose |
|----------|---------|
| `/api/v1/documents/upload` | Upload & classify documents |
| `/api/v1/documents/summarize` | Summarize uploaded documents |
| `/api/v1/documents/delete-file` | Delete uploaded files |
| `/api/v1/documents/upload-to-section` | Upload to specific section |
| `/api/v1/prediction/analyze-case-streaming` | AI case analysis (SSE) |
| `/api/v1/prediction/generate-game-plan-streaming` | Game plan generation (SSE) |

