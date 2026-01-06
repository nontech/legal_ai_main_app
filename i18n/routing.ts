import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // All supported locales
    locales: ['en', 'de'],

    // Default locale
    defaultLocale: 'en',

    // Locale prefix configuration
    localePrefix: 'always',
});

// Country configuration
export const COUNTRIES = [
    { code: 'de', name: 'Germany', defaultLocale: 'de', locales: ['en', 'de'] },
    { code: 'uk', name: 'United Kingdom', defaultLocale: 'en', locales: ['en'] },
    { code: 'us', name: 'United States', defaultLocale: 'en', locales: ['en'] },
    { code: 'ca', name: 'Canada', defaultLocale: 'en', locales: ['en'] },
] as const;

export type CountryCode = typeof COUNTRIES[number]['code'];

export const DEFAULT_COUNTRY: CountryCode = 'us';
