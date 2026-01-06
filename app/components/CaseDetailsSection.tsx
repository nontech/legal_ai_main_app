"use client";

import { useState, useEffect, useCallback } from "react";
import FileUploadModal from "./FileUploadModal";
import { useTranslations } from "next-intl";

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

export default function CaseDetailsSection({
  onModalChange,
  caseId,
  onCompletionChange,
}: CaseDetailsSectionProps) {
  const t = useTranslations("caseAnalysis.caseDetails");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [caseTitle, setCaseTitle] = useState<string>("");
  const [caseDescription, setCaseDescription] = useState<string>("");
  const [caseFilesNames, setCaseFilesNames] = useState<string[]>([]);
  const [caseFilesAddresses, setCaseFilesAddresses] = useState<string[]>([]);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

        // Extract case title and description from case_information
        if (details.case_information?.caseName) {
          setCaseTitle(details.case_information.caseName);
          setEditedTitle(details.case_information.caseName);
        }
        if (details.case_information?.caseDescription) {
          setCaseDescription(details.case_information.caseDescription);
          setEditedDescription(details.case_information.caseDescription);
        }
        if (details.case_information?.files_names) {
          setCaseFilesNames(details.case_information.files_names);
        }
        if (details.case_information?.files_addresses) {
          setCaseFilesAddresses(details.case_information.files_addresses);
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

  // Notify parent when modal state changes
  useEffect(() => {
    if (onModalChange) {
      onModalChange(openModal !== null);
    }
  }, [openModal, onModalChange]);

  // Get section data by database key
  const getSectionData = (dbKey: string): SectionData => {
    return caseDetails[dbKey] || {};
  };

  // Calculate section status
  const getSectionStatus = (
    dbKey: string
  ): "complete" | "empty" => {
    const data = getSectionData(dbKey);

    // Check if there's a summary
    if (data.summary?.trim() || data.caseDescription?.trim()) {
      return "complete";
    }

    return "empty";
  };

  // Get item count for display
  const getItemCount = (dbKey: string): number => {
    const data = getSectionData(dbKey);
    // Support new format (files array) and old format (separate arrays)
    if (data.files && Array.isArray(data.files)) {
      return data.files.length;
    }
    return (data.file_addresses?.length ?? 0) || (data.file_names?.length ?? 0) || 0;
  };

  const getInitialFilesForSection = (dbKey: string): UploadedFile[] => {
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

    // Fallback to old format: separate file_names and file_addresses arrays
    const names = Array.isArray(data.file_names) ? data.file_names : [];
    const addresses = Array.isArray(data.file_addresses) ? data.file_addresses : [];
    const existingFiles = Array.isArray(data.files) ? data.files : [];

    const results: UploadedFile[] = [];

    names.forEach((rawName, index) => {
      if (typeof rawName !== "string") {
        return;
      }

      const name = rawName.trim();
      if (!name) {
        return;
      }

      const existing = existingFiles[index];

      const id =
        typeof existing === "object" && existing !== null && "id" in existing
          ? String((existing as { id: unknown }).id)
          : `${dbKey}-${index}-${name}`;

      const sizeValue =
        typeof existing === "object" && existing !== null && "size" in existing
          ? Number((existing as { size: unknown }).size)
          : undefined;

      const resolvedSize =
        typeof sizeValue === "number" && Number.isFinite(sizeValue) ? sizeValue : undefined;

      const typeValue =
        typeof existing === "object" && existing !== null && "type" in existing
          ? String((existing as { type: unknown }).type)
          : undefined;

      const uploadedAtValue =
        typeof existing === "object" && existing !== null && "uploadedAt" in existing
          ? (existing as { uploadedAt: unknown }).uploadedAt
          : undefined;

      const uploadedAt =
        uploadedAtValue instanceof Date
          ? uploadedAtValue
          : typeof uploadedAtValue === "string"
            ? new Date(uploadedAtValue)
            : undefined;

      results.push({
        id,
        name,
        size: resolvedSize,
        type: typeValue,
        uploadedAt,
        address: addresses[index],
      });
    });

    return results;
  };

  const getCompletedSectionsCount = () => {
    return SECTION_KEYS.filter(
      (key) => getSectionStatus(key) === "complete"
    ).length;
  };

  // Notify parent of completion percentage and save to database
  useEffect(() => {
    const completedCount = getCompletedSectionsCount();
    const percentage = Math.round((completedCount / SECTION_KEYS.length) * 100);

    if (onCompletionChange) {
      onCompletionChange(percentage);
    }

    // Save completion status to database
    const saveCompletionStatus = async () => {
      if (!caseId) return;

      try {
        await fetch(`/api/cases/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId,
            field: "case_details",
            value: {
              _completion_status: percentage,
            },
          }),
        });
      } catch (error) {
        console.error("Failed to save completion status:", error);
      }
    };

    saveCompletionStatus();
  }, [caseDetails, onCompletionChange, caseId]);

  const getModalContent = (dbKey: string) => {
    const transKey = DB_KEY_TO_TRANS_KEY[dbKey];

    // Fallback descriptions if translation fails or key missing
    const description = t(`${transKey}Desc`) || "Upload relevant documents for this section";
    const title = t(transKey) || "Upload Documents";

    return {
      title: title,
      description: description,
      icon: SECTION_ICONS[dbKey] || "📄",
    };
  };

  const handleEditHeader = () => {
    setEditedTitle(caseTitle);
    setEditedDescription(caseDescription);
    setIsEditingHeader(true);
  };

  const handleSaveHeader = async (title?: string, description?: string) => {
    if (!caseId) return;

    const newTitle = title !== undefined ? title : editedTitle;
    const newDescription = description !== undefined ? description : editedDescription;

    setIsSavingHeader(true);
    try {
      const updateData = {
        ...caseDetails,
        case_information: {
          ...caseDetails.case_information,
          caseName: newTitle,
          caseDescription: newDescription,
        },
      };

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

      setCaseTitle(newTitle);
      setCaseDescription(newDescription);
      setCaseDetails(updateData);
      setIsEditingHeader(false);
    } catch (error) {
      console.error("Failed to save header:", error);
      setEditedTitle(caseTitle);
      setEditedDescription(caseDescription);
    } finally {
      setIsSavingHeader(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(caseTitle);
    setEditedDescription(caseDescription);
    setIsEditingHeader(false);
  };

  const handleSaveSectionData = async (sectionUiId: string, data: { files?: any[]; summary: string }) => {
    if (!caseId) return;

    const dbKey = UI_TO_DB_MAP[sectionUiId];
    if (!dbKey) return;

    try {
      // Get existing section data
      const existingSection = caseDetails[dbKey] || {};

      // Merge files if provided
      let mergedFiles = data.files || [];
      if (data.files && data.files.length > 0) {
        // Convert provided files to new format if needed
        const newFiles = data.files.map((file: any) => ({
          name: file.name || file.fileName,
          address: file.address,
          size: file.size,
          type: file.type,
          uploadedAt: file.uploadedAt,
        }));

        // Merge with existing files
        const existingFiles = existingSection.files || [];
        mergedFiles = [...existingFiles, ...newFiles];
      } else {
        // Keep existing files if not updating
        mergedFiles = existingSection.files || [];
      }

      const updateData = {
        ...caseDetails,
        [dbKey]: {
          ...existingSection,
          files: mergedFiles.length > 0 ? mergedFiles : undefined,
        },
      };

      // Only update if there's a summary
      if (data.summary) {
        updateData[dbKey].summary = data.summary;
        updateData[dbKey].summaryGenerated = Boolean(data.summary);
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
        throw new Error(json?.error || "Failed to update summary");
      }

      setCaseDetails(updateData);
    } catch (error) {
      console.error("Failed to save section data:", error);
      throw error;
    }
  };

  const handleDeleteFile = async (dbKey: string, fileAddress: string, fileName: string) => {
    // Ask for confirmation before deleting
    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    if (!caseId) return;

    try {
      const response = await fetch("/api/documents/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileAddress,
          section: dbKey,
          caseId,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to delete file");
      }

      // Update local case details with the updated files list
      const updatedCaseDetails = {
        ...caseDetails,
        [dbKey]: {
          ...(caseDetails[dbKey] || {}),
          files: json.data.updatedFiles,
        },
      };

      setCaseDetails(updatedCaseDetails);

      // Show success message
      alert("File deleted successfully");
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert(error instanceof Error ? error.message : "Failed to delete file");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-6 flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-ink-600 font-medium">{t("loading", { defaultMessage: "Loading case details..." })}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-6">
        <div className="flex items-start">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 mr-3">
            <svg
              className="w-6 h-6 text-primary-700"
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
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-ink-900">{t("title")}</h2>
            <p className="text-sm text-ink-600 mt-1">
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-6">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-primary-600">
                  {getCompletedSectionsCount()}
                </span>
                <span className="text-3xl font-bold text-ink-400">/</span>
                <span className="text-5xl font-bold text-ink-400">
                  {SECTION_KEYS.length}
                </span>
              </div>
              <p className="text-ink-700 font-medium">{t("sectionsCompleted")}</p>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-3">
              <div
                className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(getCompletedSectionsCount() / SECTION_KEYS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Section Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Case Information Card - Opens Modal */}
            <button
              onClick={() => setOpenModal("case-info")}
              className="bg-surface-000 border border-border-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-2">📋</span>
                  <h3 className="font-semibold text-ink-900 text-sm">
                    {t("caseInformation")}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-ink-600 mb-3 line-clamp-2">
                {t("caseInformationDesc")}
              </p>

              <div className="flex items-end justify-between pt-2">
                {caseTitle && caseDescription && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-green-600">Complete</span>
                  </div>
                )}
                <div className="text-right ml-auto">
                  <p className="text-xs text-ink-600">
                    {getItemCount("case_information")} {getItemCount("case_information") === 1 ? t("document") : t("documents")}
                  </p>
                </div>
              </div>
            </button>

            {/* Document Upload Sections */}
            {SECTION_KEYS.map((dbKey) => {
              const uiId = DB_TO_UI_MAP[dbKey];
              const status = getSectionStatus(dbKey);
              const itemCount = getItemCount(dbKey);
              if (dbKey === "case_information") {
                return null;
              }

              const transKey = DB_KEY_TO_TRANS_KEY[dbKey];

              return (
                <button
                  key={dbKey}
                  onClick={() => setOpenModal(uiId)}
                  className="bg-surface-000 border border-border-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-2">{SECTION_ICONS[dbKey]}</span>
                      <h3 className="font-semibold text-ink-900 text-sm">
                        {t(transKey)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-ink-600 mb-3 line-clamp-2">
                    {t(transKey + "Desc")}
                  </p>

                  <div className="flex items-end justify-between pt-2">
                    {status === "complete" && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-600">Complete</span>
                      </div>
                    )}
                    <div className="text-right ml-auto">
                      <p className="text-xs text-ink-600">
                        {itemCount} {itemCount === 1 ? t("document") : t("documents")}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {openModal ? (
        <FileUploadModal
          isOpen={true}
          onClose={() => setOpenModal(null)}
          title={getModalContent(UI_TO_DB_MAP[openModal] || "case_information").title}
          description={getModalContent(UI_TO_DB_MAP[openModal] || "case_information").description}
          icon={getModalContent(UI_TO_DB_MAP[openModal] || "case_information").icon}
          summaryText={getSectionData(UI_TO_DB_MAP[openModal] || "case_information")?.summary || ""}
          initialFiles={getInitialFilesForSection(UI_TO_DB_MAP[openModal] || "case_information")}
          summaryGenerated={Boolean(getSectionData(UI_TO_DB_MAP[openModal] || "case_information")?.summaryGenerated)}
          onFilesUpdate={() => { }}
          onSummaryGenerated={() => { }}
          caseId={caseId}
          sectionName={UI_TO_DB_MAP[openModal] || "case_information"}
          onSave={async (data) => {
            await handleSaveSectionData(openModal, data);
            setOpenModal(null);
          }}
          caseTitle={caseTitle}
          caseDescription={caseDescription}
          onCaseDetailsUpdate={async (title, description) => {
            await handleSaveHeader(title, description);
          }}
          isCaseInformation={openModal === "case-info"}
          onFileUploadSuccess={fetchCaseDetails}
          onDeleteFile={async (fileAddress, fileName) => {
            const dbKey = UI_TO_DB_MAP[openModal] || "case_information";
            await handleDeleteFile(dbKey, fileAddress, fileName);
          }}
        />
      ) : null}
    </div>
  );
}
