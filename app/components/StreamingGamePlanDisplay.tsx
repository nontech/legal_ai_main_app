"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import CreditLimitDialog from "./CreditLimitDialog";

interface GamePlanEvent {
    type: "status" | "reasoning" | "result" | "complete" | "error" | "message";
    message: string;
    step?: string;
    data?: any;
    result?: any;
}

interface StreamingGamePlanDisplayProps {
    isOpen: boolean;
    caseId: string;
    case_analysis: any;
    case_info: any;
    onComplete: (result: any) => void;
    onClose: () => void;
}

const stepIcons: Record<string, string> = {
    initialization: "⚙️",
    opening_strategy: "📢",
    opening_complete: "✅",
    evidence_strategy: "🔍",
    evidence_complete: "✅",
    witness_strategy: "👤",
    witness_complete: "✅",
    closing_strategy: "🎯",
    closing_complete: "✅",
};

const stepLabels: Record<string, string> = {
    initialization: "Initializing",
    opening_strategy: "Planning Opening Strategy",
    opening_complete: "Opening Strategy Complete",
    evidence_strategy: "Developing Evidence Strategy",
    evidence_complete: "Evidence Strategy Complete",
    witness_strategy: "Creating Witness Strategy",
    witness_complete: "Witness Strategy Complete",
    closing_strategy: "Crafting Closing Strategy",
    closing_complete: "Closing Strategy Complete",
};

