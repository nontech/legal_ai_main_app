"use client";

import { useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./LanguageSelector";

interface NavbarProps {
  onPretrialClick?: () => void;
  showPretrialButton?: boolean;
}

export default function Navbar({ onPretrialClick, showPretrialButton = false }: NavbarProps) {
  const router = useRouter();
  const params = useParams();
  const country = params.country as string;
  const locale = params.locale as string;
  const t = useTranslations("navigation");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSignOut = useCallback(async () => {
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
  }, []);

  return (
    <nav className="bg-surface-000/90 backdrop-blur-md border-b border-border-200 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <Link href={`/${country}/${locale}`} className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-ink-900"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.828 2.83-5.657-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-md sm:text-lg lg:text-xl font-bold text-ink-900 leading-tight">
                TheLawThing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
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
                <span>{t("pretrialProcess")}</span>
              </button>
            )}

            <div className="px-3">
              <LanguageSelector />
            </div>

            {isLoading ? (
              <div className="px-4 py-2.5 text-ink-600">
                <div className="w-8 h-4 bg-surface-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              // Authenticated User - Dashboard link + User Menu
              <>
                <Link
                  href={`/${country}/${locale}`}
                  className="relative px-4 py-2.5 text-ink-600 hover:text-ink-900 font-medium transition-all duration-200 group flex items-center gap-1.5"
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="relative z-10">{t("dashboard")}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* User Menu */}
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
                    <span className="text-sm">{userEmail || t("account")}</span>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface-000 rounded-lg shadow-lg border border-border-200 py-2 z-50">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-critical-500 cursor-pointer hover:bg-critical-100 transition-colors"
                      >
                        {t("signOut")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Auth Buttons - Not Authenticated
              <>
                <Link
                  href={`/${country}/${locale}/auth/signin`}
                  className="relative px-4 py-2.5 text-ink-600 hover:text-ink-900 font-medium transition-all duration-200 group"
                >
                  <span className="relative z-10 cursor-pointer">{t("signIn")}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </Link>

                <div className="ml-2 pl-2 border-l border-border-200">
                  <Link
                    href={`/${country}/${locale}/auth/signup`}
                    className="px-6 py-2.5 bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 inline-block"
                  >
                    {t("signUp")}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden ml-2 p-2 rounded-lg hover:bg-surface-100 transition-colors text-ink-600"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-200 py-3 space-y-2">
            {/* Language Selector - Mobile */}
            <div className="px-4 pb-3 border-b border-border-200">
              <LanguageSelector />
            </div>

            {isAuthenticated && showPretrialButton && (
              <button
                onClick={() => {
                  onPretrialClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 bg-gradient-to-r from-primary-700 to-primary-600 text-white hover:from-primary-800 hover:to-primary-700 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
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
                <span>{t("pretrialProcess")}</span>
              </button>
            )}

            {!isLoading && isAuthenticated ? (
              <>
                {/* Dashboard Link - Mobile */}
                <Link
                  href={`/${country}/${locale}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-ink-600 hover:text-ink-900 hover:bg-surface-100 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {t("dashboard")}
                </Link>

                {/* User Info & Sign Out - Mobile */}
                <div className="px-4 py-2.5 border-t border-border-200 mt-2 pt-2">
                  <div className="flex items-center gap-2 mb-2">
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
                    <span className="text-sm text-ink-600 truncate">{userEmail || t("account")}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-critical-500 hover:bg-critical-100 rounded transition-colors"
                  >
                    {t("signOut")}
                  </button>
                </div>
              </>
            ) : !isLoading ? (
              // Mobile Auth Buttons
              <div className="space-y-2 border-t border-border-200 mt-2 pt-2">
                <Link
                  href={`/${country}/${locale}/auth/signin`}
                  className="cursor-pointer block px-4 py-2.5 text-ink-600 hover:text-ink-900 hover:bg-surface-100 rounded-lg transition-colors font-medium text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("signIn")}
                </Link>
                <Link
                  href={`/${country}/${locale}/auth/signup`}
                  className="block px-4 py-2.5 bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400 rounded-lg font-semibold transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("signUp")}
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
