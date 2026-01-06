"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const country = params.country as string;
    const locale = params.locale as string;
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
    
    // Ref to prevent double execution in React StrictMode
    const hasAttemptedExchange = useRef(false);

    useEffect(() => {
        // Check for error parameters from Supabase (e.g., expired link)
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        const errorCode = searchParams.get("error_code");
        
        if (errorParam || errorCode) {
            const message = errorDescription 
                ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
                : "Invalid or expired reset link. Please request a new one.";
            setError(message);
            setIsValidSession(false);
            return;
        }

        // Check if we have a valid session from the password reset link
        const checkSession = async () => {
            // Prevent double execution (React StrictMode runs effects twice)
            if (hasAttemptedExchange.current) {
                return;
            }
            
            const supabase = getSupabaseBrowserClient();
            
            if (typeof window !== "undefined") {
                // Check for code parameter (PKCE flow)
                const code = searchParams.get("code");
                if (code) {
                    // Mark that we've attempted exchange (PKCE codes are single-use)
                    hasAttemptedExchange.current = true;
                    
                    // Exchange the code for a session
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) {
                        console.error("Code exchange error:", exchangeError);
                        setError("Invalid or expired reset link. Please request a new one.");
                        setIsValidSession(false);
                        return;
                    }
                    setIsValidSession(true);
                    // Clean up the URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return;
                }

                // Handle the hash fragment that Supabase uses for password reset (implicit flow)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get("access_token");
                const refreshToken = hashParams.get("refresh_token");
                const type = hashParams.get("type");

                if (accessToken && refreshToken && type === "recovery") {
                    hasAttemptedExchange.current = true;
                    
                    // Set the session from the recovery tokens
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (sessionError) {
                        setError("Invalid or expired reset link. Please request a new one.");
                        setIsValidSession(false);
                        return;
                    }
                    
                    setIsValidSession(true);
                    // Clean up the URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return;
                }

                // Check if there's already an active session
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setIsValidSession(true);
                } else {
                    setError("Invalid or expired reset link. Please request a new one.");
                    setIsValidSession(false);
                }
            }
        };

        checkSession();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const supabase = getSupabaseBrowserClient();
            
            // Update the user's password
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                throw new Error(updateError.message);
            }

            setSuccess(true);
            
            // Redirect to sign in after 3 seconds
            setTimeout(() => {
                router.push(`/${country}/${locale}/auth/signin`);
            }, 3000);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while checking session
    if (isValidSession === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                        <p className="text-center text-gray-600 mt-4">Verifying reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid session
    if (!isValidSession) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Link Expired
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {error || "This password reset link is invalid or has expired."}
                            </p>

                            <Link
                                href={`/${country}/${locale}/auth/forgot-password`}
                                className="inline-block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center"
                            >
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href={`/${country}/${locale}/auth/signin`}
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                            ← Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-200 rounded-full opacity-25 animate-ping"></div>
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

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Password Updated!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    Redirecting to sign in page...
                                </p>
                            </div>

                            <Link
                                href={`/${country}/${locale}/auth/signin`}
                                className="inline-block w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-center"
                            >
                                Sign In Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4">
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
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Set new password</h1>
                    <p className="text-gray-600">Create a strong password for your account</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            />
                            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                </div>

                {/* Back to Sign In */}
                <div className="mt-6 text-center">
                    <Link
                        href={`/${country}/${locale}/auth/signin`}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SuspenseFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <ResetPasswordContent />
        </Suspense>
    );
}

