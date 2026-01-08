# TheLawThing - Developer Documentation

Welcome to the **TheLawThing** codebase! This documentation provides a comprehensive guide for developers joining the team.

## Table of Contents

1. [Architecture Overview](./01-architecture-overview.md)
2. [Supabase Configuration](./02-supabase-configuration.md)
3. [API Reference](./03-api-reference.md)
4. [Admin Panel](./04-admin-panel.md)
5. [Main Application](./05-main-application.md)
6. [Internationalization](./06-internationalization.md)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Generate Supabase types (Main Database)
npm run gen:types
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.5.7 (App Router) |
| Frontend | React 19.1.2, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database | Supabase (2 instances: Main App + CMS) |
| Auth | Supabase Auth |
| i18n | next-intl 4.7.0 |
| UI Components | Radix UI, Lucide Icons |
| Markdown | react-markdown, remark-gfm |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├───────────────────────────┬─────────────────────────────────────┤
│     Main Application      │          Admin Panel                │
│   /[country]/[locale]/*   │           /admin/*                  │
│   (Internationalized)     │     (No i18n, Simple Auth)          │
└───────────────────────────┴─────────────────────────────────────┘
                │                           │
                ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────────────┐
│     Main Database         │ │         CMS Database              │
│  (User Cases & Auth)      │ │   (Countries, Courts, Judges...)  │
│  lib/supabase*.ts         │ │   app/admin/supabase/*            │
│  types/supabase.ts        │ │   app/admin/supabase/types.ts     │
└───────────────────────────┘ └───────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              External Azure API (AI Analysis)                    │
│  legal-case-analysis-main-api-*.azurewebsites.net               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router pages and API routes |
| `app/[country]/[locale]/` | Internationalized user-facing pages |
| `app/admin/` | Admin panel (separate from main app) |
| `app/api/` | All backend API routes |
| `app/components/` | Reusable React components |
| `lib/` | Main Supabase client utilities |
| `i18n/` | Internationalization configuration |
| `messages/` | Translation files (en.json, de.json) |
| `types/` | TypeScript type definitions |
| `hooks/` | Custom React hooks |
| `public/` | Static assets |

---

## Two User Contexts

### 1. Admin Users (Internal)
- **Access**: `/admin`
- **Purpose**: Manage reference data (countries, courts, judges, case types)
- **Database**: CMS Supabase instance
- **Auth**: Simple username/password (admin/admin123)

### 2. App Users (External)
- **Access**: `/[country]/[locale]/*` (e.g., `/us/en/`)
- **Purpose**: Analyze legal cases, view results, manage case portfolio
- **Database**: Main Supabase instance
- **Auth**: Supabase Auth (email/password)

---

## Environment Variables Required

```env
# Main Supabase (User Cases & Auth)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# CMS Supabase (Admin Reference Data)
NEXT_PUBLIC_SUPABASE_CMS_URL=
NEXT_PUBLIC_SUPABASE_CMS_PUBLISHABLE_KEY=
```

---

## Getting Help

For detailed information on specific topics, please refer to the individual documentation pages listed in the Table of Contents above.

