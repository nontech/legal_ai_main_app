"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onPretrialClick?: () => void;
  showPretrialButton?: boolean;
}

export default function Navbar({ onPretrialClick, showPretrialButton = false }: NavbarProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/cases");
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else if (res.ok) {
          setIsAuthenticated(true);
          // Try to get user info from localStorage or session
          const userInfo = sessionStorage.getItem("userEmail");
          if (userInfo) {
            setUserEmail(userInfo);
          }
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      // Call server-side sign-out endpoint
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Clear local session data
      sessionStorage.removeItem("userEmail");
      sessionStorage.clear();

      // Clear any stored case data
      localStorage.clear();

      setIsAuthenticated(false);
      setUserEmail(null);
      setIsUserMenuOpen(false);

      // Refresh page to reset all components to unauthenticated state
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out failed:", e);
      // Still redirect even if sign-out fails
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-surface-000/90 backdrop-blur-md border-b border-border-200 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-900 to-primary-600 bg-clip-text text-transparent leading-tight">
                Legal Case Analysis
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {isAuthenticated && showPretrialButton && (
              <button
                onClick={onPretrialClick}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-700 to-primary-600 text-white hover:from-primary-800 hover:to-primary-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Pretrial Process</span>
              </button>
            )}

            {isAuthenticated && (
              <Link
                href="/documents"
                className="relative px-4 py-2.5 text-ink-600 hover:text-ink-900 font-medium transition-all duration-200 group"
              >
                <span className="relative z-10">Documents Library</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {isLoading ? (
              <div className="px-4 py-2.5 text-ink-600">
                <div className="w-8 h-4 bg-surface-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              // User Menu - Authenticated
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 text-ink-600 hover:text-ink-900 font-medium transition-all duration-200 rounded-lg hover:bg-surface-100 cursor-pointer"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">{userEmail || "Account"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-000 rounded-lg shadow-lg border border-border-200 py-2 z-50">
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-ink-600 hover:bg-surface-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-critical-500 cursor-pointer hover:bg-critical-100 transition-colors border-t border-border-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Auth Buttons - Not Authenticated
              <>
                <Link
                  href="/auth/signin"
                  className="relative px-4 py-2.5 text-ink-600 hover:text-ink-900 font-medium transition-all duration-200 group"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </Link>

                <div className="ml-2 pl-2 border-l border-border-200">
                  <Link
                    href="/auth/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 inline-block"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
