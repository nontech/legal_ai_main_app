"use client";

import { useEffect, useState, useRef } from "react";

interface UploadEvent {
  type: "status" | "complete" | "error" | "warning";
  message: string;
  step?: string;
  file_name?: string;
  file_index?: number;
  total_files?: number;
  char_count?: number;
  result?: any;
}

interface StreamingUploadDisplayProps {
  isOpen: boolean;
  files?: Array<{ file: File; fileId: string; category?: string }>;
  fileCategory: string;
  onComplete: (result: any) => void;
  onClose: () => void;
}

const stepIcons: Record<string, string> = {
  initialization: "⚙️",
  file_processing: "📋",
  reading_file: "📂",
  blob_upload: "☁️",
  blob_upload_complete: "✅",
  text_extraction: "📄",
  text_extraction_complete: "📝",
  database_save: "💾",
  file_complete: "🎯",
  case_metadata_extraction: "🔍",
  case_metadata_complete: "📋",
  case_description_generation: "✍️",
  summary_generation: "📚",
  summary_complete: "📊",
};

const stepLabels: Record<string, string> = {
  initialization: "Initializing Upload",
  file_processing: "Processing File",
  reading_file: "Reading File",
  blob_upload: "Uploading to Storage",
  blob_upload_complete: "Storage Upload Complete",
  text_extraction: "Extracting Text",
  text_extraction_complete: "Text Extracted",
  database_save: "Saving to Database",
  file_complete: "File Complete",
  case_metadata_extraction: "Extracting Metadata",
  case_metadata_complete: "Metadata Extracted",
  case_description_generation: "Generating Description",
  summary_generation: "Generating Summary",
  summary_complete: "Summary Complete",
};

export default function StreamingUploadDisplay({
  isOpen,
  files = [],
  fileCategory,
  onComplete,
  onClose,
}: StreamingUploadDisplayProps) {
  const [events, setEvents] = useState<UploadEvent[]>([]);
  const [progress, setProgress] = useState(0);
  const [allComplete, setAllComplete] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const streamStartedRef = useRef(false);
  const lastResultRef = useRef<any>(null);
  const categoryResultsRef = useRef<Record<string, any>>({}); // Store results by category

  useEffect(() => {
    if (!isOpen || files.length === 0) {
      setEvents([]);
      setProgress(0);
      setAllComplete(false);
      streamStartedRef.current = false;
      categoryResultsRef.current = {}; // Reset category results
      return;
    }

    if (streamStartedRef.current) return;
    streamStartedRef.current = true;

    startUploadForAllFiles(files);
  }, [isOpen, files]);

  const startUploadForAllFiles = async (filesToUpload: Array<{ file: File; fileId: string; category?: string }>) => {
    try {
      // Group files by category
      const filesByCategory = new Map<string, File[]>();

      filesToUpload.forEach(({ file, category }) => {
        const cat = category || fileCategory;
        if (!filesByCategory.has(cat)) {
          filesByCategory.set(cat, []);
        }
        filesByCategory.get(cat)!.push(file);
      });

      const decoder = new TextDecoder();
      let processedFilesCount = 0;
      const globalTotalFiles = filesToUpload.length;

      // Upload each category sequentially
      for (const [category, categoryFiles] of filesByCategory.entries()) {
        const formData = new FormData();
        categoryFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("file_category", category);
        formData.append("user_id", "test-user");
        formData.append("case_id", "test-case");

        const response = await fetch("/api/documents/upload", {
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

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("Stream ended for category:", category);
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
                  const event: UploadEvent = JSON.parse(dataStr);

                  // Add event to display stream
                  setEvents((prev) => [...prev, event]);

                  // Calculate progress based on current file processing
                  if (event.file_index) {
                    const stepProgressMap: Record<string, number> = {
                      file_processing: 5,
                      reading_file: 15,
                      blob_upload: 25,
                      blob_upload_complete: 35,
                      text_extraction: 50,
                      text_extraction_complete: 65,
                      database_save: 80,
                      file_complete: 95,
                    };

                    // Calculate progress
                    // event.file_index is 1-based within the current batch
                    // processedFilesCount is the count of files in previous batches
                    // globalTotalFiles is the total number of files across all batches

                    const currentGlobalIndex = processedFilesCount + event.file_index - 1; // 0-based global index
                    const progressPerFile = 100 / globalTotalFiles;

                    // Progress from fully completed files
                    const completedFilesProgress = currentGlobalIndex * progressPerFile;

                    // Progress within current file
                    const currentStepProgress = stepProgressMap[event.step || ""] || 0;
                    const currentFileProgressContribution = (currentStepProgress / 100) * progressPerFile;

                    const totalProgress = completedFilesProgress + currentFileProgressContribution;

                    setProgress(Math.min(Math.round(totalProgress), 99));
                  } else if (event.step === "case_metadata_extraction" || event.step === "case_description_generation" || event.step === "summary_generation") {
                    // Final processing steps
                    const finalStepMap: Record<string, number> = {
                      case_metadata_extraction: 92,
                      case_description_generation: 94,
                      summary_generation: 96,
                    };
                    const stepProgress = finalStepMap[event.step] || 92;
                    setProgress(Math.min(Math.round(stepProgress), 99));
                  } else if (event.step === "initialization") {
                    setProgress(2);
                  }

                  // Handle final complete event with all results
                  if (event.type === "complete" && event.result) {
                    console.log("Upload complete for category:", category);
                    const result = event.result as any;

                    // Store result by category
                    categoryResultsRef.current[category] = result;
                    lastResultRef.current = result; // Keep last for backward compatibility
                  }
                } catch (e) {
                  console.error("Failed to parse event:", dataStr, e);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        // Update processed count after category is complete
        processedFilesCount += categoryFiles.length;
      }

      // Combine all category results before completing
      if (Object.keys(categoryResultsRef.current).length > 0) {
        const combinedResult = {
          ...lastResultRef.current,
          categoryResults: categoryResultsRef.current,
        };
        lastResultRef.current = combinedResult;

        setProgress(100);
        setAllComplete(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Upload error:", errorMessage);

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

  // Auto-close and trigger completion after upload finishes
  useEffect(() => {
    if (allComplete && lastResultRef.current) {
      // Wait a short moment for user to see completion
      const timer = setTimeout(() => {
        const finalResult = lastResultRef.current;
        console.log("Final upload result with all categories:", finalResult);
        onComplete(finalResult);
        onClose();
      }, 1500); // 1.5 second delay to show completion

      return () => clearTimeout(timer);
    }
  }, [allComplete, onComplete, onClose]);

  if (!isOpen || files.length === 0) return null;

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
                    {allComplete ? "Upload Complete!" : "Uploading Documents..."}
                  </h2>
                  <p className="text-primary-100 text-xs sm:text-sm truncate">
                    {files.length} file{files.length !== 1 ? "s" : ""}{fileCategory !== "multiple" && ` • ${fileCategory}`}
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
                <p className="text-ink-600 mt-4">Initializing upload...</p>
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

