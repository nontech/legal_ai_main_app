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
    <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 min-w-max">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle and Label */}
          <button
            onClick={() => onStepClick && onStepClick(step.number)}
            className="flex flex-col items-center cursor-pointer group"
            disabled={!onStepClick}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border transition-all ${
                currentStep >= step.number
                  ? "bg-primary-500 border-primary-500 text-white group-hover:bg-primary-600"
                  : "bg-surface-000 border-border-200 text-ink-400 group-hover:border-border-300"
              }`}
            >
              {currentStep > step.number ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span className="text-xs sm:text-base font-semibold">
                  {step.number}
                </span>
              )}
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                currentStep >= step.number
                  ? "text-primary-600 group-hover:text-primary-700"
                  : "text-ink-500 group-hover:text-ink-600"
              }`}
            >
                {step.label}
              </span>
          </button>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div className="w-12 sm:w-20 h-0.5 mx-1 sm:mx-3 mb-4">
              <div
                className={`h-full transition-all ${
                  currentStep > step.number
                    ? "bg-primary-500"
                    : "bg-surface-200"
                }`}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
