import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { localeRedirectPath } from './lib/localeMiddleware.ts';
import { seoPublicPath, seoRewritePath } from './lib/seo/routes.ts';

export function middleware(request: NextRequest) {
    const rewritePath = seoRewritePath(request.nextUrl.pathname);
    if (rewritePath) {
        const url = request.nextUrl.clone();
        url.pathname = rewritePath;
        return NextResponse.rewrite(url);
    }

    const canonicalSeoPath = seoPublicPath(request.nextUrl.pathname);
    if (canonicalSeoPath) {
        const url = request.nextUrl.clone();
        url.pathname = canonicalSeoPath;
        return NextResponse.redirect(url, 308);
    }

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
        '/((?!api|ingest|share|_next|_vercel|.*\\..*).*)',
    ],
};
