"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function EmailConfirmedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
                        router.push(`/case-analysis/detailed?step=0&caseId=${caseId}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [caseId, router]);

    const handleContinueAnalysis = () => {
        if (caseId) {
            router.push(`/case-analysis/detailed?step=0&caseId=${caseId}`);
        }
    };

    const handleGoHome = () => {
        router.push("/auth/signin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center">
                        {/* Animated Success Icon */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                {/* Outer circle animation */}
                                <div className="absolute inset-0 bg-green-200 rounded-full opacity-25 animate-ping"></div>
                                {/* Main icon */}
                                <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-green-600"
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Email Confirmed!
                        </h2>

                        {/* Subheading */}
                        <p className="text-gray-600 mb-2">
                            Your email has been successfully verified
                        </p>
                        {email && (
                            <p className="text-sm text-green-600 font-medium mb-6">
                                ✓ {email}
                            </p>
                        )}

                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-green-800">
                                <span className="font-semibold">Great!</span> Your account is now active. You have full access to all features and can start analyzing your cases.
                            </p>
                        </div>

                        {/* Info Box */}
                        {caseId && !isRedirecting && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    Redirecting to your case analysis in <span className="font-bold">{redirectCountdown}s</span>...
                                </p>
                            </div>
                        )}

                        {isRedirecting && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-sm text-blue-800">Redirecting to your case...</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {caseId && (
                                <button
                                    onClick={handleContinueAnalysis}
                                    disabled={isRedirecting}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRedirecting ? "Redirecting..." : "Continue to Case Analysis"}
                                </button>
                            )}

                            <button
                                onClick={handleGoHome}
                                className="cursor-pointer w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* What's Next */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 font-medium mb-4">What's next?</p>
                            <ul className="text-sm text-gray-600 space-y-2 text-left">
                                <li className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Upload and analyze your case documents</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Get AI-powered insights and predictions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                    <p className="text-sm text-gray-600">
                        Need help?{" "}
                        <Link
                            href="/contact"
                            className="text-green-600 font-semibold hover:text-green-700"
                        >
                            Contact support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function EmailConfirmedPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailConfirmedContent />
        </Suspense>
    );
}

