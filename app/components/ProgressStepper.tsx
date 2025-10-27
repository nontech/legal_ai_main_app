"use client";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  subSections: number; // Number of sub-sections for percentage calculation
}

interface ProgressStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  completionData?: { [key: number]: number }; // Track completion for each step (0-100%)
}

export default function ProgressStepper({
  currentStep,
  onStepChange,
  completionData = {},
}: ProgressStepperProps) {
  const steps: Step[] = [
    {
      id: "jurisdiction",
      label: "Jurisdiction",
      subSections: 1,
      icon: (
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
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
    },
    {
      id: "case-type",
      label: "Case Type",
      subSections: 1,
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "role",
      label: "Role",
      subSections: 1,
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: "charges",
      label: "Charges",
      subSections: 1,
      icon: (
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      id: "case-details",
      label: "Case Details",
      subSections: 6,
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "judge",
      label: "Judge",
      subSections: 1,
      icon: (
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
            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
          />
        </svg>
      ),
    },
    {
      id: "jury",
      label: "Jury",
      subSections: 1,
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "results",
      label: "Results",
      subSections: 1,
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  // Calculate completion percentage for each step based on actual data
  const getCompletion = (index: number) => {
    return completionData[index] || 0;
  };

  return (
    <div className="fixed right-0 top-16 bottom-20 w-64 bg-white border-l border-gray-200 overflow-y-auto z-30 shadow-lg">
      <div className="px-5 py-6 pt-10">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Case Progress
          </h2>
          <p className="text-xs text-gray-500">
            Complete each step to proceed
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const completion = getCompletion(index);
            const isComplete = completion === 100;

            return (
              <div key={step.id} className="relative">
                {/* Step Item */}
                <button
                  onClick={() => onStepChange(index)}
                  className={`w-full flex items-center py-3 px-3 rounded-lg cursor-pointer group transition-all duration-200 ${
                    index === currentStep
                      ? "bg-blue-50 border-2 border-blue-500 shadow-sm"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  {/* Step Icon - Always show original icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                        index === currentStep
                          ? "bg-blue-600 text-white shadow-md scale-110"
                          : isComplete
                          ? "bg-gray-100 border-2 border-gray-300 text-gray-500"
                          : "bg-gray-100 border-2 border-gray-300 text-gray-400 group-hover:border-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Label */}
                  <div className="ml-3 flex-1 text-left">
                    <div
                      className={`text-sm font-semibold transition-colors ${
                        index === currentStep
                          ? "text-blue-700"
                          : isComplete
                          ? "text-gray-700"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>

                  {/* Completion Circle */}
                  <div className="flex-shrink-0">
                    <div className="relative w-8 h-8">
                      {/* Background circle */}
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-gray-200"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 14 * (1 - completion / 100)
                          }`}
                          className={`transition-all duration-300 ${
                            completion === 100
                              ? "text-green-500"
                              : completion > 0
                              ? "text-blue-500"
                              : "text-gray-200"
                          }`}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percentage Display */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-[10px] font-bold ${
                            completion === 100
                              ? "text-green-600"
                              : completion > 0
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {completion > 0 ? completion : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Vertical Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-start ml-8 py-1">
                    <div className="w-0.5 h-4 bg-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
