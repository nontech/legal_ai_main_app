"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./LanguageSelector";

function LanguageSelectorWrapper() {
  return (
    <Suspense
      fallback={
        <div
          className="h-9 w-[4.5rem] rounded-lg bg-primary-900/[0.06] animate-pulse"
          aria-hidden
        />
      }
    >
      <LanguageSelector />
    </Suspense>
  );
}

function navItemActive(pathname: string, href: string, mode: "exact" | "prefix") {
  if (mode === "prefix") return pathname.startsWith(href);
  return pathname === href;
}

function ProductNavLinks({
  country,
  locale,
  pathname,
  className,
  linkClassName,
  onNavigate,
}: {
  country: string;
  locale: string;
  pathname: string;
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("navigation");
  const prefix = `/${country}/${locale}`;
  const items = [
    {
      href: `${prefix}/case-analysis`,
      label: t("caseAnalysis"),
      mode: "prefix" as const,
    },
    {
      href: `${prefix}/pricing`,
      label: t("pricing"),
      mode: "exact" as const,
    },
    {
      href: `${prefix}/documentation`,
      label: t("documentation"),
      mode: "exact" as const,
    },
    {
      href: `${prefix}/contact`,
      label: t("contact"),
      mode: "exact" as const,
    },
  ];

  const linkClasses = (active: boolean) => {
    if (linkClassName) {
      return [
        linkClassName,
        active
          ? "!text-primary-900 bg-primary-50 font-semibold shadow-[inset_0_0_0_1px_rgba(22,52,87,0.08)]"
          : "",
      ]
        .filter(Boolean)
        .join(" ");
    }
    return [
      "relative text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg outline-none",
      "focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]",
      active
        ? "text-primary-900 bg-primary-50 shadow-[inset_0_0_0_1px_rgba(22,52,87,0.1)]"
        : "text-ink-600 hover:text-primary-900 hover:bg-primary-50/50",
    ].join(" ");
  };

  return (
    <div className={className}>
      {items.map(({ href, label, mode }) => {
        const active = navItemActive(pathname, href, mode);
        return (
          <Link
            key={href}
            href={href}
            className={linkClasses(active)}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const params = useParams();
  const pathname = usePathname() ?? "";
  const country = params.country as string;
  const locale = params.locale as string;
  const prefix = `/${country}/${locale}`;
  const t = useTranslations("navigation");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/cases");
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else if (res.ok) {
          setIsAuthenticated(true);

          const userRes = await fetch("/api/auth/user");
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.email) {
              setUserEmail(userData.email);
              sessionStorage.setItem("userEmail", userData.email);
            }
          } else {
            const cachedEmail = sessionStorage.getItem("userEmail");
            if (cachedEmail) {
              setUserEmail(cachedEmail);
            }
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

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const close = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const handleSignOut = useCallback(async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      sessionStorage.removeItem("userEmail");
      sessionStorage.clear();
      localStorage.clear();

      setIsAuthenticated(false);
      setUserEmail(null);
      setIsUserMenuOpen(false);

      window.location.href = "/";
    } catch (e) {
      console.error("Sign out failed:", e);
      window.location.href = "/";
    }
  }, []);

  const dashboardActive = pathname.startsWith(`${prefix}/dashboard`);
  const homeActive = pathname === prefix || pathname === `${prefix}/`;

  const dashboardLinkClass = [
    "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]",
    dashboardActive
      ? "text-primary-900 bg-primary-50 shadow-[inset_0_0_0_1px_rgba(22,52,87,0.1)]"
      : "text-ink-600 hover:text-primary-900 hover:bg-primary-50/50",
  ].join(" ");

  const mobileLinkIdle =
    "text-sm font-medium text-ink-700 transition-colors px-4 py-2.5 rounded-xl hover:bg-primary-50/80 hover:text-primary-900 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/35";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="border-b border-primary-900/12 bg-gradient-to-b from-white via-[#faf8f5] to-[#f2ebdf] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_28px_-14px_rgba(15,31,53,0.14)]"
        aria-label={t("mainNavigation")}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex justify-between items-center h-[3.75rem] sm:h-[4.25rem]">
            <Link
              href={prefix}
              className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 rounded-xl pr-2 -ml-1 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
              aria-current={homeActive ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-800/12 to-accent-500/10 p-2 ring-1 ring-primary-900/10 shadow-sm transition-all duration-300 group-hover:from-primary-800/18 group-hover:to-accent-500/15 group-hover:ring-primary-900/15">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-primary-800"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden={true}
                  focusable={false}
                >
                  <path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.828 2.83-5.657-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display text-base sm:text-lg font-semibold text-primary-950 tracking-tight leading-tight">
                  TheLawThing
                </span>
                <span className="hidden sm:block text-[10px] font-medium uppercase tracking-[0.14em] text-primary-700/70 truncate max-w-[11rem] lg:max-w-none">
                  {t("brandTagline")}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
              <ProductNavLinks
                country={country}
                locale={locale}
                pathname={pathname}
                className="hidden lg:flex items-center gap-1 mr-1"
              />
              <div className="pl-1 lg:pl-2 pr-0.5">
                <LanguageSelectorWrapper />
              </div>

              {isLoading ? (
                <div className="pl-2 pr-3 py-2" aria-busy="true" aria-live="polite">
                  <div className="h-8 w-24 rounded-lg bg-primary-900/[0.06] animate-pulse" />
                </div>
              ) : isAuthenticated ? (
                <>
                  <Link href={`${prefix}/dashboard`} className={dashboardLinkClass}>
                    <svg
                      className="w-4 h-4 shrink-0 opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden={true}
                      focusable={false}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>{t("dashboard")}</span>
                  </Link>

                  <div className="relative ml-0.5" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((o) => !o)}
                      className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 text-ink-700 font-medium transition-all duration-200 rounded-xl hover:bg-primary-50/70 border border-transparent hover:border-primary-900/10 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="menu"
                      aria-label={t("userMenu")}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-50 text-primary-800 text-xs font-bold ring-1 ring-primary-900/10 shadow-sm">
                        {(userEmail || t("account")).slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-sm max-w-[8.5rem] lg:max-w-[12rem] truncate hidden sm:inline">
                        {userEmail || t("account")}
                      </span>
                      <svg
                        className={`w-4 h-4 shrink-0 text-primary-800/70 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden={true}
                        focusable={false}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isUserMenuOpen && (
                      <div
                        role="menu"
                        aria-orientation="vertical"
                        className="absolute right-0 mt-2 w-52 py-1.5 rounded-xl bg-gradient-to-b from-[#fdfcfa] to-[#f5f0e8] border border-primary-900/12 shadow-[0_16px_40px_-12px_rgba(15,31,53,0.22)] z-50"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleSignOut}
                          className="w-[calc(100%-0.5rem)] mx-auto block text-left px-4 py-2.5 text-sm text-critical-600 hover:bg-critical-500/[0.08] transition-colors cursor-pointer rounded-lg"
                        >
                          {t("signOut")}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={`${prefix}/auth/signin`}
                    className="relative px-3 py-2 text-sm font-medium text-ink-600 hover:text-primary-900 rounded-lg hover:bg-primary-50/50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
                  >
                    {t("signIn")}
                  </Link>

                  <Link
                    href={`${prefix}/auth/signup`}
                    className="ml-2 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-[0_4px_14px_-4px_rgba(22,52,87,0.55)] hover:shadow-[0_6px_20px_-4px_rgba(22,52,87,0.45)] hover:brightness-[1.03] transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
                  >
                    {t("signUp")}
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="md:hidden ml-2 p-2.5 rounded-xl text-primary-900 hover:bg-primary-50/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="site-mobile-nav"
              aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden={true}
                focusable={false}
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

          {isMobileMenuOpen && (
            <div
              id="site-mobile-nav"
              className="md:hidden border-t border-primary-900/10 py-3 bg-gradient-to-b from-[#faf8f5] to-[#ebe4d9] -mx-3 sm:-mx-5 px-3 sm:px-5"
            >
              <div className="px-1 pb-3 mb-2 border-b border-primary-900/[0.07]">
                <LanguageSelectorWrapper />
              </div>

              <ProductNavLinks
                country={country}
                locale={locale}
                pathname={pathname}
                className="flex flex-col gap-0.5 py-1"
                linkClassName={mobileLinkIdle}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />

              {!isLoading && isAuthenticated ? (
                <div className="mt-2 pt-2 border-t border-primary-900/[0.07] space-y-1">
                  <Link
                    href={`${prefix}/dashboard`}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${dashboardActive ? "bg-primary-50 text-primary-900 shadow-[inset_0_0_0_1px_rgba(22,52,87,0.08)]" : `${mobileLinkIdle} text-ink-700`}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden={true}
                      focusable={false}
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

                  <div className="px-4 py-3 rounded-xl bg-primary-900/[0.04] mt-2">
                    <div className="flex items-center gap-2 mb-2 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-50 text-primary-800 text-xs font-bold ring-1 ring-primary-900/10">
                        {(userEmail || t("account")).slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-sm text-ink-700 truncate">{userEmail || t("account")}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-critical-600 hover:bg-critical-500/10 rounded-lg transition-colors"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              ) : !isLoading ? (
                <div className="space-y-2 border-t border-primary-900/[0.07] mt-2 pt-3">
                  <Link
                    href={`${prefix}/auth/signin`}
                    className={`block text-center ${mobileLinkIdle}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("signIn")}
                  </Link>
                  <Link
                    href={`${prefix}/auth/signup`}
                    className="block px-4 py-2.5 bg-gradient-to-r from-primary-900 to-primary-800 text-white hover:brightness-105 rounded-xl font-semibold text-center text-sm shadow-md transition-all"
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
    </header>
  );
}
