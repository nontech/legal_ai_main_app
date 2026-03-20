"use client";

import { useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SignUpContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const country = params.country as string;
    const locale = params.locale as string;
    const caseId = searchParams.get("caseId");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, caseId }),
            });

            const json = await res.json();

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Sign-up failed");
            }

            // Store email and caseId in sessionStorage for later
            if (json.email) {
                sessionStorage.setItem("userEmail", json.email);
                sessionStorage.setItem("pendingCaseId", caseId || "");
            }

            // Show email confirmation screen
            setShowEmailConfirmation(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    // Email confirmation screen
    if (showEmailConfirmation) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    <div className="bg-surface-000 rounded-2xl border border-border-200/90 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.12)] p-8">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mx-auto mb-6">
                                <svg
                                    className="w-8 h-8 text-success-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>

                            {/* Heading */}
                            <h2 className="font-display text-2xl font-medium text-ink-900 mb-3 tracking-tight">
                                Check your email
                            </h2>

                            <p className="text-ink-600 mb-2">
                                We&apos;ve sent a confirmation link to:
                            </p>
                            <p className="text-lg font-semibold text-primary-800 mb-6">
                                {email}
                            </p>

                            <div className="bg-primary-50/80 border border-primary-100 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm text-ink-800 mb-3 font-medium">
                                    To complete your registration:
                                </p>
                                <ol className="text-sm text-ink-600 space-y-2 list-decimal list-inside">
                                    <li>Open the email we sent to you</li>
                                    <li>Click the confirmation link in the email</li>
                                    <li>Your account will be activated immediately</li>
                                </ol>
                            </div>

                            {/* Info Box */}
                            <div className="bg-warning-100/60 border border-warning-500/25 rounded-lg p-4 mb-6">
                                <p className="text-sm text-warning-600">
                                    💡 <span className="font-medium">Tip:</span> Check your spam or junk folder if you don&apos;t see the email
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-ink-600 mb-3">
                            Already confirmed your email?
                        </p>
                        <Link
                            href={`/${country}/${locale}/auth/signin`}
                            className="text-primary-800 font-semibold hover:text-primary-950"
                        >
                            Go to Sign In →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Sign up form
    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-800 rounded-lg mx-auto mb-4 shadow-sm">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h1 className="font-display text-3xl font-medium text-ink-900 mb-2 tracking-tight">Create account</h1>
                    <p className="text-ink-600">Sign up to save and analyze your cases</p>
                </div>

                <div className="bg-surface-000 rounded-2xl border border-border-200/90 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.12)] p-8">
                    <form onSubmit={handleSignUp} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-ink-900 bg-surface-000"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-ink-900 bg-surface-000"
                            />
                            <p className="text-xs text-ink-500 mt-1">
                                Must be at least 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-ink-900 bg-surface-000"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-critical-100 border border-critical-500/20 rounded-lg">
                                <p className="text-sm text-critical-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer w-full px-4 py-3 bg-primary-800 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-border-200"></div>
                        <span className="px-3 text-sm text-ink-500">or</span>
                        <div className="flex-1 border-t border-border-200"></div>
                    </div>

                    <p className="text-center text-ink-600">
                        Already have an account?{" "}
                        <Link
                            href={`/${country}/${locale}/auth/signin`}
                            className="text-primary-800 font-semibold hover:text-primary-950"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link
                        href={`/${country}/${locale}`}
                        className="text-sm text-ink-600 hover:text-ink-900 font-medium"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SuspenseFallback() {
    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-16">
            <div className="flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-primary-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.828 2.83-5.657-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z" />
                        </svg>
                    </div>
                </div>
                <p className="mt-4 text-ink-500 font-medium">Loading...</p>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <SignUpContent />
        </Suspense>
    );
}

