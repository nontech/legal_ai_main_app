"use client";

import { useState, useEffect, useRef } from "react";

type DocumentCategory =
  | "case_information"
  | "evidence_and_supporting_materials"
  | "relevant_legal_precedents"
  | "key_witness_and_testimony"
  | "police_report"
  | "potential_challenges_and_weaknesses";

interface ClassifiedFile {
  id: string; // Unique identifier for the file
  file: File;
  category: DocumentCategory;
  isClassifying: boolean;
}

interface DocumentUploadStepProps {
  onContinue: (files: File[], metadata?: any, caseInfoFiles?: File[], caseId?: string) => void;
  caseId?: string | null;
}

export default function DocumentUploadStep({
  onContinue,
  caseId: initialCaseId,
}: DocumentUploadStepProps) {
  const [classifiedFiles, setClassifiedFiles] = useState<ClassifiedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(initialCaseId || null);
  const [isCreatingCase, setIsCreatingCase] = useState(!initialCaseId);
  const [isDragActive, setIsDragActive] = useState(false);
  const caseCreationAttempted = useRef(false);

  // Create a case on mount if caseId is not provided
  useEffect(() => {
    if (!initialCaseId && !caseCreationAttempted.current) {
      caseCreationAttempted.current = true;

      const createCase = async () => {
        try {
          const res = await fetch("/api/cases?type=quick-analysis", {
            method: "POST",
          });
          const json = await res.json();

          if (json.ok && json.id) {
            setCaseId(json.id);
          } else {
            console.error("Failed to create case:", json.error);
          }
        } catch (error) {
          console.error("Error creating case:", error);
        } finally {
          setIsCreatingCase(false);
        }
      };

      createCase();
    }
  }, [initialCaseId]);

  const categoryLabels: Record<DocumentCategory, { label: string; color: string; icon: string }> = {
    case_information: { label: "Case Information", color: "primary", icon: "📋" },
    evidence_and_supporting_materials: { label: "Evidence & Materials", color: "accent", icon: "🔍" },
    relevant_legal_precedents: { label: "Legal Precedents", color: "success", icon: "⚖️" },
    key_witness_and_testimony: { label: "Witness & Testimony", color: "highlight", icon: "👤" },
    police_report: { label: "Police Report", color: "critical", icon: "🚔" },
    potential_challenges_and_weaknesses: { label: "Challenges & Weaknesses", color: "highlight", icon: "⚠️" },
  };

  const classifyDocument = async (file: File, fileId: string) => {
    // Update file to show as classifying
    setClassifiedFiles((prev) =>
      prev.map((cf) =>
        cf.id === fileId ? { ...cf, isClassifying: true } : cf
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/documents/classify",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Classification failed: ${response.statusText}`);
      }

      const result = await response.json();
      const classifiedCategory = (result.category || "case_information") as DocumentCategory;

      // Update file with classification
      setClassifiedFiles((prev) =>
        prev.map((cf) =>
          cf.id === fileId
            ? { ...cf, category: classifiedCategory, isClassifying: false }
            : cf
        )
      );
    } catch (error) {
      console.error("Failed to classify document:", error);
      // Default to case_information on error
      setClassifiedFiles((prev) =>
        prev.map((cf) =>
          cf.id === fileId
            ? { ...cf, category: "case_information", isClassifying: false }
            : cf
        )
      );
    }
  };

  const processIncomingFiles = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const timestamp = Date.now();
    const newClassifiedFiles = incomingFiles.map((file, index) => ({
      id: `${timestamp}-${index}-${Math.random()}`, // Generate unique ID
      file,
      category: "case_information" as DocumentCategory,
      isClassifying: true,
    }));

    setClassifiedFiles((prev) => [...prev, ...newClassifiedFiles]);

    // Classify each new file
    newClassifiedFiles.forEach((cf) => {
      classifyDocument(cf.file, cf.id);
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      processIncomingFiles(newFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isUploading) return;
    if (!isDragActive) {
      setIsDragActive(true);
    }
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isUploading) return;
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Avoid prematurely resetting when moving between children
    if (
      event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      return;
    }

    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (isUploading) return;

    const droppedFiles = Array.from(event.dataTransfer.files || []);
    processIncomingFiles(droppedFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    setClassifiedFiles((prev) => prev.filter((cf) => cf.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Math.round((bytes / Math.pow(k, i)) * 100) / 100 +
      " " +
      sizes[i]
    );
  };

  const getCategoryColor = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: "bg-primary-100 text-primary-600 border-primary-200",
      accent: "bg-accent-100 text-accent-600 border-accent-500",
      success: "bg-success-100 text-success-600 border-success-500",
      highlight: "bg-highlight-200 text-highlight-600 border-highlight-500",
      critical: "bg-critical-100 text-critical-600 border-critical-500",
    };
    return colorMap[color] || colorMap.primary;
  };

  const handleContinue = async () => {
    if (classifiedFiles.length === 0) {
      onContinue([]);
      return;
    }

    // Check if any files are still classifying
    const isAnyClassifying = classifiedFiles.some((cf) => cf.isClassifying);
    if (isAnyClassifying) {
      alert("Please wait for all files to be classified before continuing.");
      return;
    }

    setIsUploading(true);

    try {
      // Group files by category
      const groupedByCategory = classifiedFiles.reduce(
        (acc, { file, category }) => {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(file);
          return acc;
        },
        {} as Record<DocumentCategory, File[]>
      );

      const userId = "test-user";
      let collectedMetadata: any = {};
      const caseInformationFiles: File[] = [];

      // Upload each category group
      for (const [category, files] of Object.entries(groupedByCategory)) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("file_category", category);
        formData.append("user_id", userId);
        formData.append("case_id", caseId || "test-case");

        try {
          const response = await fetch(
            "/api/documents/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const result = await response.json();
          console.log(`Uploaded ${category}:`, result);

          // If this is case_information, collect metadata
          if (category === "case_information" && result.metadata) {
            collectedMetadata = result.metadata;
            caseInformationFiles.push(...files);
          }
        } catch (error) {
          console.error(`Failed to upload ${category}:`, error);
        }
      }

      // Continue with all files, passing metadata and caseInformationFiles
      onContinue(
        classifiedFiles.map((cf) => cf.file),
        collectedMetadata,
        caseInformationFiles,
        caseId || "test-case"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {isCreatingCase ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"></div>
          <p className="text-lg text-ink-600">Creating your case...</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-ink-900 mb-3">
              Upload Your Case Documents
            </h1>
            <p className="text-ink-600 text-lg">
              Upload case briefs, complaints, legal memos, evidence, and
              related documents to begin your analysis
            </p>
          </div>

          <div className="bg-surface-000 rounded-2xl border-2 border-border-200 p-8 mb-6">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isUploading
                  ? "border-border-200"
                  : isDragActive
                    ? "border-primary-400 bg-primary-50"
                    : "border-border-200 hover:border-primary-300"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileUpload"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className={`cursor-pointer flex flex-col items-center ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-ink-900 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-ink-500">
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF • Max 10
                  MB per file
                </p>
              </label>
            </div>

            {classifiedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-ink-900">
                    Uploaded Files ({classifiedFiles.length})
                  </h3>
                  <button
                    onClick={() => setClassifiedFiles([])}
                    disabled={isUploading}
                    className="text-sm text-critical-500 hover:text-critical-600 font-medium disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {classifiedFiles.map((classifiedFile) => {
                    const categoryInfo =
                      categoryLabels[classifiedFile.category];
                    return (
                      <div
                        key={classifiedFile.id}
                        className="flex items-center justify-between p-4 bg-surface-100 rounded-lg border border-border-200 hover:bg-surface-200 transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3 flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-primary-600"
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
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-ink-900 truncate">
                                {classifiedFile.file.name}
                              </p>
                              {classifiedFile.isClassifying ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-surface-200 text-ink-600">
                                  <span className="inline-block w-2 h-2 bg-ink-400 rounded-full animate-pulse"></span>
                                  Classifying...
                                </span>
                              ) : (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                                    categoryInfo.color
                                  )}`}
                                >
                                  {categoryInfo.icon} {categoryInfo.label}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ink-500">
                              {formatFileSize(classifiedFile.file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveFile(classifiedFile.id)
                          }
                          disabled={isUploading}
                          className="ml-4 text-critical-500 hover:text-critical-600 flex-shrink-0 disabled:opacity-50"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={handleContinue}
              disabled={
                classifiedFiles.length === 0 ||
                isUploading ||
                classifiedFiles.some((cf) => cf.isClassifying)
              }
              className="px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isUploading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Uploading...</span>
                </>
              ) : classifiedFiles.some((cf) => cf.isClassifying) ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Classifying Documents...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setClassifiedFiles([]);
                onContinue([], {}, [], caseId || "test-case");
              }}
              disabled={
                isUploading || classifiedFiles.some((cf) => cf.isClassifying)
              }
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium underline disabled:opacity-50"
            >
              Skip and continue without documents
            </button>
          </div>
        </>
      )}
    </div>
  );
}
