import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { localeRedirectPath } from './lib/localeMiddleware.ts';

export function middleware(request: NextRequest) {
    const nextPath = localeRedirectPath(request.nextUrl.pathname);
    if (nextPath === null) {
        return NextResponse.next();
    }

    request.nextUrl.pathname = nextPath;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - API routes
        // - PostHog reverse proxy (/ingest)
        // - _next (Next.js internals)
        // - _vercel (Vercel internals)
        // - Files with extensions (e.g. favicon.ico)
        '/((?!api|ingest|_next|_vercel|.*\\..*).*)',
    ],
};
