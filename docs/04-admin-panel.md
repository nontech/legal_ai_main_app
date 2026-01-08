# Admin Panel

The Admin Panel is a separate section of the application for managing reference data used throughout the main app.

---

## Access & Authentication

- **URL:** `/admin`
- **Credentials:** Username: `admin` / Password: `admin123`
- **Auth type:** Simple session-based (stored in `sessionStorage`)
- **Note:** Not protected by Supabase Auth; uses hardcoded credentials

> ⚠️ **Security Note:** In production, replace hardcoded credentials with proper authentication.

---

## File Structure

```
app/admin/
├── layout.tsx              ← Admin layout with Toaster
├── page.tsx                ← Main admin page (login + tabs)
├── admin.css               ← Admin-specific styles
└── supabase/
    ├── client.ts           ← Browser Supabase client (CMS)
    ├── supabaseCMSServer.ts ← Server Supabase client (CMS)
    └── types.ts            ← CMS database types
```

---

## Admin Page Tabs

The admin panel uses a tabbed interface with 9 management sections:

| Tab | Component | Purpose |
|-----|-----------|---------|
| Countries | `CountriesManager.tsx` | Manage supported countries |
| Jurisdictions | `JurisdictionsManager.tsx` | Manage states/provinces per country |
| Court Levels | `CourtLevelsManager.tsx` | Manage court hierarchy |
| Courts | `CourtsManager.tsx` | Manage individual courts |
| Case Types | `CaseTypesManager.tsx` | Manage case type options |
| Roles | `RolesManager.tsx` | Manage plaintiff/defendant roles |
| Charges | `ChargesManager.tsx` | Manage charge sheets |
| Judges | `JudgesManager.tsx` | Manage judge profiles |
| Jury | `JuryManager.tsx` | Manage jury demographics |

---

## Component Locations

```
app/components/admin/
├── CaseTypesManager.tsx
├── ChargesManager.tsx
├── CountriesManager.tsx
├── CourtLevelsManager.tsx
├── CourtsManager.tsx
├── JudgesManager.tsx
├── JurisdictionsManager.tsx
├── JuryManager.tsx
└── RolesManager.tsx
```

---

## Database Connection

Admin components use the CMS Supabase database:

```typescript
// In admin components (client-side)
import { supabase } from "../supabase/client";

// In API routes
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";
```

---

## How Admin Data is Used in Main App

Admin-managed data populates form fields throughout the main application:

| Admin Tab | Used In |
|-----------|---------|
| Countries | `JurisdictionSection` dropdown |
| Jurisdictions | `JurisdictionSection` state dropdown |
| Courts | `JurisdictionSection` court dropdown |
| Case Types | `CaseTypeSelector`, `CompactCaseType` |
| Roles | `RoleSelector`, `CompactRole` |
| Judges | `JudgeSelection` |
| Jury | `JuryComposition` |

---

## API Routes for Admin Data

All routes are in `app/api/admin/`:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/countries` | GET | List active countries |
| `/api/admin/jurisdictions?country_id=` | GET | List jurisdictions |
| `/api/admin/case-types?country_id=` | GET | Get case types |
| `/api/admin/roles?country_id=` | GET | Get roles |
| `/api/admin/courts?country=&locale=` | GET | List courts |
| `/api/admin/judges?jurisdiction_id=` | GET | Get judges |
| `/api/admin/jury?country_id=` | GET | Get jury config |

---

## Middleware Bypass

The admin panel is explicitly excluded from i18n routing:

```typescript
// middleware.ts
if (pathname.startsWith('/admin')) {
    return NextResponse.next();
}
```

This ensures `/admin` is accessed directly without country/locale prefixes.

---

## Adding a New Admin Section

1. Create manager component in `app/components/admin/NewManager.tsx`
2. Add API route in `app/api/admin/new-resource/route.ts`
3. Add tab in `app/admin/page.tsx`:
   ```tsx
   <TabsTrigger value="new-resource">
     <NewIcon className="w-4 h-4" />
     <span>New Resource</span>
   </TabsTrigger>
   
   <TabsContent value="new-resource">
     <NewManager />
   </TabsContent>
   ```
4. Update CMS database types if needed in `app/admin/supabase/types.ts`

