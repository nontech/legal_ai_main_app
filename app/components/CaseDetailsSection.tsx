"use client";

import { useState, useEffect } from "react";
import FileUploadModal from "./FileUploadModal";

interface CaseDetailsSectionProps {
  onModalChange?: (isOpen: boolean) => void;
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
}: CaseDetailsSectionProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  // Initialize section data with fake files based on the counts
  const [sectionData, setSectionData] = useState<
    Record<string, SectionData>
  >({
    "basic-info": {
      files: Array.from({ length: 8 }, (_, i) => ({
        id: `basic-${i + 1}`,
        name: `Case_Brief_${i + 1}.pdf`,
        size: Math.floor(Math.random() * 5000000) + 100000,
        type: "application/pdf",
        uploadedAt: new Date(
          Date.now() - Math.random() * 10000000000
        ),
      })),
      summaryGenerated: true,
    },
    evidence: {
      files: Array.from({ length: 5 }, (_, i) => ({
        id: `evidence-${i + 1}`,
        name: `Evidence_Document_${i + 1}.pdf`,
        size: Math.floor(Math.random() * 5000000) + 100000,
        type: "application/pdf",
        uploadedAt: new Date(
          Date.now() - Math.random() * 10000000000
        ),
      })),
      summaryGenerated: true,
    },
    witnesses: {
      files: Array.from({ length: 3 }, (_, i) => ({
        id: `witness-${i + 1}`,
        name: `Witness_Statement_${i + 1}.pdf`,
        size: Math.floor(Math.random() * 5000000) + 100000,
        type: "application/pdf",
        uploadedAt: new Date(
          Date.now() - Math.random() * 10000000000
        ),
      })),
      summaryGenerated: false,
    },
    precedents: {
      files: Array.from({ length: 7 }, (_, i) => ({
        id: `precedent-${i + 1}`,
        name: `Legal_Case_${i + 1}.pdf`,
        size: Math.floor(Math.random() * 5000000) + 100000,
        type: "application/pdf",
        uploadedAt: new Date(
          Date.now() - Math.random() * 10000000000
        ),
      })),
      summaryGenerated: true,
    },
    police: {
      files: Array.from({ length: 1 }, (_, i) => ({
        id: `police-${i + 1}`,
        name: `Police_Report.pdf`,
        size: Math.floor(Math.random() * 5000000) + 100000,
        type: "application/pdf",
        uploadedAt: new Date(
          Date.now() - Math.random() * 10000000000
        ),
      })),
      summaryGenerated: true,
    },
    challenges: {
      files: [],
      summaryGenerated: false,
    },
  });

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
    const data = sectionData[sectionId];
    if (!data) return "empty";

    if (data.files.length === 0) {
      return "empty";
    }

    if (data.summaryGenerated) {
      return "complete";
    }

    return "in_progress";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
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
            <p className="text-sm text-gray-600">
              Comprehensive information about your case
            </p>
          </div>
        </div>
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
                  width: `${
                    (getCompletedSectionsCount() / sections.length) *
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
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}
                    >
                      <span className="text-sm font-bold">
                        {badge.icon}
                      </span>
                      <span className="text-xs font-semibold">
                        {badge.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {itemCount > 0 ? itemCount : "No"}{" "}
                        {section.itemLabel}
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
          onFilesUpdate={(files) =>
            handleFilesUpdate(openModal, files)
          }
          onSummaryGenerated={() => handleSummaryGenerated(openModal)}
        />
      )}
    </div>
  );
}
