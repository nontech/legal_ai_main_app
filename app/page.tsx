"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import ProgressStepper from "./components/ProgressStepper";
import JurisdictionSection from "./components/JurisdictionSection";
import CaseTypeSelector from "./components/CaseTypeSelector";
import RoleSelector from "./components/RoleSelector";
import ChargesSection from "./components/ChargesSection";
import CaseDetailsSection from "./components/CaseDetailsSection";
import NavigationFooter from "./components/NavigationFooter";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalSteps = 10; // Total number of steps

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
        return (
          <>
            <JurisdictionSection />
            <CaseTypeSelector />
          </>
        );
      case 1:
        return <RoleSelector />;
      case 2:
        return <ChargesSection />;
      case 3:
        return <CaseDetailsSection onModalChange={setIsModalOpen} />;
      case 4:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Judge
            </h2>
            <p className="text-gray-600">
              Content for Judge step coming soon...
            </p>
          </div>
        );
      case 5:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pretrial Process
            </h2>
            <p className="text-gray-600">
              Content for Pretrial Process step coming soon...
            </p>
          </div>
        );
      case 6:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jury
            </h2>
            <p className="text-gray-600">
              Content for Jury step coming soon...
            </p>
          </div>
        );
      case 7:
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
      case 8:
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
      case 9:
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
        return (
          <>
            <JurisdictionSection />
            <CaseTypeSelector />
          </>
        );
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
