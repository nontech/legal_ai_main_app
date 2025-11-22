"use client";

import { useEffect, useState, useRef } from "react";

// Hook for typing animation
function useTypingAnimation(text: string, speed: number = 30) {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const textRef = useRef<string>("");
    const hasAnimatedRef = useRef<boolean>(false);

    useEffect(() => {
        // Ensure text is a string and handle undefined/null
        const safeText = String(text || "").trim();

        if (!safeText) {
            setDisplayedText("");
            setIsComplete(false);
            textRef.current = "";
            hasAnimatedRef.current = false;
            return;
        }

        // If this text has already been animated, show it immediately
        if (textRef.current === safeText && hasAnimatedRef.current) {
            setDisplayedText(safeText);
            setIsComplete(true);
            return;
        }

        // Reset for new text
        if (textRef.current !== safeText) {
            textRef.current = safeText;
            hasAnimatedRef.current = false;
            setDisplayedText("");
            setIsComplete(false);
        }

        const words = safeText.split(" ").filter(word => word && word.length > 0);

        // If no words, show empty text immediately
        if (words.length === 0) {
            setDisplayedText(safeText);
            setIsComplete(true);
            hasAnimatedRef.current = true;
            return;
        }

        let currentIndex = 0;

        // Show first word immediately
        setDisplayedText(words[0] || "");
        currentIndex = 1;

        const typeNextWord = () => {
            if (currentIndex < words.length && textRef.current === safeText) {
                const nextWord = words[currentIndex];
                if (nextWord) {
                    setDisplayedText((prev) => prev ? `${prev} ${nextWord}` : nextWord);
                }
                currentIndex++;
                timeoutRef.current = setTimeout(typeNextWord, speed);
            } else if (textRef.current === safeText) {
                setIsComplete(true);
                hasAnimatedRef.current = true;
            }
        };

        // Continue typing after a delay
        if (words.length > 1) {
            timeoutRef.current = setTimeout(typeNextWord, speed);
        } else {
            setIsComplete(true);
            hasAnimatedRef.current = true;
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [text, speed]);

    return { displayedText: displayedText || "", isComplete };
}

// Typing animation component
function TypingText({ text, prefix = "", onComplete }: { text: string; prefix?: string; onComplete?: () => void }) {
    const { displayedText, isComplete } = useTypingAnimation(text || "", 30);
    const hasCalledComplete = useRef(false);

    useEffect(() => {
        if (isComplete && !hasCalledComplete.current && onComplete) {
            hasCalledComplete.current = true;
            onComplete();
        }
    }, [isComplete, onComplete]);

    // Ensure we never render undefined
    const safeDisplayedText = displayedText || "";

    return (
        <p className="text-sm text-ink-600">
            {prefix}{safeDisplayedText}
            {!isComplete && safeDisplayedText && (
                <span className="inline-block w-1 h-4 bg-ink-600 ml-1 animate-pulse">|</span>
            )}
        </p>
    );
}

// Sequential typing component for multiple messages
function SequentialTypingMessages({
    messages,
    pendingMessages,
    currentIndex,
    onMessageComplete
}: {
    messages: string[];
    pendingMessages: string[];
    currentIndex: number;
    onMessageComplete: () => void;
}) {
    // Combine displayed and pending messages
    const allMessages = [...messages, ...pendingMessages];

    return (
        <div className="space-y-1.5">
            {allMessages.map((message, idx) => {
                // Skip empty messages
                if (!message || !message.trim()) {
                    return null;
                }

                // Show completed messages (already displayed)
                if (idx < currentIndex) {
                    return (
                        <p key={idx} className="text-sm text-ink-600">
                            • {message}
                        </p>
                    );
                }

                // Show typing animation only for the current message
                if (idx === currentIndex) {
                    return (
                        <TypingText
                            key={idx}
                            text={message}
                            prefix="• "
                            onComplete={onMessageComplete}
                        />
                    );
                }

                // Don't show pending messages yet
                return null;
            })}
        </div>
    );
}

interface StreamEvent {
    type: "status" | "reasoning" | "complete" | "error";
    message: string;
    step?: string;
    details?: string;
    data?: any;
    result?: any;
}

interface GroupedStep {
    baseStep: string;
    status: "in_progress" | "completed";
    messages: string[];
    pendingMessages: string[];
    currentMessageIndex: number;
    data?: any;
    icon: string;
    label: string;
}

interface StreamingAnalysisDisplayProps {
    isOpen: boolean;
    caseId: string;
    onComplete: (result: any) => void;
    onClose: () => void;
}

// Map of step variants to their base step for grouping
const stepGrouping: Record<string, string> = {
    charges_analysis: "charges_analysis",
    rag_retrieval: "precedent_retrieval",
    precedent_extraction: "precedent_retrieval",
    llm_precedent_generation: "precedent_retrieval",
    outcome_prediction: "outcome_prediction",
    outcome_prediction_complete: "outcome_prediction",
    factors_analysis: "factors_analysis",
    factors_analysis_complete: "factors_analysis",
    legal_assessment: "legal_assessment",
    legal_assessment_complete: "legal_assessment",
    strategic_recommendations: "strategic_recommendations",
    strategic_recommendations_complete: "strategic_recommendations",
    executive_summary: "executive_summary",
    executive_summary_complete: "executive_summary",
};

const stepIcons: Record<string, string> = {
    status: "⚙️",
    charges_analysis: "📋",
    precedent_retrieval: "🤖",
    outcome_prediction: "📊",
    factors_analysis: "⚖️",
    legal_assessment: "⚖️",
    strategic_recommendations: "💡",
    executive_summary: "📋",
    finalization: "✨",
};

const stepLabels: Record<string, string> = {
    status: "Initializing",
    charges_analysis: "Analyzing Charges",
    precedent_retrieval: "Finding Precedent Cases",
    outcome_prediction: "Predicting Outcomes",
    factors_analysis: "Analyzing Key Factors",
    legal_assessment: "Legal Assessment",
    strategic_recommendations: "Strategic Recommendations",
    executive_summary: "Executive Summary",
    finalization: "Finalizing Results",
};

export default function StreamingAnalysisDisplay({
    isOpen,
    caseId,
    onComplete,
    onClose,
}: StreamingAnalysisDisplayProps) {
    const [groupedSteps, setGroupedSteps] = useState<Map<string, GroupedStep>>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const hasStartedRef = useRef(false);
    const lastResultRef = useRef<any>(null);

    // Track order of steps for consistent display
    const stepOrderRef = useRef<string[]>([]);

    useEffect(() => {
        if (!isOpen || !caseId) {
            hasStartedRef.current = false;
            setGroupedSteps(new Map());
            setIsLoading(false);
            setError(null);
            setProgress(0);
            setIsComplete(false);
            stepOrderRef.current = [];
            return;
        }

        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const startStreaming = async () => {
            setIsLoading(true);
            setGroupedSteps(new Map());
            setError(null);
            setProgress(0);

            try {
                const response = await fetch("/api/cases/analyze-streaming", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ caseId }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error("No response body");
                }

                const decoder = new TextDecoder();
                let buffer = "";
                const stepsList = [
                    "status",
                    "charges_analysis",
                    "precedent_retrieval",
                    "outcome_prediction",
                    "factors_analysis",
                    "legal_assessment",
                    "strategic_recommendations",
                    "executive_summary",
                ];
                const totalSteps = stepsList.length;
                let lastResult: any = null;
                let completionHandled = false;

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            console.log("Stream ended, lastResult:", lastResult ? "exists" : "null");
                            break;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines[lines.length - 1];

                        for (let i = 0; i < lines.length - 1; i++) {
                            const line = lines[i];
                            if (line.startsWith("data: ")) {
                                const dataStr = line.slice(6);
                                try {
                                    const event: StreamEvent = JSON.parse(dataStr);

                                    // Group events by base step
                                    if (event.type === "reasoning" || event.type === "status") {
                                        const step = (event.step || event.type) as string;
                                        const baseStep = stepGrouping[step] || step;
                                        const isComplete = typeof step === "string" && step.includes("_complete");

                                        setGroupedSteps((prev) => {
                                            const updated = new Map(prev);
                                            const existing = updated.get(baseStep);

                                            if (!existing) {
                                                // Track order for first appearance
                                                if (!stepOrderRef.current.includes(baseStep)) {
                                                    stepOrderRef.current = [...stepOrderRef.current, baseStep];
                                                }

                                                updated.set(baseStep, {
                                                    baseStep,
                                                    status: isComplete ? "completed" : "in_progress",
                                                    messages: [],
                                                    pendingMessages: [event.message],
                                                    currentMessageIndex: 0,
                                                    data: event.data,
                                                    icon: stepIcons[baseStep] || "📌",
                                                    label: stepLabels[baseStep] || step,
                                                });
                                            } else {
                                                // Add message to pending if it's different from existing ones (avoid duplicates)
                                                const allMessages = [...existing.messages, ...existing.pendingMessages];
                                                const lastMessage = allMessages[allMessages.length - 1];
                                                if (lastMessage !== event.message && event.message.trim()) {
                                                    existing.pendingMessages.push(event.message);
                                                }
                                                // Update data if available
                                                if (event.data) {
                                                    existing.data = { ...existing.data, ...event.data };
                                                }
                                                // Mark as completed if this is a completion step
                                                if (isComplete) {
                                                    existing.status = "completed";
                                                }
                                            }
                                            return updated;
                                        });

                                        // Update progress - cap at 99% until completion
                                        if (!isComplete) {
                                            const stepIndex = stepsList.indexOf(baseStep);
                                            if (stepIndex !== -1) {
                                                const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);
                                                // Cap progress at 99% until we get the complete event
                                                setProgress(Math.min(progressPercent, 99));
                                            }
                                        }
                                    }

                                    // Handle completion
                                    if (event.type === "complete" && event.result) {
                                        console.log("Received complete event with result");
                                        lastResult = event.result;
                                        lastResultRef.current = event.result;
                                        completionHandled = true;
                                        // Set progress to 100 only on completion
                                        setProgress(100);
                                        setIsComplete(true);
                                        setIsLoading(false);
                                        // Don't call onComplete immediately - let user click "View Results"
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

                    // If stream ended without handling completion, try to fetch result from database
                    if (!completionHandled) {
                        if (lastResult) {
                            console.log("Stream ended, forcing completion with lastResult");
                            setProgress(100);
                            setIsComplete(true);
                            setIsLoading(false);
                            onComplete(lastResult);
                        } else {
                            console.warn("Stream ended without complete event, fetching result from database...");

                            setGroupedSteps((prev) => {
                                const updated = new Map(prev);
                                updated.set("finalization", {
                                    baseStep: "finalization",
                                    status: "in_progress",
                                    messages: [],
                                    pendingMessages: ["Finalizing results..."],
                                    currentMessageIndex: 0,
                                    icon: "✨",
                                    label: "Finalizing Results",
                                });
                                return updated;
                            });

                            // Retry fetching from database with exponential backoff
                            const maxRetries = 5;
                            let retryCount = 0;
                            let resultFetched = false;

                            while (retryCount < maxRetries && !resultFetched) {
                                const waitTime = Math.min(1000 * Math.pow(1.5, retryCount), 5000);
                                console.log(`Attempt ${retryCount + 1}/${maxRetries} - waiting ${waitTime}ms...`);

                                if (retryCount > 0) {
                                    setGroupedSteps((prev) => {
                                        const updated = new Map(prev);
                                        const finStep = updated.get("finalization");
                                        if (finStep) {
                                            finStep.pendingMessages = [`Finalizing results (${retryCount + 1}/${maxRetries})...`];
                                            finStep.currentMessageIndex = finStep.messages.length;
                                        }
                                        return updated;
                                    });
                                }

                                await new Promise(resolve => setTimeout(resolve, waitTime));

                                try {
                                    const response = await fetch(`/api/cases/${caseId}`);
                                    const data = await response.json();

                                    if (data.ok && data.data?.result) {
                                        console.log(`Successfully fetched result from database on attempt ${retryCount + 1}`);
                                        setProgress(100);
                                        setIsComplete(true);
                                        setIsLoading(false);
                                        onComplete(data.data.result);
                                        resultFetched = true;
                                        break;
                                    } else {
                                        console.log(`Attempt ${retryCount + 1}: No result yet in database`);
                                    }
                                } catch (fetchError) {
                                    console.error(`Attempt ${retryCount + 1} failed:`, fetchError);
                                }

                                retryCount++;
                            }

                            if (!resultFetched) {
                                console.error("Failed to fetch result after all retries");
                                throw new Error("Analysis is taking longer than expected. Please refresh the page in a moment to see your results.");
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Unknown error occurred";
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        startStreaming();
    }, [isOpen, caseId, onComplete]);

    // Auto-scroll to latest event
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        }
    }, [groupedSteps]);

    if (!isOpen) return null;

    // Convert map to array in the order steps were encountered
    const stepsArray = Array.from(groupedSteps.values()).sort(
        (a, b) => stepOrderRef.current.indexOf(a.baseStep) - stepOrderRef.current.indexOf(b.baseStep)
    );

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 pt-4 pb-20">
                {/* Background overlay - prevent closing while loading */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={isComplete ? onClose : undefined}
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left transition-all transform bg-surface-000 shadow-2xl rounded-2xl sm:rounded-3xl border border-border-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 sm:px-8 py-4 sm:py-6 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                    {isComplete ? (
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
                                        {isComplete ? "Analysis Complete!" : "Analyzing..."}
                                    </h2>
                                    <p className="text-primary-100 text-xs sm:text-sm truncate">
                                        {isComplete
                                            ? "Click 'View Results' to see your analysis"
                                            : "Analyzing your case in real-time..."}
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
                            {progress}% Complete
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        ref={scrollContainerRef}
                        className="px-4 sm:px-8 py-4 sm:py-6 max-h-[60vh] overflow-y-auto space-y-3"
                    >
                        {error && (
                            <div className="bg-critical-50 border border-critical-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">❌</span>
                                    <div>
                                        <h3 className="font-semibold text-critical-900">
                                            Analysis Error
                                        </h3>
                                        <p className="text-sm text-critical-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {stepsArray.length === 0 && !error && isLoading && (
                            <div className="text-center py-12">
                                <div className="inline-block">
                                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="text-ink-600 mt-4">Initializing analysis...</p>
                            </div>
                        )}

                        {stepsArray.map((step) => (
                            <div
                                key={step.baseStep}
                                className={`p-4 rounded-lg border transition-all ${step.status === "completed"
                                    ? "bg-success-50 border-success-200"
                                    : "bg-surface-100 border-border-200"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl flex-shrink-0">
                                        {step.icon}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-ink-900">
                                                {step.label}
                                            </h4>
                                            {step.status === "completed" && (
                                                <span className="text-2xl flex-shrink-0">
                                                    ✅
                                                </span>
                                            )}
                                        </div>

                                        {/* Display all messages for this step */}
                                        <SequentialTypingMessages
                                            messages={step.messages}
                                            pendingMessages={step.pendingMessages}
                                            currentIndex={step.currentMessageIndex}
                                            onMessageComplete={() => {
                                                setGroupedSteps((prev) => {
                                                    const updated = new Map(prev);
                                                    const existing = updated.get(step.baseStep);
                                                    if (existing && existing.pendingMessages.length > 0) {
                                                        // Move first pending message to displayed messages
                                                        const [nextMessage, ...remainingPending] = existing.pendingMessages;
                                                        existing.messages.push(nextMessage);
                                                        existing.pendingMessages = remainingPending;
                                                        existing.currentMessageIndex = existing.messages.length;
                                                    }
                                                    return updated;
                                                });
                                            }}
                                        />

                                        {/* Display data if available */}
                                        {step.data && (
                                            <div className="mt-3 text-xs bg-surface-000 p-3 rounded border border-border-100 space-y-1.5">
                                                {step.data.win_probability !== undefined && (
                                                    <div className="text-ink-700">
                                                        <span className="font-semibold">Win Probability:</span>{" "}
                                                        {Math.round(step.data.win_probability * 100)}%
                                                    </div>
                                                )}
                                                {step.data.confidence !== undefined && (
                                                    <div className="text-ink-700">
                                                        <span className="font-semibold">Confidence:</span>{" "}
                                                        {Math.round(step.data.confidence * 100)}%
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer with View Results button */}
                    {isComplete && (
                        <div className="bg-surface-100 border-t border-border-200 px-4 sm:px-8 py-4 sm:py-6 flex justify-end">
                            <button
                                onClick={() => {
                                    if (lastResultRef.current) {
                                        onComplete(lastResultRef.current);
                                    }
                                    // onClose() is NOT called here to prevent dialog closing before navigation
                                }}
                                className="cursor-pointer px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                            >
                                View Results →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

