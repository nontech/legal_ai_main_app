"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import HorizontalStepper from "../components/quick-analysis/HorizontalStepper";
import DocumentUploadStep from "../components/quick-analysis/DocumentUploadStep";
import QuickAnalysisForm from "../components/quick-analysis/QuickAnalysisForm";

type Step = "upload" | "form";

export default function CaseAnalysis() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>(
    []
  );
  const [hasVisitedForm, setHasVisitedForm] = useState(false);

  const handleDocumentsUploaded = (files: File[]) => {
    setUploadedDocuments(files);
    setCurrentStep("form");
    setHasVisitedForm(true);
  };

  const getCurrentStepNumber = () => {
    return currentStep === "upload" ? 1 : 2;
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentStep("upload");
    } else if (stepNumber === 2 && hasVisitedForm) {
      // Only allow going to step 2 if user has visited it before
      setCurrentStep("form");
    }
  };

  const handleBack = () => {
    setCurrentStep("upload");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content with top padding for fixed navbar */}
      <main
        className={`pt-32 ${
          currentStep === "upload" ? "pb-16" : ""
        } min-h-[calc(100vh-80px)]`}
      >
        {/* Horizontal Stepper with Back Button */}
        <div className="mb-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative">
              {/* Back Button - Only visible on Step 2 */}
              {currentStep === "form" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Back</span>
                  </button>
                </div>
              )}

              <HorizontalStepper
                currentStep={getCurrentStepNumber()}
                onStepClick={handleStepClick}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "upload" && (
          <div className="max-w-6xl mx-auto px-4">
            <DocumentUploadStep
              onContinue={handleDocumentsUploaded}
            />
          </div>
        )}

        {currentStep === "form" && (
          <QuickAnalysisForm initialDocuments={uploadedDocuments} />
        )}
      </main>
    </div>
  );
}
