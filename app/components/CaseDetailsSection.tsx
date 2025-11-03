"use client";

import { useState, useEffect } from "react";
import FileUploadModal from "./FileUploadModal";
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
  "key_witnesses_and_testimony": "witnesses",
  "relevant_legal_precedents": "precedents",
  "police_report": "police",
  "potential_challenges_and_weaknesses": "challenges",
};

const UI_TO_DB_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DB_TO_UI_MAP).map(([db, ui]) => [ui, db])
);

const SECTION_CONFIG = [
  {
    uiId: "case-info",
    dbKey: "case_information",
    title: "Case Information",
    itemLabel: "documents",
    icon: "📋",
  },
  {
    uiId: "evidence",
    dbKey: "evidence_and_supporting_materials",
    title: "Evidence & Supporting Materials",
    itemLabel: "documents",
    icon: "📎",
  },
  {
    uiId: "witnesses",
    dbKey: "key_witnesses_and_testimony",
    title: "Key Witnesses & Testimony",
    itemLabel: "documents",
    icon: "👥",
  },
  {
    uiId: "precedents",
    dbKey: "relevant_legal_precedents",
    title: "Relevant Legal Precedents",
    itemLabel: "documents",
    icon: "⚖️",
  },
  {
    uiId: "police",
    dbKey: "police_report",
    title: "Police Report",
    itemLabel: "documents",
    icon: "🚔",
  },
  {
    uiId: "challenges",
    dbKey: "potential_challenges_and_weaknesses",
    title: "Potential Challenges & Weaknesses",
    itemLabel: "documents",
    icon: "⚠️",
  },
];

export default function CaseDetailsSection({
  onModalChange,
  caseId,
  onCompletionChange,
}: CaseDetailsSectionProps) {
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
  const [isMarkdownPreviewTitle, setIsMarkdownPreviewTitle] = useState(false);
  const [isMarkdownPreviewDescription, setIsMarkdownPreviewDescription] = useState(false);

  // Store all case details keyed by database keys
  const [caseDetails, setCaseDetails] = useState<Record<string, SectionData>>({});

  // Fetch case details from database if caseId is provided
  useEffect(() => {
    if (!caseId) {
      setIsLoading(false);
      return;
    }

    const fetchCaseDetails = async () => {
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
    };

    fetchCaseDetails();
  }, [caseId]);

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
    return (data.file_addresses?.length ?? 0) || (data.file_names?.length ?? 0) || 0;
  };

  const getInitialFilesForSection = (dbKey: string): UploadedFile[] => {
    const data = getSectionData(dbKey);
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
    return SECTION_CONFIG.filter(
      (section) => getSectionStatus(section.dbKey) === "complete"
    ).length;
  };

  // Notify parent of completion percentage
  useEffect(() => {
    if (onCompletionChange) {
      const completedCount = getCompletedSectionsCount();
      const percentage = Math.round((completedCount / SECTION_CONFIG.length) * 100);
      onCompletionChange(percentage);
    }
  }, [caseDetails, onCompletionChange]);

  const getModalContent = (dbKey: string) => {
    const config = SECTION_CONFIG.find((s) => s.dbKey === dbKey);
    const descriptions: Record<string, string> = {
      case_information: "Add or edit the case title and comprehensive description",
      evidence_and_supporting_materials: "Upload photos, forensic reports, expert reports, contracts, and supporting documents",
      key_witnesses_and_testimony: "Upload witness statements, depositions, expert reports, and testimony transcripts",
      relevant_legal_precedents: "Upload case law PDFs, legal research documents, and precedent analysis",
      police_report: "Upload official police reports, incident photos, body cam transcripts, and related documentation",
      potential_challenges_and_weaknesses: "Upload opposing counsel briefs, unfavorable evidence, and weakness analysis documents",
    };

    return {
      title: config?.title || "Upload Documents",
      description: descriptions[dbKey] || "Upload relevant documents for this section",
      icon: config?.icon || "📄",
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
      // Files are now uploaded individually through FileUploadModal
      // Just handle summary update here
      const updateData = {
        ...caseDetails,
        [dbKey]: {
          ...caseDetails[dbKey],
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600 font-medium">Loading case details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 mr-3">
            <svg
              className="w-6 h-6 text-blue-700"
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
            <h2 className="text-2xl font-bold text-gray-900">Case Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and organize all case information and supporting documents
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-blue-600">
                  {getCompletedSectionsCount()}
                </span>
                <span className="text-3xl font-bold text-gray-400">/</span>
                <span className="text-5xl font-bold text-gray-400">
                  {SECTION_CONFIG.length}
                </span>
              </div>
              <p className="text-gray-700 font-medium">Sections Completed</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(getCompletedSectionsCount() / SECTION_CONFIG.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Section Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Case Information Card - Opens Modal */}
            <button
              onClick={() => setOpenModal("case-info")}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-2">📋</span>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Case Information
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                Add the case title and comprehensive description with supporting documents
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
                  <p className="text-xs text-gray-600">
                    {getItemCount("case_information")} {getItemCount("case_information") === 1 ? "document" : "documents"}
                  </p>
                </div>
              </div>
            </button>

            {/* Document Upload Sections */}
            {SECTION_CONFIG.map((section) => {
              const status = getSectionStatus(section.dbKey);
              const itemCount = getItemCount(section.dbKey);
              if (section.dbKey === "case_information") {
                return null;
              }

              // Get section-specific description
              const sectionDescriptions: Record<string, string> = {
                "evidence_and_supporting_materials": "Upload photos, forensic reports, expert reports, and supporting documents",
                "key_witnesses_and_testimony": "Upload witness statements, depositions, and testimony transcripts",
                "relevant_legal_precedents": "Upload case law PDFs and legal research documents",
                "police_report": "Upload official police reports and incident documentation",
                "potential_challenges_and_weaknesses": "Upload opposing counsel briefs and weakness analysis",
              };

              return (
                <button
                  key={section.dbKey}
                  onClick={() => setOpenModal(section.uiId)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-2">{section.icon}</span>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {sectionDescriptions[section.dbKey] || "Upload documents for this section"}
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
                      <p className="text-xs text-gray-600">
                        {itemCount} {itemCount === 1 ? "document" : "documents"}
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
        />
      ) : null}
    </div>
  );
}