export default function StreamingGamePlanDisplay({
    isOpen,
    caseId,
    case_analysis,
    case_info,
    onComplete,
    onClose,
}: StreamingGamePlanDisplayProps) {
    const t = useTranslations("caseAnalysis.streaming");
    const tCredit = useTranslations("caseAnalysis.creditLimit");
    const locale = useLocale();
    const [events, setEvents] = useState<GamePlanEvent[]>([]);
    const [progress, setProgress] = useState(0);
    const [allComplete, setAllComplete] = useState(false);
    const [creditLimitReached, setCreditLimitReached] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const streamStartedRef = useRef(false);
    const lastResultRef = useRef<any>(null);

    useEffect(() => {
        if (!isOpen || !caseId) {
            setEvents([]);
            setProgress(0);
            setAllComplete(false);
            setCreditLimitReached(null);
            streamStartedRef.current = false;
            return;
        }

        if (streamStartedRef.current) return;
        streamStartedRef.current = true;

        console.log("Starting game plan generation for case:", caseId);
        startGamePlanGeneration();
    }, [isOpen, caseId, case_analysis, case_info]);

    const startGamePlanGeneration = async () => {
        try {
            console.log("Fetching game plan generation API");
            const response = await fetch("/api/game-plan/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caseId,
                    case_analysis,
                    case_info,
                    language_code: locale,
                }),
            });

            console.log("Response status:", response.status, response.ok);

            if (!response.ok) {
                if (response.status === 402) {
                    let message = "You have reached your daily game plan limit. Your credits reset at midnight UTC.";
                    try {
                        const errJson = await response.json();
                        if (errJson?.error) message = errJson.error;
                    } catch {
                        /* ignore */
                    }
                    setCreditLimitReached(message);
                    setAllComplete(true);
                    return;
                }
                let message = `HTTP error! status: ${response.status}`;
                try {
                    const errJson = await response.json();
                    if (errJson?.error) message = errJson.error;
                } catch {
                    /* ignore */
                }
                throw new Error(message);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("No response body");
            }

            const decoder = new TextDecoder();
            let buffer = "";
            let completionHandled = false;
            const stepsList = [
                "initialization",
                "opening_strategy",
                "opening_complete",
                "evidence_strategy",
                "evidence_complete",
                "witness_strategy",
                "witness_complete",
                "closing_strategy",
                "closing_complete",
            ];
            const totalSteps = stepsList.length;

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Game plan stream ended");
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const dataStr = line.slice(6).trim();
                            if (!dataStr) continue;

                            try {
                                const event: GamePlanEvent = JSON.parse(dataStr);

                                // Add event to display
                                setEvents((prev) => [...prev, event]);

                                // Calculate progress based on step
                                if (event.step && stepsList.includes(event.step)) {
                                    const stepIndex = stepsList.indexOf(event.step);
                                    const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);
                                    setProgress(Math.min(progressPercent, 99));
                                }

                                // Handle completion
                                if (event.type === "complete" && event.result) {
                                    console.log("Game plan generation complete");
                                    lastResultRef.current = event.result;
                                    completionHandled = true;
                                    setProgress(100);
                                    setAllComplete(true);
                                }

                                // Handle errors
                                if (event.type === "error") {
                                    throw new Error(event.message);
                                }
                            } catch (e) {
                                console.error("Failed to parse event:", dataStr, e);
                            }
                        }
                    }
                }

                if (!completionHandled) {
                    setProgress(100);
                    setAllComplete(true);
                }
            } finally {
                reader.releaseLock();
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error occurred";
            console.error("Game plan generation error:", errorMessage);

            setEvents((prev) => [
                ...prev,
                {
                    type: "error",
                    message: errorMessage,
                },
            ]);

            setAllComplete(true);
        }
    };

    // Auto-scroll to latest event
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        }
    }, [events]);

    // Auto-close and trigger completion after generation finishes
    useEffect(() => {
        if (allComplete && lastResultRef.current) {
            // Wait a short moment for user to see completion
            const timer = setTimeout(() => {
                onComplete(lastResultRef.current);
                onClose();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [allComplete, onComplete, onClose]);

    if (!isOpen) return null;

    if (creditLimitReached) {
        return (
            <CreditLimitDialog
                title={tCredit("gamePlanLimitTitle")}
                subtitle={tCredit("subtitle")}
                message={tCredit("gamePlanLimitMessage")}
                onClose={onClose}
                primaryButtonLabel={tCredit("close")}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 pt-4 pb-20">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={allComplete ? onClose : undefined}
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left transition-all transform bg-surface-000 shadow-2xl rounded-2xl sm:rounded-3xl border border-border-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 sm:px-8 py-4 sm:py-6 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                    {allComplete ? (
                                        <svg
                                            className="w-6 h-6 text-primary-100"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-6 h-6 text-primary-100 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                                        {allComplete ? t("completeTitle") : t("generatingTitle")}
                                    </h2>
                                    <p className="text-primary-100 text-xs sm:text-sm truncate">
                                        {t("generatingSubtitle")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 w-full h-2 bg-primary-500/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-300 to-primary-100 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-primary-100 text-right">
                            {progress}% {t("complete")}
                        </div>
                    </div>

                    {/* Content - Event stream */}
                    <div
                        ref={scrollContainerRef}
                        className="px-4 sm:px-8 py-4 sm:py-6 max-h-[60vh] overflow-y-auto space-y-2"
                    >
                        {events.length === 0 && !allComplete && (
                            <div className="text-center py-12">
                                <div className="inline-block">
                                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="text-ink-600 mt-4">{t("initializing")}</p>
                            </div>
                        )}

                        {(() => {
                            // Group events by step
                            const groupedEvents: Record<string, GamePlanEvent[]> = {};
                            events.forEach(event => {
                                const key = event.step || event.type;
                                if (!groupedEvents[key]) {
                                    groupedEvents[key] = [];
                                }
                                groupedEvents[key].push(event);
                            });

                            // Render grouped events
                            return Object.entries(groupedEvents).map(([stepKey, stepEvents]) => {
                                const firstEvent = stepEvents[0];
                                const stepLabel = t(`steps.${stepKey}`, { defaultValue: stepLabels[stepKey] || firstEvent.message });
                                const messages = stepEvents.map(e => e.message).filter(m => m && m !== (stepLabels[stepKey] || firstEvent.message));

                                return (
                                    <div
                                        key={stepKey}
                                        className={`p-3 rounded border transition-all ${firstEvent.type === "error"
                                            ? "bg-critical-50 border-critical-200"
                                            : firstEvent.type === "complete"
                                                ? "bg-success-50 border-success-200"
                                                : firstEvent.type === "reasoning"
                                                    ? "bg-blue-50 border-blue-200"
                                                    : "bg-surface-100 border-border-200"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg flex-shrink-0 mt-0.5">
                                                {stepIcons[stepKey] || "📌"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4
                                                        className={`font-semibold text-sm ${firstEvent.type === "error"
                                                            ? "text-critical-900"
                                                            : firstEvent.type === "complete"
                                                                ? "text-success-700"
                                                                : firstEvent.type === "reasoning"
                                                                    ? "text-blue-700"
                                                                    : "text-ink-900"
                                                            }`}
                                                    >
                                                        {stepLabel}
                                                    </h4>
                                                </div>
                                                {messages.length > 0 && (
                                                    <div className="space-y-1 mt-2">
                                                        {messages.map((msg, idx) => (
                                                            <p key={idx} className="text-sm text-ink-600">
                                                                • {msg}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

