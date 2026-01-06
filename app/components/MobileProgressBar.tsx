"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Step {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface MobileProgressBarProps {
    currentStep: number;
    steps: Step[];
    onStepChange: (step: number) => void;
    completionData?: { [key: number]: number };
}

export default function MobileProgressBar({
    currentStep,
    steps,
    onStepChange,
    completionData = {},
}: MobileProgressBarProps) {
    const t = useTranslations("caseAnalysis.common");
    const [isExpanded, setIsExpanded] = useState(false);

    const getTotalCompletion = () => {
        const total = Object.values(completionData).reduce((a, b) => a + b, 0);
        return Math.round(total / steps.length);
    };

    const getStepCompletion = (stepIndex: number) => {
        return completionData[stepIndex] || 0;
    };

    return (
        <>
            {/* Compact Progress Bar */}
            <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-30">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">

                        <div className="flex-1 min-w-0">
                            <div className="text-md font-semibold text-gray-600 truncate">
                                {steps[currentStep]?.label}
                            </div>
                        </div>
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>

                {/* Expanded Steps List */}
                {isExpanded && (
                    <div className="border-t border-gray-200 bg-white max-h-96 overflow-y-auto">
                        <div className="px-2 py-3 space-y-1">
                            {steps.map((step, index) => {
                                const completion = getStepCompletion(index);
                                const isComplete = completion === 100;
                                const isCurrent = index === currentStep;

                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => {
                                            onStepChange(index);
                                            setIsExpanded(false);
                                        }}
                                        className={`w-full flex items-center py-2.5 px-3 rounded-lg cursor-pointer group transition-all duration-200 ${isCurrent
                                            ? "bg-blue-50 border-2 border-blue-500 shadow-sm"
                                            : "hover:bg-gray-50 border-2 border-transparent"
                                            }`}
                                    >
                                        {/* Step Icon/Circle */}
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${isCurrent
                                                    ? "bg-blue-600 text-white shadow-md scale-110"
                                                    : isComplete
                                                        ? "bg-gray-100 border-2 border-gray-300 text-gray-500"
                                                        : "bg-gray-100 border-2 border-gray-300 text-gray-400 group-hover:border-gray-400"
                                                    }`}
                                            >
                                                {isComplete ? (
                                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xs font-semibold">{index + 1}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Step Label */}
                                        <div className="ml-3 flex-1 text-left">
                                            <div
                                                className={`text-sm font-semibold transition-colors ${isCurrent
                                                    ? "text-blue-700"
                                                    : isComplete
                                                        ? "text-gray-700"
                                                        : "text-gray-500 group-hover:text-gray-700"
                                                    }`}
                                            >
                                                {step.label}
                                            </div>
                                            {!isComplete && completion < 100 && step.id !== "results" && step.id !== "game-plan" && step.id !== "verdict" && step.id !== "case-details" && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="text-xs text-amber-600 font-medium">{t("incomplete")}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Completion Circle - For Case Details step */}
                                        {step.id === "case-details" && completion !== 0 && (
                                            <div className="flex-shrink-0">
                                                <div className="relative w-6 h-6">
                                                    <svg className="w-6 h-6 transform -rotate-90">
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            fill="none"
                                                            className="text-gray-200"
                                                        />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 10}`}
                                                            strokeDashoffset={`${2 * Math.PI * 10 * (1 - completion / 100)}`}
                                                            className={`transition-all duration-300 ${completion === 100
                                                                ? "text-green-500"
                                                                : completion > 0
                                                                    ? "text-blue-500"
                                                                    : "text-gray-200"
                                                                }`}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-[8px] font-bold text-gray-700">{completion}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
