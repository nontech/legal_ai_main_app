"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import MarkdownRenderer from "./MarkdownRenderer";

interface CaseDetailsSectionProps {
  onModalChange?: (isOpen: boolean) => void;
  caseId?: string;
  onCompletionChange?: (percentage: number) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size?: number;
  type?: string;
  uploadedAt?: Date | string;
  address?: string;
}

interface SectionData {
  caseName?: string;
  caseDescription?: string;
  files?: UploadedFile[];
  file_names?: string[];
  file_addresses?: string[];
  summary?: string;
  summaryGenerated?: boolean;
  [key: string]: any;
}

// Map database keys to UI section IDs
const DB_TO_UI_MAP: Record<string, string> = {
  "case_information": "case-info",
  "evidence_and_supporting_materials": "evidence",
  "key_witness_and_testimony": "witnesses",
  "relevant_legal_precedents": "precedents",
  "police_report": "police",
  "potential_challenges_and_weaknesses": "challenges",
};

const UI_TO_DB_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DB_TO_UI_MAP).map(([db, ui]) => [ui, db])
);

const SECTION_ICONS: Record<string, string> = {
  "case_information": "📋",
  "evidence_and_supporting_materials": "📎",
  "key_witness_and_testimony": "👥",
  "relevant_legal_precedents": "⚖️",
  "police_report": "🚔",
  "potential_challenges_and_weaknesses": "⚠️",
};

const SECTION_KEYS: string[] = [
  "case_information",
  "evidence_and_supporting_materials",
  "key_witness_and_testimony",
  "relevant_legal_precedents",
  "police_report",
  "potential_challenges_and_weaknesses",
];

const DB_KEY_TO_TRANS_KEY: Record<string, string> = {
  "case_information": "caseInformation",
  "evidence_and_supporting_materials": "evidence",
  "key_witness_and_testimony": "witness",
  "relevant_legal_precedents": "legalPrecedents",
  "police_report": "policeReport",
  "potential_challenges_and_weaknesses": "challenges",
};

const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  "case_information": { label: "Case Information", color: "primary", icon: "📋" },
  "evidence_and_supporting_materials": { label: "Evidence & Materials", color: "accent", icon: "🔍" },
  "key_witness_and_testimony": { label: "Witness & Testimony", color: "highlight", icon: "👤" },
  "relevant_legal_precedents": { label: "Legal Precedents", color: "success", icon: "⚖️" },
  "police_report": { label: "Police Report", color: "critical", icon: "🚔" },
  "potential_challenges_and_weaknesses": { label: "Challenges & Weaknesses", color: "highlight", icon: "⚠️" },
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

