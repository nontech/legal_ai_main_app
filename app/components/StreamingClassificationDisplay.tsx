"use client";

import { useEffect, useState, useRef } from "react";

interface ClassificationEvent {
    type: "status" | "complete" | "error" | "warning";
    message: string;
    step?: string;
    file_name?: string;
    file_index?: number;
    total_files?: number;
    char_count?: number;
    category?: string;
    confidence?: number;
    result?: any;
}

interface StreamingClassificationDisplayProps {
    isOpen: boolean;
    files?: Array<{ file: File; fileId: string }>;
    onComplete: (results: Array<{ fileId: string; result: any }>) => void;
    onClose: () => void;
}

const stepIcons: Record<string, string> = {
    initialization: "⚙️",
    file_processing: "📋",
    reading_file: "📂",
    text_extraction: "📄",
    text_extraction_complete: "✅",
    classification: "🤖",
    classification_complete: "🎯",
};

const stepLabels: Record<string, string> = {
    initialization: "Initializing",
    file_processing: "Processing File",
    reading_file: "Reading File",
    text_extraction: "Extracting Text",
    text_extraction_complete: "Text Extracted",
    classification: "Classifying Document",
    classification_complete: "Classification Complete",
};

export default function StreamingClassificationDisplay({
    isOpen,
    files = [],
    onComplete,
    onClose,
}: StreamingClassificationDisplayProps) {
    const [events, setEvents] = useState<ClassificationEvent[]>([]);
    const [progress, setProgress] = useState(0);
    const [allComplete, setAllComplete] = useState(false);
    const [totalFiles, setTotalFiles] = useState(0);
    const [processedFiles, setProcessedFiles] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const streamStartedRef = useRef(false);
    const lastResultRef = useRef<any>(null);
    const fileIdMapRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        if (!isOpen || files.length === 0) {
            setEvents([]);
            setProgress(0);
            setAllComplete(false);
            setTotalFiles(0);
            setProcessedFiles(0);
            streamStartedRef.current = false;
            fileIdMapRef.current.clear();
            return;
        }

        if (streamStartedRef.current) return;
        streamStartedRef.current = true;

        // Create mapping of file names to IDs
        files.forEach(({ file, fileId }) => {
            fileIdMapRef.current.set(file.name, fileId);
        });

        startClassificationForAllFiles(files);
    }, [isOpen, files]);

    const startClassificationForAllFiles = async (filesToClassify: Array<{ file: File; fileId: string }>) => {
        try {
            const formData = new FormData();
            filesToClassify.forEach(({ file }) => {
                formData.append("files", file);
            });

            const response = await fetch("/api/documents/classify", {
                method: "POST",
                body: formData,
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
            let completionHandled = false;

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Stream ended");
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
                                const event: ClassificationEvent = JSON.parse(dataStr);

                                // Add event to display stream
                                setEvents((prev) => [...prev, event]);

                                // Handle total files count from initialization
                                if (event.total_files) {
                                    setTotalFiles(event.total_files);
                                }

                                // Calculate progress based on current file processing
                                if (event.file_index && event.total_files) {
                                    const stepProgressMap: Record<string, number> = {
                                        file_processing: 5,
                                        reading_file: 15,
                                        text_extraction: 30,
                                        text_extraction_complete: 50,
                                        classification: 75,
                                        classification_complete: 95,
                                    };

                                    // Calculate progress for completed files
                                    const completedFiles = event.file_index - 1;
                                    const progressPerFile = 95 / event.total_files;
                                    const completedFilesProgress = completedFiles * progressPerFile;

                                    // Add progress for current file
                                    const currentStepProgress = stepProgressMap[event.step || ""] || 0;
                                    const currentFileProgress = (currentStepProgress / 100) * progressPerFile;

                                    const totalProgress = completedFilesProgress + currentFileProgress;

                                    setProgress(Math.min(Math.round(totalProgress), 99));
                                } else if (event.step) {
                                    // No file index info, but we have a step
                                    const stepProgressMap: Record<string, number> = {
                                        initialization: 5,
                                        file_processing: 15,
                                        reading_file: 25,
                                        text_extraction: 40,
                                        text_extraction_complete: 60,
                                        classification: 80,
                                        classification_complete: 95,
                                    };

                                    const stepProgress = stepProgressMap[event.step] || 0;
                                    setProgress(Math.min(Math.round(stepProgress), 99));
                                }

                                // Handle final complete event with all results
                                if (event.type === "complete" && event.result) {
                                    console.log("All classifications complete");
                                    const result = event.result as any;
                                    lastResultRef.current = result;

                                    if (result.classifications && Array.isArray(result.classifications)) {
                                        // Count successful files
                                        setProcessedFiles(result.successful || result.classifications.length);
                                    }

                                    setProgress(100);
                                    setAllComplete(true);
                                    completionHandled = true;
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
            console.error("Classification error:", errorMessage);

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
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [events]);

    // Auto-close and trigger completion after classification finishes
    useEffect(() => {
        if (allComplete && lastResultRef.current?.classifications) {
            // Wait a short moment for user to see completion
            const timer = setTimeout(() => {
                const results = lastResultRef.current.classifications.map((classification: any) => {
                    const fileId = fileIdMapRef.current.get(classification.file_name) || classification.file_name;
                    return {
                        fileId,
                        result: classification,
                    };
                });
                onComplete(results);
                onClose();
            }, 1500); // 1.5 second delay to show completion

            return () => clearTimeout(timer);
        }
    }, [allComplete, onComplete, onClose]);

    if (!isOpen || files.length === 0) return null;


    const successfulCount = lastResultRef.current?.successful || 0;
    const failedCount = lastResultRef.current?.failed || 0;

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
                                        {allComplete ? "Classification Complete!" : "Classifying Documents..."}
                                    </h2>
                                    <p className="text-primary-100 text-xs sm:text-sm truncate">
                                        {files.length} file{files.length !== 1 ? "s" : ""}{successfulCount > 0 && ` • ${successfulCount} classified`}
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

                    {/* Content - Unified event stream */}
                    <div
                        ref={scrollContainerRef}
                        className="px-4 sm:px-8 py-4 sm:py-6 max-h-[60vh] overflow-y-auto space-y-2"
                    >
                        {events.length === 0 && !allComplete && (
                            <div className="text-center py-12">
                                <div className="inline-block">
                                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="text-ink-600 mt-4">Initializing classification...</p>
                            </div>
                        )}

                        {events.map((event, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded border transition-all ${event.type === "error"
                                    ? "bg-critical-50 border-critical-200"
                                    : event.type === "warning"
                                        ? "bg-warn-50 border-warn-200"
                                        : event.type === "complete"
                                            ? "bg-success-50 border-success-200"
                                            : "bg-surface-100 border-border-200"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                        {stepIcons[event.step || event.type] || "📌"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`font-semibold text-sm ${event.type === "error"
                                                ? "text-critical-900"
                                                : event.type === "warning"
                                                    ? "text-warn-900"
                                                    : event.type === "complete"
                                                        ? "text-green-700"
                                                        : "text-ink-900"
                                                }`}>
                                                {stepLabels[event.step || event.type] || event.message}
                                            </h4>
                                            {event.file_index && event.total_files && (
                                                <span className="text-xs text-ink-500">
                                                    ({event.file_index}/{event.total_files})
                                                </span>
                                            )}
                                        </div>
                                        {event.file_name && (
                                            <p className="text-xs text-ink-600 mb-1">
                                                <span className="font-medium">File:</span> {event.file_name}
                                            </p>
                                        )}
                                        {event.message && event.message !== (stepLabels[event.step || event.type] || event.message) && (
                                            <p className="text-sm text-ink-600">
                                                {event.message}
                                            </p>
                                        )}
                                        {event.char_count && (
                                            <p className="text-xs text-ink-600 mt-1">
                                                Characters extracted: {event.char_count}
                                            </p>
                                        )}
                                        {event.category && (
                                            <div className="mt-2 text-xs bg-surface-000 p-2 rounded border border-border-100 space-y-1">
                                                <div className="text-ink-700">
                                                    <span className="font-semibold">Category:</span> {event.category}
                                                </div>
                                                {event.confidence !== undefined && (
                                                    <div className="text-ink-700">
                                                        <span className="font-semibold">Confidence:</span> {Math.round(event.confidence * 100)}%
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
