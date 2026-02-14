"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/app/components/Navbar";
import ProgressStepper from "@/app/components/ProgressStepper";
import MobileProgressBar from "@/app/components/MobileProgressBar";
import CaseTitleHeader from "@/app/components/CaseTitleHeader";
import PretrialProcess from "@/app/components/PretrialProcess";
interface LayoutProps {
  children: React.ReactNode;
}

export default function CaseAnalysisLayout({ children }: LayoutProps) {
  const t = useTranslations("caseAnalysis");
  const params = useParams();
  const pathname = usePathname();
  const caseId = params["case-id"] as string;
  
  const [countryId, setCountryId] = useState<string>("");
  const [jurisdictionId, setJurisdictionId] = useState<string>("");
  const [isPretrialOpen, setIsPretrialOpen] = useState(false);
  const [caseType, setCaseType] = useState<string>("");
  const [caseTitle, setCaseTitle] = useState<string>("");
  const [isOwner, setIsOwner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ownershipLoading, setOwnershipLoading] = useState(true);

  // Track completion data for each step (percentage)
  const [completionData, setCompletionData] = useState<{
    [key: number]: number;
  }>({
    0: 0, // Jurisdiction
    1: 0, // Case Type
    2: 0, // Role
    3: 0, // Charges
    4: 0, // Case Details
    5: 0, // Results
    6: 0, // Game Plan
    7: 0, // Verdict
  });

  // Fetch case data and calculate completion percentages
  const fetchCaseCompletion = useCallback(async () => {
    if (!caseId) return;

    try {
      const res = await fetch(`/api/cases/${caseId}`);
      const json = await res.json();

      if (json.ok && json.data) {
        const data = json.data;

        // Extract case title from case_details.case_information.caseName
        const title =
          data.case_details?.case_information?.caseName || "";
        setCaseTitle(title);

        // Check ownership and authentication
        const ownershipRes = await fetch(
          `/api/cases/${caseId}/ownership`
        );
        if (ownershipRes.ok) {
          const ownershipData = await ownershipRes.json();
          setIsOwner(ownershipData.isOwner || false);
          setIsAuthenticated(true);
        } else if (ownershipRes.status === 401) {
          setIsAuthenticated(false);
          setIsOwner(false);
        }
        setOwnershipLoading(false);
        
        const newCompletionData: { [key: number]: number } = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
        };

        // Check jurisdiction (step 0)
        const courtValue =
          data.jurisdiction?.court || data.jurisdiction?.court_name;
        if (
          data.jurisdiction &&
          data.jurisdiction.country &&
          data.jurisdiction.jurisdiction &&
          courtValue
        ) {
          newCompletionData[0] = 100;
        }

        // Check case type (step 1)
        if (data.case_type) {
          newCompletionData[1] = 100;
          setCaseType(data.case_type);
        }

        // Check role (step 2)
        if (data.role) {
          newCompletionData[2] = 100;
        }

        // Check charges (step 3)
        if (
          data.charges &&
          Array.isArray(data.charges) &&
          data.charges.length > 0
        ) {
          newCompletionData[3] = 100;
        }

        // Check case details (step 4)
        if (data.case_details?._completion_status !== undefined) {
          newCompletionData[4] = data.case_details._completion_status;
        }

        // Check results (step 5)
        if (data.result) {
          newCompletionData[5] = 100;
        }

        // Check game plan (step 6)
        if (data.game_plan) {
          newCompletionData[6] = 100;
        }

        // Check verdict (step 7)
        if (data.verdict && Object.keys(data.verdict).length > 0) {
          newCompletionData[7] = 100;
        }

        setCompletionData(newCompletionData);
      }
    } catch (error) {
      console.error("Failed to fetch case completion data:", error);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCaseCompletion();
  }, [caseId, fetchCaseCompletion]);

  const isCriminal =
    !caseType || caseType.toLowerCase() === "criminal";

  const steps = [
    {
      id: "jurisdiction",
      label: t("steps.jurisdiction"),
      icon: null,
    },
    { id: "case-type", label: t("steps.caseType"), icon: null },
    { id: "role", label: t("steps.role"), icon: null },
    {
      id: "charges",
      label: isCriminal ? t("steps.charges") : t("steps.claims"),
      icon: null,
    },
    { id: "case-details", label: t("steps.caseDetails"), icon: null },
    { id: "results", label: t("steps.results"), icon: null },
    { id: "game-plan", label: t("steps.gamePlan"), icon: null },
    { id: "verdict", label: t("steps.verdict"), icon: null },
  ];

  // Determine current step from pathname
  const getCurrentStep = () => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const stepIndex = steps.findIndex(step => step.id === lastSegment);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Case Title Header - Show only if caseId exists */}
      {caseId && (
        <CaseTitleHeader
          caseId={caseId}
          initialTitle={caseTitle}
          isOwner={isOwner}
          hideSidebar={ownershipLoading || (isAuthenticated && !isOwner)}
          onTitleUpdate={(newTitle) => setCaseTitle(newTitle)}
          isAuthenticated={isAuthenticated}
          onPretrialClick={() => setIsPretrialOpen(true)}
        />
      )}

      {/* Mobile Progress Bar - Shown on mobile only */}
      <MobileProgressBar
        currentStep={currentStep}
        steps={steps}
        onStepChange={() => {}} // Will be handled by router navigation
        completionData={completionData}
      />

      {/* Main content area */}
      <main className="pb-32 pt-6 px-3 sm:px-4 lg:px-8">
        <div className={`flex ${!(caseId && ownershipLoading) && !(isAuthenticated && caseId && !isOwner) ? 'gap-6' : 'justify-center'}`}>
          {/* Main Content */}
          <div className={!(caseId && ownershipLoading) && !(isAuthenticated && caseId && !isOwner) ? "flex-1 min-w-0" : "w-full"}>
            <div className="max-w-4xl mx-auto w-full">
              {children}
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, visible on md+, hidden for authenticated non-owners */}
          {!(caseId && ownershipLoading) && !(isAuthenticated && caseId && !isOwner) && (
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <ProgressStepper
                  currentStep={currentStep}
                  onStepChange={() => {}} // Will be handled by router navigation
                  completionData={completionData}
                  caseId={caseId || undefined}
                  caseType={caseType}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Pretrial Process Modal */}
      {isPretrialOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 pt-4 pb-20">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setIsPretrialOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-7xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-50 shadow-2xl rounded-lg sm:rounded-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 sticky top-0 z-10">
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
                        {t("pretrial.title")}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {t("pretrial.description")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPretrialOpen(false)}
                    className="text-white hover:text-gray-200 transition-colors"
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
