"use client";

import { useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SignInContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const country = params.country as string;
    const locale = params.locale as string;
    const caseId = searchParams.get("caseId");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, caseId }),
            });

            const json = await res.json();

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Sign-in failed");
            }

            // Store email in sessionStorage
            if (json.email) {
                sessionStorage.setItem("userEmail", json.email);
            }

            // Small delay to ensure sessionStorage write completes
            await new Promise(resolve => setTimeout(resolve, 50));

            // Redirect to dashboard or case page using full page reload
            // This ensures Navbar and other components re-fetch auth status
            if (caseId) {
                window.location.href = `/${country}/${locale}/case-analysis/${caseId}/results`;
            } else {
                window.location.href = `/${country}/${locale}/dashboard`;
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

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
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h1 className="font-display text-3xl font-medium text-ink-900 mb-2 tracking-tight">Welcome back</h1>
                    <p className="text-ink-600">Sign in to access your cases and analysis</p>
                </div>

                <div className="bg-surface-000 rounded-2xl border border-border-200/90 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.12)] p-8">
                    <form onSubmit={handleSignIn} className="space-y-5">
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

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-ink-700">
                                    Password
                                </label>
                                <Link
                                    href={`/${country}/${locale}/auth/forgot-password`}
                                    className="text-sm text-primary-800 hover:text-primary-950 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-ink-900 bg-surface-000"
                            />
                        </div>

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
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-border-200"></div>
                        <span className="px-3 text-sm text-ink-500">or</span>
                        <div className="flex-1 border-t border-border-200"></div>
                    </div>

                    <p className="text-center text-ink-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={`/${country}/${locale}/auth/signup`}
                            className="text-primary-800 font-semibold hover:text-primary-950"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

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

export default function SignInPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <SignInContent />
        </Suspense>
    );
}

