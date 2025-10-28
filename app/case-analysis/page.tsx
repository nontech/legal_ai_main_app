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

      {/* Main Content with left sidebar and right main area */}
      <main className="pt-28 pb-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex gap-8 h-full items-start">
            {/* Left Sidebar - Vertical Stepper */}
            <div className="w-48 mt-0 flex-shrink-0 h-full flex items-center">
              <div className="w-full sticky top-1/3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-8">Quick Analysis</h3>
                <div className="flex flex-col gap-4">
                  {/* Step 1 */}
                  <button
                    onClick={() => handleStepClick(1)}
                    className={`group flex items-start gap-3 text-left transition-all p-4 rounded-lg ${currentStep === "upload"
                      ? "bg-blue-50 shadow-sm"
                      : currentStep === "form"
                        ? "bg-gray-50"
                        : ""
                      }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep === "form"
                        ? "bg-green-500 text-white ring-2 ring-green-200"
                        : currentStep === "upload"
                          ? "bg-blue-600 text-white ring-2 ring-blue-200"
                          : "bg-gray-300 text-gray-700"
                        }`}
                    >
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm transition-colors ${currentStep === "upload"
                          ? "text-blue-700"
                          : currentStep === "form"
                            ? "text-gray-600"
                            : "text-gray-700"
                          }`}
                      >
                        Upload
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {uploadedDocuments.length > 0
                          ? `${uploadedDocuments.length} file${uploadedDocuments.length !== 1 ? "s" : ""}`
                          : "Add documents"}
                      </p>
                    </div>
                  </button>

                  {/* Connecting Line */}
                  <div className="flex justify-center">
                    <div
                      className={`w-0.5 h-8 transition-colors ${currentStep === "form" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                    ></div>
                  </div>

                  {/* Step 2 */}
                  <button
                    onClick={() => handleStepClick(2)}
                    disabled={!hasVisitedForm}
                    className={`group flex items-start gap-3 text-left transition-all p-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === "form"
                      ? "bg-blue-50 shadow-sm"
                      : "bg-gray-50"
                      }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep === "form"
                        ? "bg-blue-600 text-white ring-2 ring-blue-200"
                        : "bg-gray-300 text-gray-700"
                        }`}
                    >
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm transition-colors ${currentStep === "form"
                          ? "text-blue-700"
                          : "text-gray-700"
                          }`}
                      >
                        Analyze
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {!hasVisitedForm ? "Start here" : "Review results"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content Area - Full Width */}
            <div className="flex-1 min-w-0">
              {currentStep === "upload" && (
                <DocumentUploadStep onContinue={handleDocumentsUploaded} />
              )}

              {currentStep === "form" && (
                <QuickAnalysisForm initialDocuments={uploadedDocuments} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

