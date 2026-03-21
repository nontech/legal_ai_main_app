"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import LogoLoader from "@/app/components/LogoLoader";

function EmailConfirmedContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const country = params.country as string;
    const locale = params.locale as string;
    const caseId = searchParams.get("caseId");
    const email = searchParams.get("email");

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(5);

    useEffect(() => {
        // Auto-redirect after 5 seconds if caseId is provided
        if (caseId) {
            const timer = setInterval(() => {
                setRedirectCountdown((prev) => {
                    if (prev <= 1) {
                        setIsRedirecting(true);
                        // Use full page reload to ensure Navbar updates
                        window.location.href = `/${country}/${locale}/case-analysis/${caseId}/jurisdiction`;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [caseId, country, locale]);

    const handleContinueAnalysis = () => {
        if (caseId) {
            // Use full page reload to ensure Navbar updates
            window.location.href = `/${country}/${locale}/case-analysis/${caseId}/jurisdiction`;
        }
    };

    const handleGoHome = () => {
        window.location.href = `/${country}/${locale}/auth/signin`;
    };

    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <div className="bg-surface-000 rounded-2xl border border-border-200/90 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.12)] p-8">
                    <div className="text-center">
                        {/* Animated Success Icon */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                {/* Outer circle animation */}
                                <div className="absolute inset-0 bg-success-500/20 rounded-full opacity-25 animate-ping"></div>
                                <div className="relative w-20 h-20 bg-success-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-success-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="font-display text-3xl font-medium text-ink-900 mb-2 tracking-tight">
                            Email confirmed
                        </h2>

                        <p className="text-ink-600 mb-2">
                            Your email has been successfully verified
                        </p>
                        {email && (
                            <p className="text-sm text-success-600 font-medium mb-6">
                                ✓ {email}
                            </p>
                        )}

                        <div className="bg-success-100/50 border border-success-500/20 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-success-700">
                                <span className="font-semibold">Great!</span> Your account is now active. You have full access to all features and can start analyzing your cases.
                            </p>
                        </div>

                        {/* Info Box */}
                        {caseId && !isRedirecting && (
                            <div className="bg-primary-50/80 border border-primary-100 rounded-lg p-4 mb-6">
                                <p className="text-sm text-primary-900">
                                    Redirecting to your case analysis in <span className="font-bold">{redirectCountdown}s</span>...
                                </p>
                            </div>
                        )}

                        {isRedirecting && (
                            <div className="bg-primary-50/80 border border-primary-100 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <LogoLoader size="compact" aria-label="Redirecting" />
                                    <span className="text-sm text-primary-900">Redirecting to your case...</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {caseId && (
                                <button
                                    type="button"
                                    onClick={handleContinueAnalysis}
                                    disabled={isRedirecting}
                                    className="w-full px-4 py-3 bg-primary-800 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRedirecting ? "Redirecting..." : "Continue to Case Analysis"}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleGoHome}
                                className="cursor-pointer w-full px-4 py-3 text-ink-800 border border-border-200 rounded-lg font-semibold hover:bg-surface-100 transition-colors"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* What's Next */}
                        <div className="mt-8 pt-6 border-t border-border-200">
                            <p className="text-sm text-ink-600 font-medium mb-4">What&apos;s next?</p>
                            <ul className="text-sm text-ink-600 space-y-2 text-left">
                                <li className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Upload and analyze your case documents</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Get AI-powered insights and predictions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Set verdicts and create game plans</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Support Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-ink-600">
                        Need help?{" "}
                        <Link
                            href={`/${country}/${locale}/contact`}
                            className="text-primary-800 font-semibold hover:text-primary-950"
                        >
                            Contact support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function SuspenseFallback() {
    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-16">
            <div className="flex flex-col items-center justify-center">
                <LogoLoader size="lg" />
                <p className="mt-4 text-ink-500 font-medium">Loading...</p>
            </div>
        </div>
    );
}

export default function EmailConfirmedPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <EmailConfirmedContent />
        </Suspense>
    );
}

