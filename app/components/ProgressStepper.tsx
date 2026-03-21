"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LogoLoader from "./LogoLoader";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  subSections: number; // Number of sub-sections for percentage calculation
}

interface ProgressStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  completionData?: { [key: number]: number }; // Track completion for each step (0-100%)
  caseId?: string; // Case ID to link after auth
  caseType?: string; // Case type to determined "Charges" vs "Claims" label
}

export default function ProgressStepper({
  currentStep,
  onStepChange,
  completionData = {},
  caseId,
  caseType,
}: ProgressStepperProps) {
  const t = useTranslations("caseAnalysis");
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCaseOwner, setIsCaseOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication status and case ownership
    const checkAuthAndOwnership = async () => {
      setIsLoading(true);
      try {
        // Check authentication
        const authRes = await fetch("/api/cases");
        const isAuth = authRes.status !== 401;
        setIsAuthenticated(isAuth);

        // Check case ownership if authenticated and caseId provided
        if (isAuth && caseId) {
          try {
            const ownershipRes = await fetch(`/api/cases/${caseId}/ownership`);
            if (ownershipRes.ok) {
              const { isOwner } = await ownershipRes.json();
              console.log(`[ProgressStepper] Ownership check for case ${caseId}: isOwner=${isOwner}`);
              setIsCaseOwner(isOwner);
            } else {
              console.log(`[ProgressStepper] Ownership check failed with status: ${ownershipRes.status}`);
              setIsCaseOwner(false);
            }
          } catch (err) {
            console.error(`[ProgressStepper] Ownership check error:`, err);
            setIsCaseOwner(false);
          }
        } else {
          // No caseId means we're not on a case page, unlock all steps for authenticated users
          setIsCaseOwner(isAuth);
        }
      } catch {
        setIsAuthenticated(false);
        setIsCaseOwner(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndOwnership();
  }, [caseId]);

  useEffect(() => {
    // Handle scroll detection
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const element = scrollContainerRef.current;
        const hasScrollDown =
          element.scrollHeight > element.clientHeight &&
          element.scrollTop < element.scrollHeight - element.clientHeight - 10;
        const hasScrollUp = element.scrollTop > 10;

        setCanScrollDown(hasScrollDown);
        setCanScrollUp(hasScrollUp);
      }
    };

    const element = scrollContainerRef.current;
    if (element) {
      // Check initial state
      handleScroll();
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [isAuthenticated, isCaseOwner]);

  const steps: Step[] = [
    {
      id: "jurisdiction",
      label: t("steps.jurisdiction"),
      subSections: 1,
      icon: (
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
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
    },
    {
      id: "tenancy",
      label: t("steps.tenancyStatus"),
      subSections: 1,
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "role",
      label: t("steps.role"),
      subSections: 1,
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: "case-details",
      label: t("steps.caseDetails"),
      subSections: 6,
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "results",
      label: t("steps.results"),
      subSections: 1,
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      id: "game-plan",
      label: t("steps.gamePlan"),
      subSections: 1,
      icon: (
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  const getCompletion = (index: number) => {
    return completionData[index] || 0;
  };

  const getStepLabel = (stepId: string) => {
    if (stepId === "charges") {
      const isCriminal = caseType?.toLowerCase() === "criminal";
      return isCriminal ? t("steps.charges") : t("steps.claims");
    }
    const step = steps.find(s => s.id === stepId);
    return step?.label || "";
  };

  const handleStepNavigation = async (stepIndex: number) => {
    if (!caseId) return;
    const navigationGuard = (window as any).__caseDetailsNavigationGuard;
    if (typeof navigationGuard === "function") {
      const canNavigate = await navigationGuard();
      if (!canNavigate) return;
    }
    const step = steps[stepIndex];
    if (step) {
      router.push(`/${country}/${locale}/case-analysis/${caseId}/${step.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed right-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-64 flex-col border-l border-border-200 bg-gradient-to-b from-surface-050 to-surface-100 shadow-[inset_1px_0_0_rgba(36,85,136,0.06),-8px_0_32px_-12px_rgba(18,24,38,0.12)]">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-primary-400/50 via-primary-500/30 to-primary-700/20"
            aria-hidden
          />
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-8">
            <LogoLoader size="md" aria-label={t("loading")} />
            <p className="mt-4 text-sm font-medium text-ink-600">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  // For unauthenticated users or users who don't own the case, show all steps but lock them except Results
  if (!isAuthenticated || (isAuthenticated && caseId && !isCaseOwner)) {
    return (
      <>
        <div className="fixed right-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-64 flex-col border-l border-border-200 bg-gradient-to-b from-surface-050 to-surface-100 shadow-[inset_1px_0_0_rgba(36,85,136,0.06),-8px_0_32px_-12px_rgba(18,24,38,0.12)]">
          <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-primary-400/50 via-primary-500/30 to-primary-700/20"
              aria-hidden
            />
            <div ref={scrollContainerRef} className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-6 pt-8">
            <div className="mb-4 border-b border-border-200/90 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-600">
                {t("results.overview")}
              </h2>
            </div>

            {/* Steps */}
            <div className="flex flex-col flex-1">
              {steps.map((step, index) => {
                const isResultsStep = step.id === "results";

                return (
                  <div key={step.id} className="relative">
                    {/* Step Item */}
                    <button
                      onClick={() => {
                        if (isResultsStep) {
                          void handleStepNavigation(index);
                        } else {
                          setAuthModalMode("signin");
                          setShowAuthModal(true);
                        }
                      }}
                      className={`group flex w-full items-center rounded-xl border-2 px-2.5 py-2.5 transition-all duration-200 ${isResultsStep
                        ? "cursor-pointer border-transparent hover:bg-surface-100/90"
                        : "cursor-pointer border-transparent opacity-75 hover:bg-surface-100/80"
                        }`}
                    >
                      {/* Step Icon - current filled, previous outlined, future gray */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                            index === currentStep
                              ? "scale-105 bg-primary-600 text-white shadow-md ring-2 ring-primary-500/25"
                              : index < currentStep
                                ? "border-2 border-primary-500 bg-surface-000 text-primary-600"
                                : "bg-surface-200 text-ink-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                        {!isResultsStep && (
                          <div className="absolute -right-1 -top-1 rounded-full bg-ink-400 p-1 ring-2 ring-surface-050">
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Step Label - highlighted up to current step */}
                      <div className="ml-3 flex-1 text-left">
                        <div
                          className={`text-sm font-semibold transition-colors ${
                            index <= currentStep ? "text-primary-700" : "text-ink-400"
                          }`}
                        >
                          {getStepLabel(step.id)}
                        </div>
                        {!isResultsStep && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="h-3 w-3 text-ink-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-medium text-ink-400">{t("common.locked")}</span>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Vertical Connector Line - highlighted up to current step */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-start ml-8 py-1">
                        <div
                          className={`h-4 w-0.5 rounded-full transition-colors ${
                            index < currentStep ? "bg-primary-400" : "bg-border-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

            {/* Scroll Indicators */}
            {canScrollUp && (
              <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-center bg-gradient-to-b from-surface-050 via-surface-050/95 to-transparent py-2">
                <svg className="h-5 w-5 animate-bounce text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </div>
            )}

            {canScrollDown && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-center bg-gradient-to-t from-surface-050 via-surface-050/95 to-transparent py-2">
                <svg className="h-5 w-5 animate-bounce text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm rounded-xl border border-border-200 bg-surface-000 p-6 shadow-[0_24px_48px_-12px_rgba(18,24,38,0.2)]">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-ink-900">
                  Sign in to access full analysis
                </h3>
                <p className="text-sm text-ink-600">
                  Create an account to unlock all features, save your cases, and get detailed analysis
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/auth/signin?caseId=${caseId}`)}
                  className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary-700 to-primary-800 px-4 py-2.5 font-semibold text-white shadow-md ring-1 ring-white/10 transition hover:from-primary-800 hover:to-primary-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push(`/auth/signup?caseId=${caseId}`)}
                  className="w-full cursor-pointer rounded-lg border border-border-300 bg-surface-050 px-4 py-2.5 font-semibold text-ink-700 transition hover:bg-surface-100"
                >
                  Create Account
                </button>
              </div>

              <button
                onClick={() => setShowAuthModal(false)}
                className="mt-4 w-full px-4 py-2 text-sm font-medium text-ink-500 transition hover:text-ink-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed right-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-64 flex-col border-l border-border-200 bg-gradient-to-b from-surface-050 to-surface-100 shadow-[inset_1px_0_0_rgba(36,85,136,0.06),-8px_0_32px_-12px_rgba(18,24,38,0.12)]">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-primary-400/50 via-primary-500/30 to-primary-700/20"
          aria-hidden
        />
        <div ref={scrollContainerRef} className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-6 pt-8">
        <div className="mb-4 border-b border-border-200/90 pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-600">
            {t("results.overview")}
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-1 flex-col">
          {steps.map((step, index) => {
            const completion = getCompletion(index);
            const isComplete = completion === 100;

            return (
              <div key={step.id} className="relative">
                {/* Step Item */}
                <button
                  onClick={() => {
                    void handleStepNavigation(index);
                  }}
                  className={`group flex w-full cursor-pointer items-center rounded-xl border-2 px-2.5 py-2.5 transition-all duration-200 ${
                    index === currentStep
                      ? "border-primary-500/35 bg-primary-100/60 shadow-sm ring-1 ring-primary-500/15"
                      : "border-transparent hover:bg-surface-100/90"
                  }`}
                >
                  {/* Step Icon - current filled, previous outlined, future gray */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                        index === currentStep
                          ? "scale-105 bg-primary-600 text-white shadow-md ring-2 ring-primary-500/25"
                          : index < currentStep
                            ? "border-2 border-primary-500 bg-surface-000 text-primary-600"
                            : "border-2 border-border-300 bg-surface-100 text-ink-400 group-hover:border-border-300"
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Label - neutral text; only icons show progress */}
                  <div className="ml-3 flex-1 text-left">
                    <div
                      className={`text-sm font-semibold transition-colors ${
                        index === currentStep
                          ? "text-ink-900"
                          : "text-ink-500 group-hover:text-ink-700"
                      }`}
                    >
                      {getStepLabel(step.id)}
                    </div>
                    {!isComplete && completion < 100 && step.id !== "results" && step.id !== "game-plan" && step.id !== "case-details" && (
                      <div className="mt-0.5 flex items-center gap-1">
                        <svg className="h-4 w-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-warning-600">{t("common.incomplete")}</span>
                      </div>
                    )}
                  </div>

                  {/* Completion Circle - Hidden for Results, Game Plan, and Verdict steps */}
                  {step.id !== "results" && step.id !== "game-plan" && (
                    <div className="flex-shrink-0">
                      {step.id === "case-details" ? (
                        /* For Case Details: Show percentage circle */
                        <div className="relative h-8 w-8">
                          {/* Background circle */}
                          <svg className="h-8 w-8 -rotate-90 transform">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              className="text-surface-200"
                            />
                            {/* Progress circle */}
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${2 *
                                Math.PI *
                                14 *
                                (1 - completion / 100)
                                }`}
                              className={`transition-all duration-300 ${completion === 100
                                ? "text-success-500"
                                : completion > 0
                                  ? "text-primary-500"
                                  : "text-surface-200"
                                }`}
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Percentage Display */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className={`text-[10px] font-bold ${completion === 100
                                ? "text-success-600"
                                : completion > 0
                                  ? "text-primary-600"
                                  : "text-ink-400"
                                }`}
                            >
                              {completion > 0 ? completion + "%" : ""}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* For other steps: Show checkbox or incomplete symbol */
                        <div className="flex h-8 w-8 items-center justify-center">
                          {isComplete ? (
                            /* Checkmark for complete */
                            <svg className="h-6 w-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            /* Incomplete circle for incomplete */
                            <svg className="h-6 w-6 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </button>

                {/* Vertical Connector Line - highlighted up to current step */}
                {index < steps.length - 1 && (
                  <div className="ml-8 flex justify-start py-1">
                    <div
                      className={`h-4 w-0.5 rounded-full transition-colors ${
                        index < currentStep ? "bg-primary-400" : "bg-border-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

        {/* Scroll Indicators */}
        {canScrollUp && (
          <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-center bg-gradient-to-b from-surface-050 via-surface-050/95 to-transparent py-2">
            <svg className="h-5 w-5 animate-bounce text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </div>
        )}

        {canScrollDown && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-center bg-gradient-to-t from-surface-050 via-surface-050/95 to-transparent py-2">
            <svg className="h-5 w-5 animate-bounce text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
