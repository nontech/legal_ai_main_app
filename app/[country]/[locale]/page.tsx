"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HeroSection from "@/app/components/dashboard/HeroSection";
import CasePortfolio from "@/app/components/dashboard/CasePortfolio";
import ConfidentialByDesign from "@/app/components/dashboard/ConfidentialByDesign";

import PretrialProcess from "@/app/components/PretrialProcess";
import UseCases from "@/app/components/UseCases";

export const dynamic = "force-dynamic";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';
  const [isPretrialOpen, setIsPretrialOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
    <div className="min-h-screen bg-surface-100 text-ink-900">
      {/* Loading State */}
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

      {/* Authenticated User Layout: Welcome → Portfolio → Hero → Others */}
      {!isCheckingAuth && isAuthenticated && (
        <>
          {/* Welcome Header */}
          <div className="pt-24 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {getGreeting()}! 👋
                    </h1>
                    <p className="text-primary-100 text-sm sm:text-base">
                      Welcome back to your legal analysis dashboard. Ready to analyze a new case?
                    </p>
                  </div>
                  <a
                    href={`/${country}/${locale}/case-analysis`}
                    className="cursor-pointer self-start sm:self-auto bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
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
                    New Analysis
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Case Portfolio */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
            <CasePortfolio />
          </main>

          {/* Hero Section */}
          <HeroSection />

          {/* Confidential by Design Section */}
          <ConfidentialByDesign />
          {/* Who are you? Section */}
          <UseCases />
        </>
      )}

      {/* Unauthenticated User Layout: Hero → Portfolio → Others */}
      {!isCheckingAuth && !isAuthenticated && (
        <>
          <div className="pt-20">
            {/* Hero Section */}
            <HeroSection />
          </div>

          {/* Main Content */}
          <main className={`max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 `}>
            {/* Case Portfolio */}
            <CasePortfolio />
          </main>

          {/* Confidential by Design Section */}
          <ConfidentialByDesign />
          {/* Who are you? Section */}
          <UseCases />
        </>
      )}

      {/* Pretrial Process Modal */}
      {isPretrialOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-primary-950/80 transition-opacity"
              onClick={() => setIsPretrialOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-7xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface-050 shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-8 h-8 text-white"
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
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Pretrial Process &amp; Motions
                      </h2>
                      <p className="text-primary-100 text-sm">
                        Manage all pretrial procedures, discovery, and
                        motions
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPretrialOpen(false)}
                    className="text-white hover:text-surface-200 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
                <PretrialProcess />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
