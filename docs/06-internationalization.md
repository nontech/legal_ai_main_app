# Internationalization (i18n)

The application uses **next-intl** for internationalization, supporting multiple countries and languages.

---

## Configuration Files

| File | Purpose |
|------|---------|
| `i18n/routing.ts` | Defines locales and countries |
| `i18n/request.ts` | Server-side locale configuration |
| `middleware.ts` | URL routing for locales |
| `messages/en.json` | English translations |
| `messages/de.json` | German translations |

---

## Supported Configuration

### Countries

```typescript
// i18n/routing.ts
export const COUNTRIES = [
    { code: 'de', name: 'Germany', defaultLocale: 'de', locales: ['en', 'de'] },
    { code: 'uk', name: 'United Kingdom', defaultLocale: 'en', locales: ['en'] },
    { code: 'us', name: 'United States', defaultLocale: 'en', locales: ['en'] },
    { code: 'ca', name: 'Canada', defaultLocale: 'en', locales: ['en'] },
];

export const DEFAULT_COUNTRY = 'us';
```

### Locales

```typescript
// i18n/routing.ts
export const routing = defineRouting({
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localePrefix: 'always',
});
```

---

## URL Structure

All user-facing routes follow the pattern:
```
/{country}/{locale}/{page}
```

Examples:
- `/us/en/` - US, English, Home
- `/de/de/case-analysis` - Germany, German, Case Analysis
- `/uk/en/pricing` - UK, English, Pricing

---

## Middleware Routing Logic

The middleware (`middleware.ts`) handles:

1. **Skip rules:** API routes, static files, admin panel
2. **Root redirect:** `/` → `/us/en`
3. **Country-only redirect:** `/de` → `/de/de`
4. **Missing prefix:** `/pricing` → `/us/en/pricing`

```typescript
// Country-specific default locales
const countryDefaults = {
    de: 'de',  // Germany defaults to German
    uk: 'en',
    us: 'en',
    ca: 'en',
};
```

---

## Using Translations in Components

### Client Components

```typescript
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("namespace");
  
  return <h1>{t("title")}</h1>;
}
```

### Server Components

```typescript
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("namespace");
  
  return <h1>{t("title")}</h1>;
}
```

---

## Translation File Structure

### `messages/en.json` (879 lines)

```json
{
  "navigation": {
    "home": "Home",
    "signIn": "Sign In",
    "signUp": "Sign Up",
    ...
  },
  "countries": {
    "de": "Germany",
    "uk": "United Kingdom",
    ...
  },
  "hero": {
    "title": "Predict Legal Case Outcomes",
    "description": "...",
    ...
  },
  "casePortfolio": {...},
  "caseAnalysis": {...},
  "quickAnalysisPage": {...},
  ...
}
```

### Key Namespaces

| Namespace | Usage |
|-----------|-------|
| `navigation` | Navbar links |
| `countries` | Country names |
| `languages` | Language names |
| `hero` | Landing page hero |
| `casePortfolio` | Case list table |
| `caseAnalysis` | Detailed analysis steps |
| `quickAnalysisPage` | Quick analysis flow |
| `useCases` | Target audience sections |
| `footer` | Footer links |

---

## Layout Provider

The locale layout wraps pages with `NextIntlClientProvider`:

```typescript
// app/[country]/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

---

## Country/Language Selector

The `CountryLanguageSelector` component (in Navbar) allows users to switch:

```typescript
// app/components/CountryLanguageSelector.tsx
// - Shows dropdown with countries
// - Shows available languages per country
// - Navigates to new URL on selection
```

---

## Adding a New Language

1. Create translation file: `messages/{locale}.json`
2. Add locale to routing:
   ```typescript
   // i18n/routing.ts
   locales: ['en', 'de', 'fr'],
   ```
3. Update request config:
   ```typescript
   // i18n/request.ts
   const VALID_LOCALES = ['en', 'de', 'fr'];
   ```
4. Update middleware:
   ```typescript
   // middleware.ts
   const locales = ['en', 'de', 'fr'];
   ```

---

## Adding a New Country

1. Add to countries list:
   ```typescript
   // i18n/routing.ts
   export const COUNTRIES = [
     ...existingCountries,
     { code: 'au', name: 'Australia', defaultLocale: 'en', locales: ['en'] },
   ];
   ```
2. Add country default locale:
   ```typescript
   // middleware.ts
   const countryDefaults = {
     ...existing,
     au: 'en',
   };
   ```
3. Add translations:
   ```json
   // messages/en.json
   "countries": {
     ...existing,
     "au": "Australia"
   }
   ```
4. Add country data in CMS database

---

## Static Generation

The layout generates static params for all combinations:

```typescript
// app/[country]/[locale]/layout.tsx
export function generateStaticParams() {
  return COUNTRIES.flatMap((country) =>
    country.locales.map((locale) => ({
      country: country.code,
      locale: locale,
    }))
  );
}
```

This enables static generation for:
- `/us/en/`
- `/uk/en/`
- `/de/en/`
- `/de/de/`
- `/ca/en/`

