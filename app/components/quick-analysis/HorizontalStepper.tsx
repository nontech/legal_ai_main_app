"use client";

interface HorizontalStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function HorizontalStepper({
  currentStep,
  onStepClick,
}: HorizontalStepperProps) {
  const steps = [
    { number: 1, label: "Upload Documents" },
    { number: 2, label: "Calculate Results" },
  ];

  return (
    <div className="flex items-center justify-center gap-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle and Label */}
          <button
            onClick={() => onStepClick && onStepClick(step.number)}
            className="flex flex-col items-center cursor-pointer group"
            disabled={!onStepClick}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                currentStep >= step.number
                  ? "bg-blue-600 border-blue-600 text-white group-hover:bg-blue-700"
                  : "bg-white border-gray-300 text-gray-400 group-hover:border-gray-400"
              }`}
            >
              {currentStep > step.number ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-base font-semibold">
                  {step.number}
                </span>
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium whitespace-nowrap ${
                currentStep >= step.number
                  ? "text-blue-600 group-hover:text-blue-700"
                  : "text-gray-500 group-hover:text-gray-600"
              }`}
            >
                {step.label}
              </span>
          </button>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div className="w-20 h-0.5 mx-3 mb-4">
              <div
                className={`h-full transition-all ${
                  currentStep > step.number
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
