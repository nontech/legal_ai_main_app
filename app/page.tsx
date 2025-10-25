"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import ProgressStepper from "./components/ProgressStepper";
import JurisdictionSection from "./components/JurisdictionSection";
import CaseTypeSelector from "./components/CaseTypeSelector";
import RoleSelector from "./components/RoleSelector";
import ChargesSection from "./components/ChargesSection";
import CaseDetailsSection from "./components/CaseDetailsSection";
import JudgeSelection from "./components/JudgeSelection";
import PretrialProcess from "./components/PretrialProcess";
import JuryComposition from "./components/JuryComposition";
import NavigationFooter from "./components/NavigationFooter";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalSteps = 11; // Total number of steps

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
        return <PretrialProcess />;
      case 7:
        return <JuryComposition />;
      case 8:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Results
            </h2>
            <p className="text-gray-600">
              Content for Results step coming soon...
            </p>
          </div>
        );
      case 9:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Game Plan
            </h2>
            <p className="text-gray-600">
              Content for Game Plan step coming soon...
            </p>
          </div>
        );
      case 10:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Verdict
            </h2>
            <p className="text-gray-600">
              Content for Verdict step coming soon...
            </p>
          </div>
        );
      default:
        return <JurisdictionSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar />
      <ProgressStepper
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {renderStepContent()}
      </main>

      {/* Navigation Footer - Hidden when modal is open */}
      {!isModalOpen && (
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
