"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

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
      id: "case-type",
      label: t("steps.caseType"),
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
      id: "charges",
      label: t("steps.charges"),
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
    {
      id: "verdict",
      label: t("steps.verdict"),
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
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

  const handleStepNavigation = (stepIndex: number) => {
    if (!caseId) return;
    const step = steps[stepIndex];
    if (step) {
      router.push(`/${country}/${locale}/case-analysis/${caseId}/${step.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed right-0 top-16 bottom-20 w-64 bg-white border-l border-gray-200 z-30 shadow-lg">
        <div className="px-5 py-6 pt-10 flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading</p>
        </div>
      </div>
    );
  }

  // For unauthenticated users or users who don't own the case, show all steps but lock them except Results
  if (!isAuthenticated || (isAuthenticated && caseId && !isCaseOwner)) {
    return (
      <>
        <div className="fixed right-0 top-16 h-[calc(100vh-72px)] w-64 bg-white border-l border-gray-200 z-30 shadow-lg flex flex-col">
          <div ref={scrollContainerRef} className="px-5 py-6 pt-10 flex flex-col flex-1 overflow-y-auto relative">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Overview
            </h2>

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
                          handleStepNavigation(index);
                        } else {
                          setAuthModalMode("signin");
                          setShowAuthModal(true);
                        }
                      }}
                      className={`w-full flex items-center py-3 px-3 rounded-lg group transition-all duration-200 ${isResultsStep
                        ? "cursor-pointer hover:bg-gray-50 border-2 border-transparent"
                        : "cursor-pointer hover:bg-gray-100 border-2 border-transparent opacity-70"
                        }`}
                    >
                      {/* Step Icon - current filled, previous outlined, future gray */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                            index === currentStep
                              ? "bg-blue-600 text-white shadow-md scale-110"
                              : index < currentStep
                                ? "border-2 border-blue-500 bg-white text-blue-600"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.icon}
                        </div>
                        {!isResultsStep && (
                          <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Step Label - highlighted up to current step */}
                      <div className="ml-3 flex-1 text-left">
                        <div
                          className={`text-sm font-semibold transition-colors ${
                            index <= currentStep ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {getStepLabel(step.id)}
                        </div>
                        {!isResultsStep && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-400 font-medium">{t("common.locked")}</span>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Vertical Connector Line - highlighted up to current step */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-start ml-8 py-1">
                        <div
                          className={`w-0.5 h-4 transition-colors ${
                            index < currentStep ? "bg-blue-500" : "bg-gray-300"
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
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-white to-transparent pointer-events-none flex items-center justify-center py-2">
              <svg className="w-6 h-6 text-blue-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          )}

          {canScrollDown && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none flex items-center justify-center py-2">
              <svg className="w-6 h-6 text-blue-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Sign in to access full analysis
                </h3>
                <p className="text-sm text-gray-600">
                  Create an account to unlock all features, save your cases, and get detailed analysis
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/auth/signin?caseId=${caseId}`)}
                  className="cursor-pointer w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push(`/auth/signup?caseId=${caseId}`)}
                  className="cursor-pointer w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Create Account
                </button>
              </div>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
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
    <div className="fixed right-0 top-18 h-[calc(100vh-72px)] w-64 bg-white border-l border-gray-200 z-30 shadow-lg flex flex-col">
      <div ref={scrollContainerRef} className="px-5 py-6 pt-10 flex flex-col flex-1 overflow-y-auto relative">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Overview
        </h2>

        {/* Steps */}
        <div className="flex flex-col flex-1">
          {steps.map((step, index) => {
            const completion = getCompletion(index);
            const isComplete = completion === 100;

            return (
              <div key={step.id} className="relative">
                {/* Step Item */}
                <button
                  onClick={() => handleStepNavigation(index)}
                  className={`w-full flex items-center py-3 px-3 rounded-lg cursor-pointer group transition-all duration-200 ${index === currentStep
                    ? "bg-blue-50 border-2 border-blue-500 shadow-sm"
                    : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                >
                  {/* Step Icon - current filled, previous outlined, future gray */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                        index === currentStep
                          ? "bg-blue-600 text-white shadow-md scale-110"
                          : index < currentStep
                            ? "border-2 border-blue-500 bg-white text-blue-600"
                            : "bg-gray-100 border-2 border-gray-300 text-gray-400 group-hover:border-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Label - highlighted up to current step */}
                  <div className="ml-3 flex-1 text-left">
                    <div
                      className={`text-sm font-semibold transition-colors ${
                        index <= currentStep
                          ? index === currentStep
                            ? "text-blue-700"
                            : "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {getStepLabel(step.id)}
                    </div>
                    {!isComplete && completion < 100 && step.id !== "results" && step.id !== "game-plan" && step.id !== "verdict" && step.id !== "case-details" && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-amber-600 font-medium">{t("common.incomplete")}</span>
                      </div>
                    )}
                  </div>

                  {/* Completion Circle - Hidden for Results, Game Plan, and Verdict steps */}
                  {step.id !== "results" && step.id !== "game-plan" && step.id !== "verdict" && (
                    <div className="flex-shrink-0">
                      {step.id === "case-details" ? (
                        /* For Case Details: Show percentage circle */
                        <div className="relative w-8 h-8">
                          {/* Background circle */}
                          <svg className="w-8 h-8 transform -rotate-90">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              className="text-gray-200"
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
                                ? "text-green-500"
                                : completion > 0
                                  ? "text-blue-500"
                                  : "text-gray-200"
                                }`}
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Percentage Display */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className={`text-[10px] font-bold ${completion === 100
                                ? "text-green-600"
                                : completion > 0
                                  ? "text-blue-600"
                                  : "text-gray-400"
                                }`}
                            >
                              {completion > 0 ? completion + "%" : ""}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* For other steps: Show checkbox or incomplete symbol */
                        <div className="flex items-center justify-center w-8 h-8">
                          {isComplete ? (
                            /* Checkmark for complete */
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            /* Incomplete circle for incomplete */
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <div className="flex justify-start ml-8 py-1">
                    <div
                      className={`w-0.5 h-4 transition-colors ${
                        index < currentStep ? "bg-blue-500" : "bg-gray-300"
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
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-white to-transparent pointer-events-none flex items-center justify-center py-2">
          <svg className="w-6 h-6 text-blue-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      )}

      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none flex items-center justify-center py-2">
          <svg className="w-6 h-6 text-blue-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
}
