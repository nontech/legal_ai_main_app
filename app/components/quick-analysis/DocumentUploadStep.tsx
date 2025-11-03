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
    case_information: { label: "Case Information", color: "blue", icon: "📋" },
    evidence_and_supporting_materials: { label: "Evidence & Materials", color: "purple", icon: "🔍" },
    relevant_legal_precedents: { label: "Legal Precedents", color: "green", icon: "⚖️" },
    key_witness_and_testimony: { label: "Witness & Testimony", color: "orange", icon: "👤" },
    police_report: { label: "Police Report", color: "red", icon: "🚔" },
    potential_challenges_and_weaknesses: { label: "Challenges & Weaknesses", color: "yellow", icon: "⚠️" },
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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newClassifiedFiles = newFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`, // Generate unique ID
        file,
        category: "case_information" as DocumentCategory,
        isClassifying: true,
      }));

      setClassifiedFiles((prev) => [...prev, ...newClassifiedFiles]);

      // Classify each new file
      newClassifiedFiles.forEach((cf) => {
        classifyDocument(cf.file, cf.id);
      });
    }
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
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      green: "bg-green-100 text-green-700 border-green-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
      red: "bg-red-100 text-red-700 border-red-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    };
    return colorMap[color] || colorMap.blue;
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
      {/* Loading Case Creation State */}
      {isCreatingCase && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin h-12 w-12 border-4 border-blue-300 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-lg text-gray-600">Creating your case...</p>
        </div>
      )}

      {!isCreatingCase && (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Upload Your Case Documents
            </h1>
            <p className="text-gray-600 text-lg">
              Upload case briefs, complaints, legal memos, evidence, and
              related documents to begin your analysis
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
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
                className={`cursor-pointer flex flex-col items-center ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF • Max 10
                  MB per file
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {classifiedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Uploaded Files ({classifiedFiles.length})
                  </h3>
                  <button
                    onClick={() => setClassifiedFiles([])}
                    disabled={isUploading}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {classifiedFiles.map((classifiedFile, index) => {
                    const categoryInfo = categoryLabels[classifiedFile.category];
                    return (
                      <div
                        key={classifiedFile.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-blue-600"
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
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {classifiedFile.file.name}
                              </p>
                              {classifiedFile.isClassifying ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                  Classifying...
                                </span>
                              ) : (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(categoryInfo.color)}`}
                                >
                                  {categoryInfo.icon} {categoryInfo.label}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(classifiedFile.file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(classifiedFile.id)}
                          disabled={isUploading}
                          className="ml-4 text-red-600 hover:text-red-800 flex-shrink-0 disabled:opacity-50"
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

          {/* Continue Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleContinue}
              disabled={classifiedFiles.length === 0 || isUploading || classifiedFiles.some((cf) => cf.isClassifying)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
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
              disabled={isUploading || classifiedFiles.some((cf) => cf.isClassifying)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium underline disabled:opacity-50"
            >
              Skip and continue without documents
            </button>
          </div>
        </>
      )}
    </div>
  );
}
