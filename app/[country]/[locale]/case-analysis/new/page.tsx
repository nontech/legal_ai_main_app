"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/app/components/Navbar";
import CreditLimitGuard from "@/app/components/CreditLimitGuard";
import ProgressStepper from "@/app/components/ProgressStepper";
import MobileProgressBar from "@/app/components/MobileProgressBar";
import CaseTitleHeader from "@/app/components/CaseTitleHeader";
import JurisdictionSection from "@/app/components/JurisdictionSection";
import CaseTypeSelector from "@/app/components/CaseTypeSelector";
import RoleSelector from "@/app/components/RoleSelector";
import ChargesSection from "@/app/components/ChargesSection";
import CaseDetailsSection from "@/app/components/CaseDetailsSection";
import ResultsStep from "@/app/components/ResultsStep";
import VerdictStep from "@/app/components/VerdictStep";

function NewCaseAnalysisContent() {
  const t = useTranslations("caseAnalysis");
  const searchParams = useSearchParams();
  const params = useParams();
  const initialStep = searchParams.get("step");
  const caseIdParam = searchParams.get("caseId");
  const caseId = caseIdParam || undefined;
  const [currentStep, setCurrentStep] = useState(
    initialStep ? parseInt(initialStep) : 0
  );
  const [countryId, setCountryId] = useState<string>("");
  const [jurisdictionId, setJurisdictionId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseType, setCaseType] = useState<string>("");
  const [caseTitle, setCaseTitle] = useState<string>("");
  const [isOwner, setIsOwner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ownershipLoading, setOwnershipLoading] = useState(true);
  const totalSteps = 10;

  const [completionData, setCompletionData] = useState<{
    [key: number]: number;
  }>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  });

  const fetchCaseCompletion = useCallback(async () => {
    if (!caseId) {
      setOwnershipLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/cases/${caseId}`);
      const json = await res.json();

      if (json.ok && json.data) {
        const data = json.data;
        const title = data.case_details?.case_information?.caseName || "";
        setCaseTitle(title);

        const ownershipRes = await fetch(`/api/cases/${caseId}/ownership`);
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
          0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0,
        };

        const courtValue = data.jurisdiction?.court || data.jurisdiction?.court_name;
        if (data.jurisdiction && data.jurisdiction.country && data.jurisdiction.jurisdiction && courtValue) {
          newCompletionData[0] = 100;
        }

        if (data.case_type) {
          newCompletionData[1] = 100;
          setCaseType(data.case_type);
        }

        if (data.role) {
          newCompletionData[2] = 100;
        }

        if (data.charges && Array.isArray(data.charges) && data.charges.length > 0) {
          newCompletionData[3] = 100;
        }

        if (data.case_details?._completion_status !== undefined) {
          newCompletionData[4] = data.case_details._completion_status;
        }

        if (data.result) {
          newCompletionData[5] = 100;
        }

        if (data.game_plan) {
          newCompletionData[6] = 100;
        }

        if (data.verdict && Object.keys(data.verdict).length > 0) {
          newCompletionData[7] = 100;
        }

        setCompletionData(newCompletionData);
      }
    } catch (error) {
      console.error("Failed to fetch case completion data:", error);
      setOwnershipLoading(false);
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

  const handleChargesCompletion = useCallback((isComplete: boolean) => {
    setCompletionData((prev) => ({ ...prev, 3: isComplete ? 100 : 0 }));
  }, []);

  const handleCaseDetailsCompletion = useCallback((percentage: number) => {
    setCompletionData((prev) => ({ ...prev, 4: percentage }));
  }, []);

  const isCriminal = !caseType || caseType.toLowerCase() === "criminal";

  const steps = [
    { id: "jurisdiction", label: t("steps.jurisdiction"), icon: null },
    { id: "case-type", label: t("steps.caseType"), icon: null },
    { id: "role", label: t("steps.role"), icon: null },
    { id: "charges", label: isCriminal ? t("steps.charges") : t("steps.claims"), icon: null },
    { id: "case-details", label: t("steps.caseDetails"), icon: null },
    { id: "results", label: t("steps.results"), icon: null },
    { id: "game-plan", label: t("steps.gamePlan"), icon: null },
    { id: "verdict", label: t("steps.verdict"), icon: null },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <JurisdictionSection caseId={caseId} onCountryChange={setCountryId} onJurisdictionChange={setJurisdictionId} />;
      case 1:
        return <CaseTypeSelector caseId={caseId} countryId={countryId} />;
      case 2:
        return <RoleSelector caseId={caseId} countryId={countryId} />;
      case 3:
        return <ChargesSection caseId={caseId} onCompletionChange={handleChargesCompletion} />;
      case 4:
        return <CaseDetailsSection onModalChange={setIsModalOpen} caseId={caseId} onCompletionChange={handleCaseDetailsCompletion} />;
      case 5:
        return <ResultsStep isOwner={isOwner} caseId={caseId} />;
      case 6:
        return <ResultsStep showGamePlanOnly={true} isOwner={isOwner} caseId={caseId} />;
      case 7:
        return <VerdictStep caseId={caseId} />;
      default:
        return <JurisdictionSection caseId={caseId} onCountryChange={setCountryId} />;
    }
  };

  return (
    <CreditLimitGuard requireCases={!caseId}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

      {caseId && (
        <CaseTitleHeader
          caseId={caseId}
          initialTitle={caseTitle}
          isOwner={isOwner}
          hideSidebar={ownershipLoading || (isAuthenticated && !isOwner)}
          onTitleUpdate={(newTitle) => setCaseTitle(newTitle)}
        />
      )}

      <MobileProgressBar currentStep={currentStep} steps={steps} onStepChange={setCurrentStep} completionData={completionData} />

      <main className="pb-32 pt-6 px-3 sm:px-4 lg:px-8">
        <div className={`flex ${!(caseId && ownershipLoading) && !(isAuthenticated && caseId && !isOwner) ? 'gap-6' : 'justify-center'}`}>
          <div className={!(caseId && ownershipLoading) && !(isAuthenticated && caseId && !isOwner) ? "flex-1 min-w-0" : "w-full"}>
            <div className="max-w-4xl mx-auto w-full">
              {renderStepContent()}
            </div>
          </div>

          {!(caseId && ownershipLoading) && !(isAuthenticated && caseId && !isOwner) && (
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <ProgressStepper currentStep={currentStep} onStepChange={setCurrentStep} completionData={completionData} caseId={caseId || undefined} caseType={caseType} />
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
    </CreditLimitGuard>
  );
}

export default function NewCaseAnalysis() {
  const t = useTranslations("caseAnalysis");
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium text-lg">{t("loading")}</p>
      </div>
    }>
      <NewCaseAnalysisContent />
    </Suspense>
  );
}
