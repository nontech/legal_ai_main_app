import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COUNTRIES, DEFAULT_COUNTRY } from './i18n/routing';

const countries = COUNTRIES.map(c => c.code);
const locales = ['en', 'de'];

// Country-specific default locales
const countryDefaults: Record<string, string> = {
    de: 'de',  // Germany defaults to German
    uk: 'en',
    us: 'en',
    ca: 'en',
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip API routes, static files, and Next.js internals
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/_vercel') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has country/locale pattern
    const pathnameHasCountryLocale = countries.some(
        (country) => locales.some(
            (locale) =>
                pathname.startsWith(`/${country}/${locale}/`) ||
                pathname === `/${country}/${locale}`
        )
    );

    if (pathnameHasCountryLocale) {
        return NextResponse.next();
    }

    // ONLY redirect root path to default country/locale
    // Leave all other existing routes untouched
    if (pathname === '/') {
        const defaultLocale = (countryDefaults as Record<string, string>)[DEFAULT_COUNTRY] || 'en';
        request.nextUrl.pathname = `/${DEFAULT_COUNTRY}/${defaultLocale}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // If only country is specified (e.g., /de), add default locale for that country
    const countryMatch = pathname.match(/^\/([a-z]{2})$/);
    if (countryMatch && countries.includes(countryMatch[1])) {
        const country = countryMatch[1];
        const locale = (countryDefaults as Record<string, string>)[country] || 'en';
        request.nextUrl.pathname = `/${country}/${locale}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // Let all other routes pass through unchanged
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - API routes
        // - _next (Next.js internals)
        // - _vercel (Vercel internals)
        // - Files with extensions (e.g. favicon.ico)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
