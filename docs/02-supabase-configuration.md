# Supabase Configuration

The application uses **two separate Supabase databases** for different purposes.

---

## Database 1: Main Application Database

**Purpose**: User authentication, case storage, analysis results

### Configuration Files

| File | Purpose |
|------|---------|
| `lib/supabaseClient.ts` | Browser client (client-side, public operations) |
| `lib/supabaseServer.ts` | Server client (SSR, with cookie handling) |
| `lib/supabaseAdmin.ts` | Admin client (service role, bypasses RLS) |
| `types/supabase.ts` | Auto-generated TypeScript types |

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-main-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-main-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-main-service-role-key
```

### Tables

| Table | Purpose |
|-------|---------|
| `cases` | Stores all user case data (details, results, game plans) |

### Type Generation

```bash
npm run gen:types
# Generates types/supabase.ts from the Main database
```

### Client Usage Examples

```typescript
// Browser (client components)
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
const supabase = getSupabaseBrowserClient();

// Server (API routes, server components)
import { getSupabaseServerClient } from "@/lib/supabaseServer";
const supabase = await getSupabaseServerClient();

// Admin (bypass RLS for operations like linking anonymous cases)
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
const supabase = getSupabaseAdminClient();
```

---

## Database 2: CMS Database (Admin Reference Data)

**Purpose**: Store reference data displayed in form dropdowns (countries, courts, judges, etc.)

### Configuration Files

| File | Purpose |
|------|---------|
| `app/admin/supabase/client.ts` | Browser client for admin panel |
| `app/admin/supabase/supabaseCMSServer.ts` | Server client for API routes |
| `app/admin/supabase/types.ts` | TypeScript types for CMS tables |

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_CMS_URL=your-cms-supabase-url
NEXT_PUBLIC_SUPABASE_CMS_PUBLISHABLE_KEY=your-cms-anon-key
```

### Tables

| Table | Purpose |
|-------|---------|
| `countries` | Supported countries (US, UK, DE, CA) |
| `jurisdiction` | States/provinces per country |
| `court_levels` | Court hierarchy levels per country |
| `courts` | Individual courts with official names |
| `case_type` | Case types per country (criminal, civil, etc.) |
| `role` | User roles per country (plaintiff, defendant) |
| `charges` | Charge sheets per country |
| `judge` | Judges per jurisdiction |
| `jury` | Jury demographics per country |
| `case_details` | Additional case detail configurations |
| `pretrial_process` | Pretrial document templates |

### Client Usage Example

```typescript
// API routes that need CMS data
import { getSupabaseCMSClient } from "@/app/admin/supabase/supabaseCMSServer";
const supabase = getSupabaseCMSClient();

const { data } = await supabase
  .from("countries")
  .select("id, name, iso_code")
  .eq("is_active", true);
```

---

## Which Database to Use?

| Operation | Database | Client |
|-----------|----------|--------|
| User authentication | Main | `supabaseServer` |
| Create/read/update cases | Main | `supabaseServer` |
| Save analysis results | Main | `supabaseServer` |
| Get countries dropdown | CMS | `supabaseCMSServer` |
| Get jurisdictions dropdown | CMS | `supabaseCMSServer` |
| Get case types dropdown | CMS | `supabaseCMSServer` |
| Get courts dropdown | CMS | `supabaseCMSServer` |
| Get judges dropdown | CMS | `supabaseCMSServer` |
| Get jury options | CMS | `supabaseCMSServer` |
| Admin CRUD operations | CMS | `supabaseCMSServer` |

---

## Type Definitions Overview

### Main Database (`types/supabase.ts`)

```typescript
// Primary table
cases: {
  id: string;
  owner_id: string | null;        // User who owns the case
  case_type: string | null;        // "criminal" | "civil" | etc.
  role: string | null;             // "plaintiff" | "defendant"
  jurisdiction: Json | null;       // Country, state, court info
  charges: Json | null;            // Array of charges/claims
  case_details: Json | null;       // Case information, files, summaries
  judge: string | null;
  jury: Json | null;
  result: Json | null;             // AI analysis result
  game_plan: Json | null;          // AI-generated game plan
  verdict: Json | null;
  status: string | null;
  created_at: string;
}
```

### CMS Database (`app/admin/supabase/types.ts`)

Key tables include:
- `countries` - id, name, iso_code, is_active
- `jurisdiction` - id, country_id, name, type, code
- `court_levels` - id, country_id, name, branch, normalized_level
- `courts` - id, country_id, jurisdiction_id, court_level_id, name, official_name
- `case_type` - id, country_id, case_types (JSON)
- `role` - id, country_id, role_types (JSON)
- `judge` - id, country_id, jurisdiction_id, judge_info (JSON)
- `jury` - id, country_id, demographics (JSON), characteristics (JSON)
- `charges` - id, country_id, case_types, charge_sheets, responsible_courts (all JSON)

