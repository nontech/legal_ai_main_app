"use client";

import { useState, useEffect, useRef } from "react";
import StreamingUploadDisplay from "../StreamingUploadDisplay";

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
  category?: DocumentCategory; // Category assigned after upload
  isUploading?: boolean; // Whether file is currently being uploaded
}

interface DocumentUploadStepProps {
  onContinue: (
    files: File[],
    metadata?: any,
    caseInfoFiles?: File[],
    caseId?: string,
    uploadedDocuments?: Record<
      string,
      {
        files: Array<{ name: string; address: string }>;
        summary?: string;
      }
    >
  ) => void;
  caseId?: string | null;
}

export default function DocumentUploadStep({
  onContinue,
  caseId: initialCaseId,
}: DocumentUploadStepProps) {
  const [classifiedFiles, setClassifiedFiles] = useState<
    ClassifiedFile[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(
    initialCaseId || null
  );
  const [isCreatingCase, setIsCreatingCase] = useState(
    !initialCaseId
  );
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Record<
      string,
      {
        files: Array<{ name: string; address: string }>;
        summary?: string;
      }
    >
  >({});
  const caseCreationAttempted = useRef(false);

  // Create a case on mount if caseId is not provided
  useEffect(() => {
    if (!initialCaseId && !caseCreationAttempted.current && !caseId) {
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

  const categoryLabels: Record<
    DocumentCategory,
    { label: string; color: string; icon: string }
  > = {
    case_information: {
      label: "Case Information",
      color: "primary",
      icon: "📋",
    },
    evidence_and_supporting_materials: {
      label: "Evidence & Materials",
      color: "accent",
      icon: "🔍",
    },
    relevant_legal_precedents: {
      label: "Legal Precedents",
      color: "success",
      icon: "⚖️",
    },
    key_witness_and_testimony: {
      label: "Witness & Testimony",
      color: "highlight",
      icon: "👤",
    },
    police_report: {
      label: "Police Report",
      color: "critical",
      icon: "🚔",
    },
    potential_challenges_and_weaknesses: {
      label: "Challenges & Weaknesses",
      color: "highlight",
      icon: "⚠️",
    },
  };

  const [isUploadingOpen, setIsUploadingOpen] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<
    Array<{ file: File; fileId: string }>
  >([]);
  const uploadCompleteRef = useRef(false);
  const uploadResultRef = useRef<any>(null);

  const handleUploadComplete = (result: any) => {
    console.log("Upload completed:", result);
    uploadResultRef.current = result;
    uploadCompleteRef.current = true;

    // Process uploaded documents by category
    if (
      result?.category_results &&
      Array.isArray(result.category_results)
    ) {
      const documentsByCategory: Record<
        string,
        {
          files: Array<{ name: string; address: string }>;
          summary?: string;
        }
      > = {};

      result.category_results.forEach((categoryResult: any) => {
        const category =
          categoryResult.file_category || categoryResult.category;
        if (
          category &&
          categoryResult.file_names &&
          categoryResult.file_addresses
        ) {
          documentsByCategory[category] = {
            files: categoryResult.file_names.map(
              (name: string, index: number) => ({
                name,
                address: categoryResult.file_addresses[index] || "",
              })
            ),
            summary: categoryResult.summary,
          };
        }
      });
      console.log(
        "Documents by category in upload stage:",
        documentsByCategory
      );

      setUploadedDocuments(documentsByCategory);

      // Update classifiedFiles with categories from upload result
      setClassifiedFiles((prev) => {
        const fileMap = new Map<string, DocumentCategory>();

        // Build map of file names to categories from upload result
        result.category_results?.forEach((categoryResult: any) => {
          const category = (categoryResult.file_category ||
            categoryResult.category) as DocumentCategory;
          categoryResult.file_names?.forEach((fileName: string) => {
            fileMap.set(fileName, category);
          });
        });

        return prev.map((cf) => {
          const category = fileMap.get(cf.file.name);
          return category ? { ...cf, category } : cf;
        });
      });
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
      // No category assigned yet - will be assigned after upload
    }));

    setClassifiedFiles((prev) => [...prev, ...newClassifiedFiles]);
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

  const handleDragEnter = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (isUploading) return;
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
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
    setClassifiedFiles((prev) =>
      prev.filter((cf) => cf.id !== fileId)
    );
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"
              fill="#DC2626"
            />
            <path
              d="M14,2V8H20"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              x="12"
              y="15"
              fontSize="7"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
            >
              PDF
            </text>
          </svg>
        );
      case "doc":
      case "docx":
        return (
          <svg
            className="w-5 h-5 text-blue-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <svg
            className="w-5 h-5 text-purple-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "txt":
        return (
          <svg
            className="w-5 h-5 text-ink-500 flex-shrink-0"
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
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-ink-400 flex-shrink-0"
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
        );
    }
  };

  const getCategoryColor = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: "bg-primary-100 text-primary-600 border-primary-200",
      accent: "bg-accent-100 text-accent-600 border-accent-500",
      success: "bg-success-100 text-success-600 border-success-500",
      highlight:
        "bg-highlight-200 text-highlight-600 border-highlight-500",
      critical:
        "bg-critical-100 text-critical-600 border-critical-500",
    };
    return colorMap[color] || colorMap.primary;
  };

  const handleContinue = async () => {
    if (classifiedFiles.length === 0) {
      onContinue([], {}, [], caseId || "test-case");
      return;
    }

    setIsUploading(true);

    try {
      const userId = "test-user";
      let collectedMetadata: any = {};
      const caseInformationFiles: File[] = [];
      let finalUploadedDocuments: Record<
        string,
        {
          files: Array<{ name: string; address: string }>;
          summary?: string;
        }
      > = {};

      // Prepare all files for upload in a single batch (no category grouping needed)
      if (classifiedFiles.length > 0) {
        // Reset upload complete flag and result
        uploadCompleteRef.current = false;
        uploadResultRef.current = null;

        // Prepare files for upload
        const allFilesToUpload = classifiedFiles.map((cf) => ({
          file: cf.file,
          fileId: cf.id,
        }));

        // Show upload modal
        setFilesToUpload(allFilesToUpload);
        setIsUploadingOpen(true);

        // Wait for all uploads to complete
        await new Promise<void>((resolve) => {
          const checkComplete = setInterval(async () => {
            if (uploadCompleteRef.current) {
              clearInterval(checkComplete);
              setIsUploadingOpen(false);

              // Extract metadata from upload result if available
              if (uploadResultRef.current) {
                const result = uploadResultRef.current;

                // Process MultiCategoryUploadResponse format
                // Handle both snake_case (category_results) and camelCase (categoryResults) formats
                const categoryResults =
                  result.category_results || result.categoryResults;

                if (
                  categoryResults &&
                  Array.isArray(categoryResults)
                ) {
                  console.log(
                    "Processing category_results:",
                    categoryResults
                  );

                  // Find case_information category result
                  const caseInfoResult = categoryResults.find(
                    (catResult: any) =>
                      catResult.file_category ===
                      "case_information" ||
                      catResult.category === "case_information"
                  );

                  if (caseInfoResult) {
                    collectedMetadata.caseName =
                      caseInfoResult.case_title || "";
                    collectedMetadata.caseDescription =
                      caseInfoResult.case_description || "";

                    // Track which fields were extracted
                    collectedMetadata.extractedFields = {
                      caseName: !!caseInfoResult.case_title,
                      caseDescription:
                        !!caseInfoResult.case_description,
                      jurisdiction: false,
                      role: false,
                      caseType: false,
                    };

                    if (caseInfoResult.case_metadata) {
                      collectedMetadata.jurisdiction = {
                        country:
                          caseInfoResult.case_metadata.country || "",
                        country_code:
                          caseInfoResult.case_metadata.country_code || "",
                        jurisdiction:
                          caseInfoResult.case_metadata.jurisdiction || "",
                        jurisdiction_code:
                          caseInfoResult.case_metadata.jurisdiction_code || "",
                        court_name:
                          caseInfoResult.case_metadata.court_name || "",
                      };
                      collectedMetadata.role =
                        caseInfoResult.case_metadata.role ||
                        "plaintiff";

                      // Extract case type - check both case_metadata.case_type and case_type at root level
                      const extractedCaseType =
                        caseInfoResult.case_metadata.case_type ||
                        caseInfoResult.case_type ||
                        "";
                      if (extractedCaseType) {
                        collectedMetadata.caseType =
                          extractedCaseType.toLowerCase();
                      }

                      // Track extracted fields
                      collectedMetadata.extractedFields.jurisdiction =
                        !!(
                          caseInfoResult.case_metadata.country ||
                          caseInfoResult.case_metadata.country_code ||
                          caseInfoResult.case_metadata.jurisdiction ||
                          caseInfoResult.case_metadata.jurisdiction_code ||
                          caseInfoResult.case_metadata.court_name);
                      collectedMetadata.extractedFields.role = !!caseInfoResult.case_metadata.role;
                      collectedMetadata.extractedFields.caseType = !!extractedCaseType;

                      // Extract charges if available
                      if (caseInfoResult.case_metadata.charges && Array.isArray(caseInfoResult.case_metadata.charges)) {
                        collectedMetadata.charges =
                          caseInfoResult.case_metadata.charges.map(
                            (charge: any, index: number) => ({
                              id: `charge-${Date.now()}-${index}`,
                              statuteNumber:
                                charge.statute_number || "",
                              chargeDescription:
                                charge.charge_description || "",
                              essentialFacts:
                                charge.essential_facts || "",
                              defendantPlea:
                                charge.defendants_plea ||
                                "not-guilty",
                            })
                          );
                      }
                    }
                  }

                  // Build uploaded documents by category for passing to QuickAnalysisForm
                  const documentsByCategory: Record<
                    string,
                    {
                      files: Array<{ name: string; address: string }>;
                      summary?: string;
                    }
                  > = {};

                  categoryResults.forEach((categoryResult: any) => {
                    const category =
                      categoryResult.file_category ||
                      categoryResult.category;
                    const fileNames =
                      categoryResult.file_names ||
                      categoryResult.fileNames;
                    const fileAddresses =
                      categoryResult.file_addresses ||
                      categoryResult.fileAddresses;

                    if (category && fileNames && fileAddresses) {
                      documentsByCategory[category] = {
                        files: fileNames.map(
                          (name: string, index: number) => ({
                            name,
                            address: fileAddresses[index] || "",
                          })
                        ),
                        summary: categoryResult.summary,
                      };
                    }
                  });

                  console.log(
                    "Built documentsByCategory:",
                    documentsByCategory
                  );
                  console.log(
                    "Number of categories:",
                    Object.keys(documentsByCategory).length
                  );

                  // Store in local variable to pass to onContinue
                  finalUploadedDocuments = documentsByCategory;

                  // Update state for display in upload step
                  setUploadedDocuments(documentsByCategory);

                  // Save file info and summaries to case_details
                  if (caseId) {
                    try {
                      console.log("Upload result:", result);

                      // Build case details update with file info for each category
                      const caseDetailsUpdate: Record<string, any> =
                        {};
                      let completionCount = 0;

                      categoryResults.forEach(
                        (categoryResult: any) => {
                          const category =
                            categoryResult.file_category ||
                            categoryResult.category;
                          const fileNames =
                            categoryResult.file_names ||
                            categoryResult.fileNames;
                          const fileAddresses =
                            categoryResult.file_addresses ||
                            categoryResult.fileAddresses;

                          if (
                            category &&
                            fileNames &&
                            fileAddresses
                          ) {
                            const files = fileNames.map(
                              (name: string, index: number) => ({
                                name,
                                address: fileAddresses[index] || "",
                              })
                            );

                            caseDetailsUpdate[category] = {
                              files,
                              summary: categoryResult.summary || "",
                              summaryGenerated:
                                !!categoryResult.summary,
                            };
                            completionCount++;
                          }
                        }
                      );

                      const completionPercentage = Math.round(
                        (completionCount / 6) * 100
                      );

                      // Also update case_information with case name and description
                      if (
                        collectedMetadata.caseName ||
                        collectedMetadata.caseDescription
                      ) {
                        if (!caseDetailsUpdate["case_information"]) {
                          caseDetailsUpdate["case_information"] = {};
                        }
                        caseDetailsUpdate[
                          "case_information"
                        ].caseName = collectedMetadata.caseName || "";
                        caseDetailsUpdate[
                          "case_information"
                        ].caseDescription =
                          collectedMetadata.caseDescription || "";
                      }
                      caseDetailsUpdate._completion_status =
                        completionPercentage;

                      console.log(
                        "Files grouped by category:",
                        caseDetailsUpdate
                      );
                      console.log(
                        "Case details update:",
                        caseDetailsUpdate
                      );

                      // Save to database
                      const updateResponse = await fetch(
                        `/api/cases/update`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            caseId,
                            field: "case_details",
                            value: caseDetailsUpdate,
                          }),
                        }
                      );

                      if (!updateResponse.ok) {
                        console.error(
                          "Failed to save file info:",
                          await updateResponse.text()
                        );
                      } else {
                        console.log(
                          "Successfully saved file info to database"
                        );
                      }
                    } catch (error) {
                      console.error(
                        "Failed to save file info to database:",
                        error
                      );
                    }
                  }
                }
              }

              resolve();
            }
          }, 100);

          // Timeout after 5 minutes
          setTimeout(() => {
            clearInterval(checkComplete);
            setIsUploadingOpen(false);
            resolve();
          }, 300000);
        });
      }

      // Continue with all files, passing metadata, caseInformationFiles, and uploaded documents
      console.log(
        "Passing uploaded documents to QuickAnalysisForm:",
        finalUploadedDocuments
      );
      console.log(
        "Number of categories:",
        Object.keys(finalUploadedDocuments).length
      );

      onContinue(
        classifiedFiles.map((cf) => cf.file),
        collectedMetadata,
        caseInformationFiles,
        caseId || "test-case",
        finalUploadedDocuments
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
          <p className="text-lg text-ink-600">
            Creating your case...
          </p>
        </div>
      ) : (
        <>
          <div className="bg-surface-000 p-8 mb-6">
            {classifiedFiles.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isUploading
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
                  className={`cursor-pointer flex flex-col items-center ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600"
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
                  <p className="text-base sm:text-lg font-semibold text-ink-900 mb-2">
                    Drop files here or click
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 text-center px-2">
                    PDF, DOC, DOCX, TXT, JPG, PNG, GIF • Max 10 MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border border-border-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-ink-500"
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
                      <span className="text-base text-ink-600 font-medium">
                        {classifiedFiles.length}{" "}
                        {classifiedFiles.length === 1
                          ? "file"
                          : "files"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const input = document.getElementById(
                            "fileUpload"
                          ) as HTMLInputElement;
                          if (input) input.click();
                        }}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add
                      </button>
                      <span className="text-border-300">•</span>
                      <button
                        onClick={() => setClassifiedFiles([])}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {classifiedFiles.map((classifiedFile) => {
                      return (
                        <div
                          key={classifiedFile.id}
                          className="flex items-center justify-between p-4 rounded hover:bg-surface-50 transition-colors group"
                        >
                          <div className="flex items-center flex-1 min-w-0 gap-3">
                            <div className="flex-shrink-0">
                              {getFileIcon(classifiedFile.file.name)}
                            </div>
                            <p className="text-base text-ink-900 truncate flex-1">
                              {classifiedFile.file.name}
                            </p>
                            <p className="text-sm text-ink-400 flex-shrink-0">
                              {formatFileSize(
                                classifiedFile.file.size
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveFile(classifiedFile.id)
                            }
                            disabled={isUploading}
                            className="ml-3 p-1.5 text-ink-400 hover:text-ink-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer opacity-0 group-hover:opacity-100"
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
                <div
                  className={`border border-dashed rounded-lg p-4 text-center transition-colors ${isUploading
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
                    className={`cursor-pointer flex items-center justify-center gap-2 text-sm text-ink-600 hover:text-ink-900 ${isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add more files
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleContinue}
              disabled={classifiedFiles.length === 0 || isUploading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary-500 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-primary-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Process Documents & Auto-Fill</span>
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
              disabled={isUploading}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Skip and enter case details manually
            </button>
          </div>
        </>
      )}

      <StreamingUploadDisplay
        isOpen={isUploadingOpen}
        files={filesToUpload}
        fileCategory="multiple"
        caseId={caseId || undefined}
        onComplete={(result) => {
          // Upload complete - signal to handleContinue
          handleUploadComplete(result);
        }}
        onClose={() => {
          setIsUploadingOpen(false);
          setFilesToUpload([]);
        }}
      />
    </div>
  );
}
