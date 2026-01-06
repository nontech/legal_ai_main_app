import { getRequestConfig } from 'next-intl/server';

const VALID_LOCALES = ['en', 'de'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
    // Get locale from requestLocale (set by setRequestLocale in layout)
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !VALID_LOCALES.includes(locale as any)) {
        locale = 'en';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
