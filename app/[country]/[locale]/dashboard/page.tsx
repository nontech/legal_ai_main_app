"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import CasePortfolio from "@/app/components/dashboard/CasePortfolio";
import HowItWorks from "@/app/components/dashboard/HowItWorks";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const params = useParams();
  const country = (params?.country as string) || "us";
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 18) return t("goodAfternoon");
    return t("goodEvening");
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/cases");
        setIsAuthenticated(res.status !== 401);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-ink-900">
      {isCheckingAuth && (
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-16">
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
        </div>
      )}

      {!isCheckingAuth && isAuthenticated && (
        <div className="pt-24 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1626] via-primary-900 to-[#152a45] p-6 sm:p-8 shadow-[0_24px_64px_-20px_rgba(6,12,20,0.55)]">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(249,196,105,0.15), transparent 50%)",
                }}
              />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-medium text-white mb-2 tracking-tight">
                    {getGreeting()}! 👋
                  </h1>
                  <p className="text-white/70 text-sm sm:text-base max-w-xl">
                    {t("welcomeBack")}
                  </p>
                </div>
                <a
                  href={`/${country}/${locale}/case-analysis`}
                  className="cursor-pointer self-start sm:self-auto rounded-lg bg-accent-500 px-6 py-3 font-semibold text-primary-950 shadow-lg transition-colors hover:bg-accent-400 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {t("newAnalysis")}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isCheckingAuth && (
        <main
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8 ${isAuthenticated ? "pt-6" : "pt-24"}`}
        >
          <CasePortfolio />
        </main>
      )}

      {!isCheckingAuth && isAuthenticated && <HowItWorks />}
    </div>
  );
}
