"use client";

import { useEffect, useState, useRef } from "react";

interface StreamEvent {
  type: "status" | "reasoning" | "complete" | "error";
  message: string;
  step?: string;
  details?: string;
  data?: any;
  result?: any;
}

interface StreamingAnalysisDisplayProps {
  isOpen: boolean;
  caseId: string;
  onComplete: (result: any) => void;
  onClose: () => void;
}

const stepIcons: Record<string, string> = {
  status: "⚙️",
  charges_analysis: "📋",
  rag_retrieval: "🔍",
  precedent_extraction: "📚",
  llm_precedent_generation: "🤖",
  outcome_prediction: "📊",
  outcome_prediction_complete: "🎯",
  factors_analysis: "⚖️",
  legal_assessment: "⚖️",
  strategic_recommendations: "💡",
  executive_summary: "📋",
  finalization: "✨",
};

const stepLabels: Record<string, string> = {
  status: "Initializing",
  charges_analysis: "Analyzing Charges",
  rag_retrieval: "Retrieving Cases",
  precedent_extraction: "Processing Precedents",
  llm_precedent_generation: "Generating Precedents",
  outcome_prediction: "Predicting Outcomes",
  outcome_prediction_complete: "Outcome Calculated",
  factors_analysis: "Analyzing Factors",
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
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !caseId) {
      // Reset state when closed
      hasStartedRef.current = false;
      setEvents([]);
      setIsLoading(false);
      setCurrentStep("");
      setError(null);
      setProgress(0);
      setIsComplete(false);
      return;
    }

    // Prevent multiple simultaneous requests
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const startStreaming = async () => {
      setIsLoading(true);
      setEvents([]);
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
          "rag_retrieval",
          "precedent_extraction",
          "llm_precedent_generation",
          "outcome_prediction",
          "outcome_prediction_complete",
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

                  setEvents((prev) => [...prev, event]);

                  if (event.type === "reasoning" || event.type === "status") {
                    setCurrentStep(event.step || "");
                  }

                  // Update progress based on step completion
                  if (event.step) {
                    const stepIndex = stepsList.indexOf(event.step);
                    if (stepIndex !== -1) {
                      const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);
                      setProgress(progressPercent);
                      console.log(`Progress: ${progressPercent}% (step ${stepIndex + 1}/${totalSteps})`);
                    }
                  }

                  // Handle completion
                  if (event.type === "complete" && event.result) {
                    console.log("Received complete event with result");
                    lastResult = event.result;
                    completionHandled = true;
                    setProgress(100);
                    setIsComplete(true);
                    setIsLoading(false);
                    onComplete(event.result);
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

              // Add a status event to inform user
              setEvents((prev) => [...prev, {
                type: "status",
                message: "Finalizing results...",
                step: "finalization"
              }]);

              // Retry fetching from database with exponential backoff
              const maxRetries = 5;
              let retryCount = 0;
              let resultFetched = false;

              while (retryCount < maxRetries && !resultFetched) {
                // Wait before each attempt (increasing wait time)
                const waitTime = Math.min(1000 * Math.pow(1.5, retryCount), 5000);
                console.log(`Attempt ${retryCount + 1}/${maxRetries} - waiting ${waitTime}ms...`);

                // Update status message with retry info
                if (retryCount > 0) {
                  setEvents((prev) => {
                    const newEvents = [...prev];
                    const lastEvent = newEvents[newEvents.length - 1];
                    if (lastEvent?.step === "finalization") {
                      lastEvent.message = `Finalizing results (${retryCount + 1}/${maxRetries})...`;
                    }
                    return newEvents;
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
  }, [events]);

  if (!isOpen) return null;

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
                    {isComplete ? "Complete!" : "Analyzing..."}
                  </h2>
                  <p className="text-primary-100 text-xs sm:text-sm truncate">
                    {isComplete
                      ? "Redirecting to results page..."
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

            {events.length === 0 && !error && isLoading && (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-ink-600 mt-4">Initializing analysis...</p>
              </div>
            )}

            {events.map((event, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${event.type === "error"
                  ? "bg-critical-50 border-critical-200"
                  : event.type === "complete"
                    ? "bg-success-50 border-success-200"
                    : "bg-surface-100 border-border-200"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">
                    {stepIcons[event.step || event.type] ||
                      (event.type === "error"
                        ? "❌"
                        : event.type === "complete"
                          ? "✅"
                          : "⚙️")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-ink-900">
                        {stepLabels[event.step || event.type] || event.message}
                      </h4>
                      {event.type === "complete" && (
                        <span className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">
                          Done
                        </span>
                      )}
                    </div>
                    {event.message && (
                      <p className="text-sm text-ink-600">{event.message}</p>
                    )}
                    {event.details && (
                      <p className="text-xs text-ink-500 mt-1 line-clamp-2">
                        {event.details}
                      </p>
                    )}
                    {event.data && (
                      <div className="mt-2 text-xs bg-surface-000 p-2 rounded border border-border-100">
                        {event.data.win_probability !== undefined && (
                          <div className="text-ink-700">
                            <span className="font-semibold">Win Probability:</span>{" "}
                            {Math.round(event.data.win_probability * 100)}%
                          </div>
                        )}
                        {event.data.confidence !== undefined && (
                          <div className="text-ink-700">
                            <span className="font-semibold">Confidence:</span>{" "}
                            {Math.round(event.data.confidence * 100)}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

