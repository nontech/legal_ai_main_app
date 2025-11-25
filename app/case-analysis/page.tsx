"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import HorizontalStepper from "../components/quick-analysis/HorizontalStepper";
import DocumentUploadStep from "../components/quick-analysis/DocumentUploadStep";
import QuickAnalysisForm from "../components/quick-analysis/QuickAnalysisForm";
import VerdictStep from "../components/VerdictStep";

type Step = "upload" | "form" | "verdict";

function CaseAnalysisContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [uploadedMetadata, setUploadedMetadata] = useState<any>({});
  const [caseInformationFiles, setCaseInformationFiles] = useState<File[]>([]);
  const [hasVisitedForm, setHasVisitedForm] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);

  // Initialize state from query parameters
  useEffect(() => {
    const paramCaseId = searchParams.get("caseId");
    const paramStep = searchParams.get("step");

    if (paramCaseId) {
      setCaseId(paramCaseId);
    }

    if (paramStep === "form" && paramCaseId) {
      setCurrentStep("form");
      setHasVisitedForm(true);
    }
  }, [searchParams]);

  const handleDocumentsUploaded = (files: File[], metadata?: any, caseInfoFiles?: File[], newCaseId?: string) => {
    setUploadedDocuments(files);
    setUploadedMetadata(metadata || {});
    setCaseInformationFiles(caseInfoFiles || []);
    if (newCaseId) {
      setCaseId(newCaseId);
    }
    setCurrentStep("form");
    setHasVisitedForm(true);
  };

  const getCurrentStepNumber = () => {
    if (currentStep === "upload") return 1;
    if (currentStep === "form") return 2;
    return 3; // verdict
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentStep("upload");
    } else if (stepNumber === 2 && hasVisitedForm) {
      // Only allow going to step 2 if user has visited it before
      setCurrentStep("form");
    } else if (stepNumber === 3 && hasVisitedForm) {
      // Only allow going to step 3 if user has visited form
      setCurrentStep("verdict");
    }
  };

  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />

      <main className="pt-16 sm:pt-20 pb-16 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 flex flex-col gap-3 sm:gap-4">
          <section className="bg-surface-000 rounded-lg sm:rounded-xl shadow-sm border border-border-200 p-3 sm:p-4">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-ink-900">
                Quick Case Analysis
              </h3>
            </div>

            <div className="mt-3 overflow-x-auto">
              <HorizontalStepper
                currentStep={getCurrentStepNumber()}
                onStepClick={handleStepClick}
              />
            </div>
          </section>

          <section className="bg-surface-000 rounded-lg sm:rounded-xl shadow-sm border border-border-200 p-3 sm:p-6">
            {currentStep === "upload" && (
              <DocumentUploadStep
                onContinue={handleDocumentsUploaded}
                caseId={caseId}
              />
            )}

            {currentStep === "form" && (
              <QuickAnalysisForm
                initialDocuments={uploadedDocuments}
                uploadedMetadata={uploadedMetadata}
                caseInformationFiles={caseInformationFiles}
                caseId={caseId}
              />
            )}

            {currentStep === "verdict" && (
              <VerdictStep />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
function SuspenseFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        <p className="text-ink-600">Loading...</p>
      </div>
    </div>
  );
}

export default function CaseAnalysis() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <CaseAnalysisContent />
    </Suspense>
  );
}
