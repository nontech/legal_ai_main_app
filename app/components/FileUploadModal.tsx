"use client";

import { useState, useRef, useEffect } from "react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: string;
  initialFiles?: UploadedFile[];
  summaryGenerated?: boolean;
  summaryText?: string;
  onFilesUpdate?: (files: UploadedFile[]) => void;
  onSummaryGenerated?: () => void;
  caseId?: string;
  sectionId?: string;
  onSave?: (data: { files: UploadedFile[]; summary: string }) => Promise<void>;
  caseTitle?: string;
  caseDescription?: string;
  onCaseDetailsUpdate?: (title: string, description: string) => Promise<void>;
}

type ViewType = "upload" | "summary";

type DocumentCategory =
  | "case_information"
  | "evidence_and_supporting_materials"
  | "relevant_legal_precedents"
  | "key_witness_and_testimony"
  | "police_report"
  | "potential_challenges_and_weaknesses";

interface ClassifiedUploadedFile extends UploadedFile {
  category?: DocumentCategory;
  isClassifying?: boolean;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  initialFiles = [],
  summaryGenerated = false,
  summaryText = "",
  onFilesUpdate,
  onSummaryGenerated,
  caseId,
  sectionId,
  onSave,
  caseTitle,
  caseDescription,
  onCaseDetailsUpdate,
}: FileUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("summary");
  const [isSplitView, setIsSplitView] = useState(true);
  const [aiSummary, setAiSummary] = useState(summaryText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localSummaryGenerated, setLocalSummaryGenerated] = useState(summaryGenerated || false);
  const [isSummaryEdited, setIsSummaryEdited] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedTitle, setEditedTitle] = useState(caseTitle || "");
  const [editedDescription, setEditedDescription] = useState(caseDescription || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when initialFiles or summaryText changes
  useEffect(() => {
    setUploadedFiles(initialFiles);
    if (summaryText) {
      setAiSummary(summaryText);
    }
  }, [initialFiles, summaryText]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: ClassifiedUploadedFile[] = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      category: undefined,
      isClassifying: true,
    }));
    const updatedFiles = [...uploadedFiles, ...newFiles] as ClassifiedUploadedFile[];
    setUploadedFiles(updatedFiles);
    if (onFilesUpdate) {
      onFilesUpdate(updatedFiles);
    }

    // Classify each file
    newFiles.forEach((fileObj) => {
      classifyFile(fileObj.id, files.find(f => f.name === fileObj.name)!);
    });
  };

  const classifyFile = async (fileId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const result = await response.json();
      const category = (result.category || "case_information") as DocumentCategory;

      // Update file with classification
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...(f as ClassifiedUploadedFile), category, isClassifying: false }
            : f
        ) as ClassifiedUploadedFile[]
      );
    } catch (error) {
      console.error("Failed to classify file:", error);
      // Default to case_information
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...(f as ClassifiedUploadedFile), category: "case_information", isClassifying: false }
            : f
        ) as ClassifiedUploadedFile[]
      );
    }
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(
      (file) => file.id !== id
    );
    setUploadedFiles(updatedFiles);
    if (onFilesUpdate) {
      onFilesUpdate(updatedFiles);
    }
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

  const generateMockSummary = (
    sectionTitle: string,
    files: UploadedFile[]
  ) => {
    const fileCount = files.length;
    const fileNames = files.map((f) => f.name).join(", ");

    // Generate contextual summary based on section type
    if (
      sectionTitle.includes("Case Documents") ||
      sectionTitle.includes("Basic")
    ) {
      return `Based on the analysis of ${fileCount} uploaded document${fileCount > 1 ? "s" : ""
        }, this case appears to involve complex legal matters requiring careful examination. The submitted materials (${fileNames}) provide comprehensive background information.\n\nKey observations from the documentation:\n• The case briefs outline the fundamental legal arguments and procedural history\n• Supporting documentation establishes the factual foundation for the claims\n• Legal memoranda provide analysis of applicable statutes and case law\n• All materials appear properly formatted and complete for review\n\nRecommendation: The documentation provides a solid foundation for case analysis. Additional context may be needed regarding specific jurisdictional requirements and timeline considerations.`;
    } else if (sectionTitle.includes("Evidence")) {
      return `The evidence materials consist of ${fileCount} document${fileCount > 1 ? "s" : ""
        } that will be critical to establishing the factual basis of this case. Analysis of the submitted files (${fileNames}) reveals several important elements.\n\nEvidence Assessment:\n• Physical evidence documentation appears thorough and well-organized\n• Forensic reports provide technical analysis supporting key claims\n• Expert witness materials establish credibility and specialized knowledge\n• Chain of custody considerations have been properly documented\n• Supporting contracts and agreements are included for reference\n\nThe evidence package is substantial and should significantly strengthen the case positioning. Consider organizing materials chronologically for maximum impact during presentation.`;
    } else if (sectionTitle.includes("Witness")) {
      return `Review of ${fileCount} witness-related document${fileCount > 1 ? "s" : ""
        } (${fileNames}) indicates a strong testimonial foundation for the case. The witness statements provide crucial first-hand accounts and expert analysis.\n\nWitness Documentation Summary:\n• Witness statements are detailed and corroborate key facts\n• Deposition transcripts capture testimony under oath with cross-examination\n• Expert witness qualifications are well-established and relevant\n• Testimony aligns with physical evidence and timeline of events\n\nRecommendation: The witness testimony appears credible and compelling. Consider preparing witnesses for potential cross-examination challenges and ensure all statements remain consistent.`;
    } else if (sectionTitle.includes("Precedent")) {
      return `Analysis of ${fileCount} legal precedent${fileCount > 1 ? "s" : ""
        } (${fileNames}) reveals relevant case law that strongly supports the legal arguments in this matter.\n\nPrecedent Analysis:\n• Cases cited are from appropriate jurisdictions with binding authority\n• Legal principles align directly with the current fact pattern\n• Recent decisions reflect modern judicial interpretation\n• Precedents establish favorable standards of review and burden of proof\n• Distinguished cases have been properly analyzed and differentiated\n\nThe precedential foundation is solid and should provide persuasive authority for the legal arguments. Consider highlighting the most directly applicable cases in briefing and oral arguments.`;
    } else if (sectionTitle.includes("Police")) {
      return `The police report documentation consists of ${fileCount} file${fileCount > 1 ? "s" : ""
        } (${fileNames}) providing official law enforcement perspective on the incident.\n\nPolice Report Summary:\n• Official incident report documents initial response and observations\n• Officer statements provide professional assessment of the scene\n• Evidence collection procedures are documented and proper\n• Witness statements taken at the scene are included\n• Follow-up investigation notes provide additional context\n\nThe police documentation appears thorough and professionally prepared. The official nature of these records adds significant credibility to the factual record.`;
    } else if (sectionTitle.includes("Challenge")) {
      return `Examination of ${fileCount} document${fileCount > 1 ? "s" : ""
        } related to potential challenges and weaknesses (${fileNames}) is crucial for realistic case assessment and strategic planning.\n\nChallenge Assessment:\n• Opposing counsel arguments have been carefully analyzed\n• Potential weaknesses in evidence chain have been identified\n• Unfavorable precedents require strategic response planning\n• Procedural vulnerabilities need proactive management\n• Counter-arguments must be prepared for anticipated challenges\n\nRecommendation: While challenges exist, most can be effectively managed with proper preparation. Develop comprehensive responses to each identified weakness and consider pre-emptive motions where appropriate.`;
    }

    return `Summary of ${fileCount} uploaded document${fileCount > 1 ? "s" : ""
      } (${fileNames}).\n\nThe documentation has been reviewed and analyzed. Key points have been identified for case strategy consideration.\n\nRecommendation: Additional review may be beneficial to ensure all aspects have been thoroughly examined.`;
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (sectionId === "basic-info") {
      // Generate case description from documents
      const description = generateMockSummary(title, uploadedFiles);
      setEditedDescription(description);
    } else {
      // Generate summary for other sections
      setIsSplitView(true);
      setCurrentView("summary");

      const summary = generateMockSummary(title, uploadedFiles);
      setAiSummary(summary);
      setLocalSummaryGenerated(true);
      setIsSummaryEdited(false);

      // Notify parent that summary has been generated
      if (onSummaryGenerated) {
        onSummaryGenerated();
      }
    }

    setIsGenerating(false);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(aiSummary);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = (format: "pdf" | "txt") => {
    const blob = new Blob([aiSummary], {
      type: format === "pdf" ? "application/pdf" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(
      /[^a-z0-9]/gi,
      "_"
    )}_summary.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const handleSummaryChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAiSummary(e.target.value);
    setIsSummaryEdited(true);
  };

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  const handleSaveChanges = async () => {
    if (!caseId || !sectionId || !onSave) return;

    setIsSaving(true);
    try {
      await onSave({
        files: uploadedFiles,
        summary: aiSummary,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCaseDetails = async () => {
    if (!onCaseDetailsUpdate) return;

    setIsSaving(true);
    try {
      await onCaseDetailsUpdate(editedTitle, editedDescription);
      onClose();
    } catch (error) {
      console.error("Failed to save case details:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <h2 className="text-2xl font-bold">
                  {title || "Document Summary Review"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {description || "Upload documents or add text manually to create a comprehensive summary"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 cursor-pointer rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isSplitView ? (
            /* Split View Layout */
            <div className="h-full flex">
              {/* Left Panel - Documents */}
              <div
                className={`border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-300 ${isLeftPanelCollapsed ? "w-12" : "w-2/5"
                  }`}
              >
                {isLeftPanelCollapsed ? (
                  /* Collapsed State */
                  <button
                    onClick={() => setIsLeftPanelCollapsed(false)}
                    className="p-3 hover:bg-gray-100 transition-colors border-b border-gray-200"
                    title="Expand documents panel"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  /* Expanded State */
                  <>
                    <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between min-h-[56px]">
                      <h3 className="font-semibold text-gray-900">
                        Documents ({uploadedFiles.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
                          title="Add more documents"
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add Documents
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                        />
                        <button
                          onClick={() => setIsLeftPanelCollapsed(true)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                          title="Collapse panel"
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
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {uploadedFiles.length === 0 ? (
                        /* Empty State Message */
                        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-8 h-8 text-gray-400"
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
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            No Documents Uploaded
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 max-w-xs">
                            Upload documents to generate an AI summary and analyze the case details.
                          </p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Upload Documents
                          </button>
                        </div>
                      ) : (
                        /* Documents List */
                        uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center mt-0.5">
                                <svg
                                  className="w-4 h-4 text-blue-600"
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
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                              {/* Three Dot Menu */}
                              <div className="relative flex-shrink-0">
                                <button
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId === file.id ? null : file.id
                                    )
                                  }
                                  className="text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                                  title="More actions"
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
                                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                  </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {openMenuId === file.id && (
                                  <>
                                    {/* Backdrop to close menu when clicking outside */}
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenMenuId(null)}
                                    />

                                    {/* Menu */}
                                    <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                      <button
                                        onClick={() => {
                                          console.log("Print", file.name);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                          />
                                        </svg>
                                        Print
                                      </button>

                                      <button
                                        onClick={() => {
                                          console.log("Download", file.name);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                          />
                                        </svg>
                                        Download
                                      </button>

                                      <button
                                        onClick={() => {
                                          console.log("Send", file.name);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                          />
                                        </svg>
                                        Send
                                      </button>

                                      <button
                                        onClick={() => {
                                          console.log("Preview", file.name);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                          />
                                        </svg>
                                        Preview
                                      </button>

                                      <hr className="my-1 border-gray-200" />

                                      <button
                                        onClick={() => {
                                          handleRemoveFile(file.id);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </>
                )}
              </div>

              {/* Right Panel - Summary */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center flex-1 min-h-0">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Generating AI Summary...
                    </p>
                    <p className="text-sm text-gray-600">
                      Analyzing your documents and creating a comprehensive summary
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Action Toolbar */}
                    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                      <div className="flex items-center justify-end gap-2">
                        {/* Download Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download
                          </button>

                          {showDownloadMenu && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDownloadMenu(false)}
                              />
                              <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                <button
                                  onClick={() => handleDownload("pdf")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Download as PDF
                                </button>
                                <button
                                  onClick={() => handleDownload("txt")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  Download as Text
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        <button
                          onClick={handleCopySummary}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Summary Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                      {sectionId === "basic-info" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Case Title
                            </label>
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                              placeholder="Enter case title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Case Description
                            </label>
                            <textarea
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-y"
                              rows={4}
                              placeholder="Enter case description or generate from uploaded documents"
                            />
                            <div className="flex gap-2 mt-2">
                              {uploadedFiles.length > 0 && (
                                <button
                                  onClick={handleGenerateSummary}
                                  disabled={isGenerating}
                                  className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {isGenerating ? (
                                    <>
                                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      Generating...
                                    </>
                                  ) : editedDescription ? (
                                    <>
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      Regenerate Description
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                      Generate from Documents
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {sectionId !== "basic-info" && (
                        <div className="space-y-2">
                          {/* Generate/Regenerate Button - Above Textarea */}
                          {uploadedFiles.length > 0 && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleGenerateSummary}
                                disabled={isGenerating}
                                className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {isGenerating ? (
                                  <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Generating...
                                  </>
                                ) : aiSummary ? (
                                  <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Regenerate Summary
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Generate Summary
                                  </>
                                )}
                              </button>

                              {/* Word/Character Count - Above Textarea */}
                              {aiSummary && (
                                <div className="text-sm text-gray-600 ml-auto">
                                  <div className="flex items-center gap-4">
                                    <span>{getWordCount(aiSummary)} words</span>
                                    <span>•</span>
                                    <span>{getCharCount(aiSummary)} characters</span>
                                    {isSummaryEdited && (
                                      <span className="text-amber-600 font-medium">● Unsaved changes</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="bg-white p-6">
                            <textarea
                              ref={summaryRef}
                              value={aiSummary}
                              onChange={handleSummaryChange}
                              className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm text-gray-900"
                              placeholder={uploadedFiles.length === 0 ? "Click to add summary text or upload documents to generate a summary..." : "AI-generated summary will appear here or edit manually..."}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Full Width Upload View */
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
                  }`}
              >
                <div className="flex flex-col items-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Drop files here or click to upload
                  </h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Choose Files
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF •
                    Max 10 MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">
                    No files uploaded yet. Drag and drop or click "Choose Files" to add documents.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Uploaded Files ({uploadedFiles.length}) •{" "}
                    {formatFileSize(
                      uploadedFiles.reduce(
                        (acc, file) => acc + file.size,
                        0
                      )
                    )}
                  </h3>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
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
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} •{" "}
                            {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Three Dot Menu */}
                      <div className="relative ml-4 flex-shrink-0">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === file.id ? null : file.id
                            )
                          }
                          className="text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                          title="More actions"
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
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === file.id && (
                          <>
                            {/* Backdrop to close menu when clicking outside */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />

                            {/* Menu */}
                            <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                              <button
                                onClick={() => {
                                  console.log("Print", file.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                  />
                                </svg>
                                Print
                              </button>

                              <button
                                onClick={() => {
                                  console.log("Download", file.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                Download
                              </button>

                              <button
                                onClick={() => {
                                  console.log("Send", file.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                  />
                                </svg>
                                Send
                              </button>

                              <button
                                onClick={() => {
                                  console.log("Preview", file.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Preview
                              </button>

                              <hr className="my-1 border-gray-200" />

                              <button
                                onClick={() => {
                                  handleRemoveFile(file.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {showCopiedToast && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Copied to clipboard!
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-6 pt-6 pb-4 md:pt-8 border-t border-gray-200 flex justify-end items-center gap-3">
          {sectionId === "basic-info" && onCaseDetailsUpdate ? (
            <button
              onClick={handleSaveCaseDetails}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          ) : (
            caseId && sectionId && onSave && (
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
