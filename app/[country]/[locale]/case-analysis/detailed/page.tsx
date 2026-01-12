"use client";

import { useState, useCallback } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/app/components/Navbar";
import ProgressStepper from "@/app/components/ProgressStepper";
import MobileProgressBar from "@/app/components/MobileProgressBar";
import CaseTitleHeader from "@/app/components/CaseTitleHeader";
import JurisdictionSection from "@/app/components/JurisdictionSection";
import CaseTypeSelector from "@/app/components/CaseTypeSelector";
import RoleSelector from "@/app/components/RoleSelector";
import ChargesSection from "@/app/components/ChargesSection";
import CaseDetailsSection from "@/app/components/CaseDetailsSection";
import JudgeSelection from "@/app/components/JudgeSelection";
import PretrialProcess from "@/app/components/PretrialProcess";
import JuryComposition from "@/app/components/JuryComposition";
import ResultsStep from "@/app/components/ResultsStep";
import VerdictStep from "@/app/components/VerdictStep";

function DetailedCaseAnalysisContent() {
  const t = useTranslations("caseAnalysis");
  const searchParams = useSearchParams();
  const initialStep = searchParams.get("step");
  const caseIdParam = searchParams.get("caseId");
  const caseId = caseIdParam || undefined;
  const [currentStep, setCurrentStep] = useState(
    initialStep ? parseInt(initialStep) : 0
  );
  const [countryId, setCountryId] = useState<string>("");
  const [jurisdictionId, setJurisdictionId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPretrialOpen, setIsPretrialOpen] = useState(false);
  const [caseType, setCaseType] = useState<string>("");
  const [caseTitle, setCaseTitle] = useState<string>("");
  const [isOwner, setIsOwner] = useState(false);
  const totalSteps = 10; // Total number of steps (added Game Plan and Verdict)

  // Track completion data for each step (percentage)
  const [completionData, setCompletionData] = useState<{
    [key: number]: number;
  }>({
    0: 0, // Jurisdiction
    1: 0, // Case Type
    2: 0, // Role
    3: 0, // Charges
    4: 0, // Case Details
    5: 0, // Judge
    6: 0, // Jury
    7: 0, // Results
    8: 0, // Game Plan
    9: 0, // Verdict
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

        // Check ownership
        const ownershipRes = await fetch(
          `/api/cases/${caseId}/ownership`
        );
        if (ownershipRes.ok) {
          const ownershipData = await ownershipRes.json();
          setIsOwner(ownershipData.isOwner || false);
        }
        const newCompletionData: { [key: number]: number } = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0, // Initialize Verdict step
        };

        // Check jurisdiction (step 0)
        // Support both 'court' (from SaveCaseButton) and 'court_name' (from quick analysis)
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

        // Check case details (step 4) - Use saved completion status from database
        if (data.case_details?._completion_status !== undefined) {
          newCompletionData[4] = data.case_details._completion_status;
        }

        // Check judge (step 5)
        if (data.judge) {
          newCompletionData[5] = 100;
        }

        // Check jury (step 6)
        if (
          data.jury &&
          data.jury.demographics &&
          data.jury.demographics.length > 0 &&
          data.jury.psychological &&
          data.jury.psychological.length > 0
        ) {
          newCompletionData[6] = 100;
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

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChargesCompletion = useCallback(
    (isComplete: boolean) => {
      setCompletionData((prev) => ({
        ...prev,
        3: isComplete ? 100 : 0,
      }));
    },
    []
  );

  const handleCaseDetailsCompletion = useCallback(
    (percentage: number) => {
      setCompletionData((prev) => ({
        ...prev,
        4: percentage,
      }));
    },
    []
  );

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
    { id: "judge", label: t("steps.judge"), icon: null },
    { id: "jury", label: t("steps.jury"), icon: null },
    { id: "results", label: t("steps.results"), icon: null },
    { id: "game-plan", label: t("steps.gamePlan"), icon: null },
    { id: "verdict", label: t("steps.verdict"), icon: null },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <JurisdictionSection
            caseId={caseId}
            onCountryChange={setCountryId}
            onJurisdictionChange={setJurisdictionId}
          />
        );
      case 1:
        return (
          <CaseTypeSelector caseId={caseId} countryId={countryId} />
        );
      case 2:
        return <RoleSelector caseId={caseId} countryId={countryId} />;
      case 3:
        return (
          <ChargesSection
            caseId={caseId}
            onCompletionChange={handleChargesCompletion}
          />
        );
      case 4:
        return (
          <CaseDetailsSection
            onModalChange={setIsModalOpen}
            caseId={caseId}
            onCompletionChange={handleCaseDetailsCompletion}
          />
        );
      case 5:
        return (
          <JudgeSelection
            caseId={caseId}
            onSaveSuccess={fetchCaseCompletion}
            jurisdictionId={jurisdictionId}
          />
        );
      case 6:
        return (
          <JuryComposition
            caseId={caseId}
            countryId={countryId}
            onSaveSuccess={fetchCaseCompletion}
          />
        );
      case 7:
        return <ResultsStep />;
      case 8:
        return <ResultsStep showGamePlanOnly={true} />;
      case 9:
        return <VerdictStep />;
      default:
        return (
          <JurisdictionSection
            caseId={caseId}
            onCountryChange={setCountryId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onPretrialClick={() => setIsPretrialOpen(true)}
        showPretrialButton={true}
      />

      {/* Case Title Header - Show only if caseId exists */}
      {caseId && (
        <CaseTitleHeader
          caseId={caseId}
          initialTitle={caseTitle}
          isOwner={isOwner}
          onTitleUpdate={(newTitle) => setCaseTitle(newTitle)}
        />
      )}

      {/* Mobile Progress Bar - Shown on mobile only */}
      <MobileProgressBar
        currentStep={currentStep}
        steps={steps}
        onStepChange={setCurrentStep}
        completionData={completionData}
      />

      {/* Main content area */}
      <main className="pb-32 pt-6 px-3 sm:px-4 lg:px-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto w-full">
              {renderStepContent()}
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <ProgressStepper
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                completionData={completionData}
                caseId={caseId || undefined}
                caseType={caseType}
              />
            </div>
          </div>
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

export default function DetailedCaseAnalysis() {
  const t = useTranslations("caseAnalysis");
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium text-lg">{t("loading")}</p>
      </div>
    }>
      <DetailedCaseAnalysisContent />
    </Suspense>
  );
}
