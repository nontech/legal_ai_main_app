"use client";

import { useState, useEffect } from "react";
import FileUploadModal from "./FileUploadModal";

interface CaseDetailsSectionProps {
  onModalChange?: (isOpen: boolean) => void;
  caseId?: string;
  onCompletionChange?: (percentage: number) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface SectionData {
  files: UploadedFile[];
  summaryGenerated: boolean;
}

export default function CaseDetailsSection({
  onModalChange,
  caseId,
  onCompletionChange,
}: CaseDetailsSectionProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [caseTitle, setCaseTitle] = useState<string>("");
  const [caseDescription, setCaseDescription] = useState<string>("");
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // Initialize section data with empty files
  const [sectionData, setSectionData] = useState<
    Record<string, SectionData>
  >({
    "basic-info": {
      files: [],
      summaryGenerated: false,
    },
    evidence: {
      files: [],
      summaryGenerated: false,
    },
    witnesses: {
      files: [],
      summaryGenerated: false,
    },
    precedents: {
      files: [],
      summaryGenerated: false,
    },
    police: {
      files: [],
      summaryGenerated: false,
    },
    challenges: {
      files: [],
      summaryGenerated: false,
    },
  });

  // Fetch case details from database if caseId is provided
  useEffect(() => {
    console.log("caseId", caseId);
    if (caseId) {
      const fetchCaseDetails = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();
          console.log("json", json);
          if (json.ok && json.data) {
            // Load case title and description from basic-info
            if (json.data.case_details?.["case_information"]?.caseName) {
              console.log("caseName", json.data.case_details["case_information"].caseName);
              setCaseTitle(json.data.case_details["case_information"].caseName);
              setEditedTitle(json.data.case_details["case_information"].caseName);
            }
            if (json.data.case_details?.["case_information"]?.caseDescription) {
              setCaseDescription(json.data.case_details["case_information"].caseDescription);
              setEditedDescription(json.data.case_details["case_information"].caseDescription);
            }

            // Load section details
            if (json.data.case_details && typeof json.data.case_details === "object" && !Array.isArray(json.data.case_details)) {
              setSectionData(prevData => ({
                ...prevData,
                ...json.data.case_details
              }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch case details:", error);
        }
      };

      fetchCaseDetails();
    }
  }, [caseId]);

  // Notify parent when modal state changes
  useEffect(() => {
    if (onModalChange) {
      onModalChange(openModal !== null);
    }
  }, [openModal, onModalChange]);

  // Calculate status based on files and summaryGenerated
  const getSectionStatus = (
    sectionId: string
  ): "complete" | "in_progress" | "empty" => {
    const data = sectionData[sectionId] as any;
    if (!data) return "empty";

    // Special handling for basic-info: complete if it has caseName and caseDescription
    if (sectionId === "basic-info") {
      if (data.caseName && data.caseName.trim() && data.caseDescription && data.caseDescription.trim()) {
        return "complete";
      }
      return "empty";
    }

    // If there's a summary text, it's complete
    if (data.summary && data.summary.trim()) {
      return "complete";
    }

    // If there are files and summary was generated, it's complete
    if (data.files && data.files.length > 0 && data.summaryGenerated) {
      return "complete";
    }

    // If there are files but no summary, it's in progress
    if (data.files && data.files.length > 0) {
      return "in_progress";
    }

    return "empty";
  };

  const sections = [
    {
      id: "basic-info",
      title: "Basic Case Information",
      itemLabel: "fields completed",
      icon: "📋",
    },
    {
      id: "evidence",
      title: "Evidence & Supporting Materials",
      itemLabel: "documents",
      icon: "📎",
    },
    {
      id: "witnesses",
      title: "Key Witnesses & Testimony",
      itemLabel: "witnesses",
      icon: "👥",
    },
    {
      id: "precedents",
      title: "Relevant Legal Precedents",
      itemLabel: "cases",
      icon: "⚖️",
    },
    {
      id: "police",
      title: "Police Report",
      itemLabel: "document",
      icon: "🚔",
    },
    {
      id: "challenges",
      title: "Potential Challenges & Weaknesses",
      itemLabel: "items",
      icon: "⚠️",
    },
  ];

  const getCompletedSectionsCount = () => {
    return sections.filter(
      (section) => getSectionStatus(section.id) === "complete"
    ).length;
  };

  // Notify parent of completion percentage whenever section data changes
  useEffect(() => {
    if (onCompletionChange) {
      const completedCount = getCompletedSectionsCount();
      const percentage = Math.round((completedCount / sections.length) * 100);
      onCompletionChange(percentage);
    }
  }, [sectionData]);

  const handleFilesUpdate = (
    sectionId: string,
    files: UploadedFile[]
  ) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        files,
      },
    }));
  };

  const handleSummaryGenerated = (sectionId: string) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        summaryGenerated: true,
      },
    }));
  };

  const getStatusBadge = (
    status: "complete" | "in_progress" | "empty"
  ) => {
    switch (status) {
      case "complete":
        return {
          icon: "✓",
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Complete",
        };
      case "in_progress":
        return {
          icon: "◐",
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "In Progress",
        };
      case "empty":
        return {
          icon: "○",
          bg: "bg-gray-100",
          text: "text-gray-500",
          label: "Empty",
        };
    }
  };

  const getModalContent = (sectionId: string) => {
    switch (sectionId) {
      case "basic-info":
        return {
          title: "Case Documents",
          description:
            "Upload case briefs, complaints, legal memos, and related documents",
          icon: "📋",
        };
      case "evidence":
        return {
          title: "Evidence Files",
          description:
            "Upload photos, forensic reports, expert reports, contracts, and supporting documents",
          icon: "📎",
        };
      case "witnesses":
        return {
          title: "Witness Documents",
          description:
            "Upload witness statements, depositions, expert reports, and testimony transcripts",
          icon: "👥",
        };
      case "precedents":
        return {
          title: "Legal Precedent Documents",
          description:
            "Upload case law PDFs, legal research documents, and precedent analysis",
          icon: "⚖️",
        };
      case "police":
        return {
          title: "Police Report Files",
          description:
            "Upload official police reports, incident photos, body cam transcripts, and related documentation",
          icon: "🚔",
        };
      case "challenges":
        return {
          title: "Challenge Analysis Documents",
          description:
            "Upload opposing counsel briefs, unfavorable evidence, and weakness analysis documents",
          icon: "⚠️",
        };
      default:
        return {
          title: "Upload Documents",
          description: "Upload relevant documents for this section",
          icon: "📄",
        };
    }
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
      const completedCount = sections.filter(
        (section) => getSectionStatus(section.id) === "complete"
      ).length;
      const completionPercentage = Math.round((completedCount / sections.length) * 100);

      const res = await fetch("/api/cases/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          field: "case_details",
          value: {
            ...sectionData,
            "basic-info": {
              ...sectionData["basic-info"],
              caseName: newTitle,
              caseDescription: newDescription,
            },
            _completion_status: completionPercentage,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to save");
      }

      setCaseTitle(newTitle);
      setCaseDescription(newDescription);
      setIsEditingHeader(false);
    } catch (error) {
      console.error("Failed to save header:", error);
      // Revert changes
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

  const handleSaveSectionData = async (sectionId: string, data: { files: any[]; summary: string }) => {
    if (!caseId) return;

    try {
      // Update local state first to calculate percentage based on updated data
      const updatedSectionData = {
        ...sectionData,
        "basic-info": {
          ...sectionData["basic-info"],
          caseName: caseTitle,
          caseDescription: caseDescription,
        },
        [sectionId]: {
          files: data.files,
          summaryGenerated: data.summary ? true : false,
          summary: data.summary,
        },
      };

      // Calculate completion percentage based on updated state
      const completedCount = sections.filter((section) => {
        const sectionData = updatedSectionData[section.id] as any;
        if (!sectionData) return false;

        // Special handling for basic-info
        if (section.id === "basic-info") {
          return sectionData.caseName && sectionData.caseName.trim() && sectionData.caseDescription && sectionData.caseDescription.trim();
        }

        // If there's a summary text, it's complete
        if (sectionData.summary && sectionData.summary.trim()) {
          return true;
        }

        // If there are files and summary was generated, it's complete
        if (sectionData.files && sectionData.files.length > 0 && sectionData.summaryGenerated) {
          return true;
        }

        return false;
      }).length;

      const completionPercentage = Math.round((completedCount / sections.length) * 100);

      const res = await fetch("/api/cases/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          field: "case_details",
          value: {
            ...updatedSectionData,
            _completion_status: completionPercentage,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to save section");
      }

      // Update local state
      setSectionData((prev) => ({
        ...prev,
        [sectionId]: {
          files: data.files,
          summaryGenerated: data.summary ? true : false,
          summary: data.summary,
        },
      }));
    } catch (error) {
      console.error("Failed to save section data:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isEditingHeader ? (
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={4}
                placeholder="Enter case description"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveHeader()}
                disabled={isSavingHeader}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSavingHeader ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </>
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSavingHeader}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3 flex-shrink-0">
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Case Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and organize all case information and supporting documents
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overall Progress Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-blue-600">
                  {getCompletedSectionsCount()}
                </span>
                <span className="text-3xl font-bold text-gray-400">
                  /
                </span>
                <span className="text-5xl font-bold text-gray-400">
                  {sections.length}
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                Sections Completed
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(getCompletedSectionsCount() / sections.length) *
                    100
                    }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Section Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => {
              const status = getSectionStatus(section.id);
              const badge = getStatusBadge(status);
              const itemCount =
                sectionData[section.id]?.files.length || 0;
              return (
                <button
                  key={section.id}
                  onClick={() => setOpenModal(section.id)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-2">
                        {section.icon}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-end justify-between pt-8">
                    {status === "complete" && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-600">Completed</span>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {itemCount > 0 ? itemCount : "0"}{" "}
                        {itemCount === 1 ? "document" : "documents"}
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
      {openModal && (
        <FileUploadModal
          isOpen={true}
          onClose={() => setOpenModal(null)}
          title={getModalContent(openModal).title}
          description={getModalContent(openModal).description}
          icon={getModalContent(openModal).icon}
          initialFiles={sectionData[openModal]?.files || []}
          summaryGenerated={
            sectionData[openModal]?.summaryGenerated || false
          }
          summaryText={
            (sectionData[openModal] as any)?.summary || ""
          }
          onFilesUpdate={(files) =>
            handleFilesUpdate(openModal, files)
          }
          onSummaryGenerated={() => handleSummaryGenerated(openModal)}
          caseId={caseId}
          sectionId={openModal}
          onSave={async (data) => {
            await handleSaveSectionData(openModal, data);
          }}
          caseTitle={caseTitle}
          caseDescription={caseDescription}
          onCaseDetailsUpdate={async (title, description) => {
            await handleSaveHeader(title, description);
          }}
        />
      )}
    </div>
  );
}