export default function CaseDetailsSection({
  onModalChange,
  caseId,
  onCompletionChange,
}: CaseDetailsSectionProps) {
  const t = useTranslations("caseAnalysis.caseDetails");
  const locale = useLocale();
  const [selectedSection, setSelectedSection] = useState<string>("case_information");
  const [caseDescription, setCaseDescription] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [editedSummary, setEditedSummary] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(false);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store all case details keyed by database keys
  const [caseDetails, setCaseDetails] = useState<Record<string, SectionData>>({});

  // Fetch case details from database
  const fetchCaseDetails = useCallback(async () => {
    if (!caseId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/cases/${caseId}`);
      const json = await res.json();

      if (json.ok && json.data?.case_details) {
        const details = json.data.case_details;
        setCaseDetails(details);

        // Extract case description from case_information
        if (details.case_information?.caseDescription) {
          setCaseDescription(details.case_information.caseDescription);
          setEditedDescription(details.case_information.caseDescription);
        }
      }
    } catch (error) {
      console.error("Failed to fetch case details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  // Fetch case details from database if caseId is provided
  useEffect(() => {
    fetchCaseDetails();
  }, [fetchCaseDetails]);

  // Update edited summary when section changes
  useEffect(() => {
    const sectionData = getSectionData(selectedSection);
    if (selectedSection === "case_information") {
      setEditedSummary(sectionData.caseDescription || "");
    } else {
      setEditedSummary(sectionData.summary || "");
    }
    setIsMarkdownPreview(false);
    setShowAllDocuments(false); // Reset document expansion when changing sections
  }, [selectedSection, caseDetails]);

  // Get section data by database key
  const getSectionData = (dbKey: string): SectionData => {
    return caseDetails[dbKey] || {};
  };

  // Get item count for display
  const getItemCount = (dbKey: string): number => {
    const data = getSectionData(dbKey);
    if (data.files && Array.isArray(data.files)) {
      return data.files.length;
    }
    return (data.file_addresses?.length ?? 0) || (data.file_names?.length ?? 0) || 0;
  };

  const getFilesForSection = (dbKey: string): UploadedFile[] => {
    const data = getSectionData(dbKey);

    // Support new format: files array of objects with name and address
    if (data.files && Array.isArray(data.files)) {
      return data.files.map((file: any, index: number) => ({
        id: file.address || `${dbKey}-${index}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: file.uploadedAt,
        address: file.address,
      }));
    }

    // Fallback to old format
    const names = Array.isArray(data.file_names) ? data.file_names : [];
    const addresses = Array.isArray(data.file_addresses) ? data.file_addresses : [];

    return names.map((name: string, index: number) => ({
      id: `${dbKey}-${index}-${name}`,
      name,
      address: addresses[index],
    }));
  };

  const handleSaveSection = async () => {
    if (!caseId) return;

    setIsSaving(true);
    try {
      const existingSection = caseDetails[selectedSection] || {};
      const existingCaseInfo = caseDetails["case_information"] || {};

      let updateData: Record<string, SectionData>;

      if (selectedSection === "case_information") {
        updateData = {
          ...caseDetails,
          case_information: {
            ...existingCaseInfo,
            caseDescription: editedSummary,
          },
        };
        setCaseDescription(editedSummary);
      } else {
        updateData = {
          ...caseDetails,
          [selectedSection]: {
            ...existingSection,
            summary: editedSummary,
            summaryGenerated: Boolean(editedSummary),
          },
        };
      }

      const res = await fetch("/api/cases/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          field: "case_details",
          value: updateData,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to save");
      }

      setCaseDetails(updateData);
    } catch (error) {
      console.error("Failed to save section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !caseId) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // Collect uploaded file info from responses
      const uploadedFiles: Array<{ name: string; address: string }> = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append("section", selectedSection);
        formData.append("case_id", caseId);
        formData.append("files", file);
        formData.append("language_code", locale);

        const response = await fetch("/api/documents/upload-section", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }
        
        // Collect file info from response
        const responseData = await response.json();
        if (responseData.data?.files) {
          uploadedFiles.push(...responseData.data.files);
        } else if (responseData.data?.file_names && responseData.data?.file_addresses) {
          responseData.data.file_names.forEach((name: string, idx: number) => {
            uploadedFiles.push({ name, address: responseData.data.file_addresses[idx] });
          });
        }
      }

      // Refresh case details
      await fetchCaseDetails();
      
      // Reset file input before extraction
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setIsUploading(false);
      
      // Automatically extract information using the uploaded files directly
      if (uploadedFiles.length > 0) {
        await handleGenerateSummaryWithFiles(uploadedFiles);
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert(error instanceof Error ? error.message : "Failed to upload file");
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteFile = async (fileAddress: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    if (!caseId) return;

    try {
      const response = await fetch("/api/documents/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileAddress,
          section: selectedSection,
          caseId,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to delete file");
      }

      // Update local case details
      const updatedCaseDetails = {
        ...caseDetails,
        [selectedSection]: {
          ...(caseDetails[selectedSection] || {}),
          files: json.data.updatedFiles,
        },
      };

      setCaseDetails(updatedCaseDetails);
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert(error instanceof Error ? error.message : "Failed to delete file");
    }
  };

  // Generate summary using files from state
  const handleGenerateSummary = async () => {
    if (!caseId) return;

    const files = getFilesForSection(selectedSection);
    if (files.length === 0) {
      alert("No files uploaded in this section");
      return;
    }

    await handleGenerateSummaryWithFiles(files.map(f => ({ name: f.name, address: f.address || "" })));
  };

  // Generate summary using provided files (used after upload when state hasn't updated yet)
  const handleGenerateSummaryWithFiles = async (files: Array<{ name: string; address: string }>) => {
    if (!caseId || files.length === 0) return;

    setIsGeneratingSummary(true);

    try {
      const response = await fetch("/api/documents/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_addresses: files.map((f) => f.address),
          file_names: files.map((f) => f.name),
          file_category: selectedSection,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const data = await response.json();
      const summary = data.summary || data.data?.summary || "";

      setEditedSummary(summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert(error instanceof Error ? error.message : "Failed to generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "txt":
        return "📃";
      default:
        return "📁";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-ink-600 font-medium">{t("loading", { defaultMessage: "Loading case details..." })}</p>
        </div>
      </div>
    );
  }

  const currentSectionData = getSectionData(selectedSection);
  const currentFiles = getFilesForSection(selectedSection);
  const transKey = DB_KEY_TO_TRANS_KEY[selectedSection];

  return (
    <div>
      <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Sidebar - Section Navigation */}
          <div className="lg:w-64 bg-surface-50 border-b lg:border-b-0 lg:border-r border-border-200 flex-shrink-0">
            <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-400px)] lg:max-h-none">
              {SECTION_KEYS.map((dbKey) => {
                const itemCount = getItemCount(dbKey);
                const sectionTransKey = DB_KEY_TO_TRANS_KEY[dbKey];
                const isSelected = selectedSection === dbKey;

                return (
                  <button
                    key={dbKey}
                    onClick={() => setSelectedSection(dbKey)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-primary-100 text-primary-900 border-l-4 border-primary-500"
                        : "hover:bg-surface-100 text-ink-700"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{SECTION_ICONS[dbKey]}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isSelected ? "text-primary-900" : "text-ink-900"}`}>
                        {t(sectionTransKey)}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {itemCount} {itemCount === 1 ? t("document") : t("documents")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Section Header */}
            <div className="p-4 sm:p-6 border-b border-border-200 bg-surface-000">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-3xl">{SECTION_ICONS[selectedSection]}</span>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-ink-900">{t(transKey)}</h3>
                  <p className="text-sm text-ink-600 mt-1">{t(transKey + "Desc")}</p>
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Summary/Description Section - First */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-ink-700 uppercase tracking-wide">
                    {selectedSection === "case_information" ? "Case Description" : "Details"}
                  </h4>
                  <div className="flex items-center gap-2">
                    {editedSummary && (
                      <button
                        onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                          isMarkdownPreview
                            ? "bg-primary-100 text-primary-700"
                            : "bg-surface-100 text-ink-600 hover:bg-surface-200"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {isMarkdownPreview ? "Edit" : "Preview"}
                      </button>
                    )}
                    {isGeneratingSummary && (
                      <span className="px-3 py-1.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-lg flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Extracting...
                      </span>
                    )}
                  </div>
                </div>

                {isMarkdownPreview && editedSummary ? (
                  <div className="p-4 bg-surface-50 rounded-lg border border-border-200 min-h-[150px] max-h-[300px] overflow-y-auto">
                    <MarkdownRenderer content={editedSummary} />
                  </div>
                ) : (
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full min-h-[150px] p-4 border border-border-300 rounded-lg resize-y text-sm text-ink-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={
                      selectedSection === "case_information"
                        ? "Enter case description or extract from uploaded documents..."
                        : "Extract information from documents or add manually..."
                    }
                  />
                )}
              </div>

              {/* Files Section - After Description */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-ink-700 uppercase tracking-wide">
                    Documents ({currentFiles.length})
                  </h4>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload
                      </>
                    )}
                  </button>
                </div>

                {/* Uploading State Banner */}
                {isUploading && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-900">Uploading documents...</p>
                      <p className="text-xs text-primary-700">Please wait while your files are being uploaded</p>
                    </div>
                  </div>
                )}

                {currentFiles.length === 0 && !isUploading && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full border-2 border-dashed border-border-300 rounded-lg p-6 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-ink-700 font-medium text-sm mb-1">Click to upload documents</p>
                    <p className="text-xs text-ink-500">PDF, DOC, DOCX, TXT, JPG, PNG supported</p>
                  </button>
                )}

                {currentFiles.length > 0 && (
                  <div className="space-y-2">
                    {currentFiles
                      .slice(0, showAllDocuments ? undefined : 2)
                      .map((file) => {
                        const categoryInfo = CATEGORY_LABELS[selectedSection];
                        return (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg border border-border-100 hover:border-border-200 hover:bg-surface-100 transition-colors group"
                          >
                            <div className="flex items-center justify-center w-8 h-8 bg-primary-50 rounded flex-shrink-0">
                              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm font-medium text-ink-900 truncate">{file.name}</span>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border flex-shrink-0 ${getCategoryColor(categoryInfo?.color || "primary")}`}>
                                <span>{categoryInfo?.icon}</span>
                                <span>{categoryInfo?.label}</span>
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteFile(file.address || "", file.name)}
                              className="p-1.5 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete file"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    
                    {/* Show More/Less Button */}
                    {currentFiles.length > 2 && (
                      <button
                        onClick={() => setShowAllDocuments(!showAllDocuments)}
                        className="w-full py-2 px-3 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        {showAllDocuments ? (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show {currentFiles.length - 2} More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-border-200 bg-surface-50">
            <div className="flex justify-end">
              <button
                onClick={handleSaveSection}
                disabled={isSaving || isUploading || isGeneratingSummary}
                className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : isUploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : isGeneratingSummary ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
