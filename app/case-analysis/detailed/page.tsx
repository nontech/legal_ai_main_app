"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProgressStepper from "../../components/ProgressStepper";
import JurisdictionSection from "../../components/JurisdictionSection";
import CaseTypeSelector from "../../components/CaseTypeSelector";
import RoleSelector from "../../components/RoleSelector";
import ChargesSection from "../../components/ChargesSection";
import CaseDetailsSection from "../../components/CaseDetailsSection";
import JudgeSelection from "../../components/JudgeSelection";
import PretrialProcess from "../../components/PretrialProcess";
import JuryComposition from "../../components/JuryComposition";
import NavigationFooter from "../../components/NavigationFooter";
import ResultsStep from "../../components/ResultsStep";

export default function DetailedCaseAnalysis() {
  const searchParams = useSearchParams();
  const initialStep = searchParams.get("step");
  const caseId = searchParams.get("caseId");
  const [currentStep, setCurrentStep] = useState(
    initialStep ? parseInt(initialStep) : 0
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPretrialOpen, setIsPretrialOpen] = useState(false);
  const totalSteps = 8; // Total number of steps

  // Track completion data for each step (percentage)
  // This should be calculated based on actual form data, not navigation
  const [completionData, setCompletionData] = useState<{
    [key: number]: number;
  }>({
    0: 100, // Jurisdiction - has default values (country, state, city, court)
    1: 100, // Case Type - has default value (Civil Law)
    2: 100, // Role - has default value (Plaintiff)
    3: 0, // Charges - set to 100 when form data exists
    4: 67, // Case Details - 4 out of 6 sub-sections completed (Basic Info, Evidence, Legal Precedents, Police Report)
    5: 100, // Judge - Judge Patricia Anderson is selected
    6: 100, // Jury - Demographics (1) and Psychological (2) selections made
    7: 0, // Results
  });

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <JurisdictionSection />;
      case 1:
        return <CaseTypeSelector />;
      case 2:
        return <RoleSelector />;
      case 3:
        return <ChargesSection />;
      case 4:
        return <CaseDetailsSection onModalChange={setIsModalOpen} />;
      case 5:
        return <JudgeSelection />;
      case 6:
        return <JuryComposition />;
      case 7:
        return <ResultsStep />;
      default:
        return <JurisdictionSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onPretrialClick={() => setIsPretrialOpen(true)} />
      <ProgressStepper
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        completionData={completionData}
        caseId={caseId || undefined}
      />

      {/* Main content area with right margin for sidebar */}
      <main className="mr-64 pt-32 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full">
          {renderStepContent()}
        </div>
      </main>

      {/* Pretrial Process Modal */}
      {isPretrialOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setIsPretrialOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-7xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-50 shadow-2xl rounded-2xl">
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
                        Pretrial Process & Motions
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Manage all pretrial procedures, discovery, and
                        motions
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

      {/* Navigation Footer - Hidden when modal is open */}
      {!isModalOpen && !isPretrialOpen && (
        <NavigationFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}
