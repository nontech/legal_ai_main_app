"use client";

import { useState } from "react";
import PretrialDocumentModal from "./PretrialDocumentModal";

interface Document {
  id: string;
  name: string;
  status:
    | "not_started"
    | "draft"
    | "in_progress"
    | "complete"
    | "filed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  lastModified?: string;
  content?: string;
}

interface Phase {
  id: string;
  title: string;
  icon: string;
  description: string;
  documents: Document[];
  color: string;
}

export default function PretrialProcess() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(
    null
  );

  const phases: Phase[] = [
    {
      id: "initial-filings",
      title: "Initial Filings",
      icon: "📋",
      description:
        "Criminal: Indictment (grand jury) or Information/Complaint • Civil: Complaint filing and Answer/Motion to Dismiss",
      color: "blue",
      documents: [
        {
          id: "1",
          name: "Grand Jury Indictment",
          status: "complete",
          priority: "high",
          dueDate: "2025-11-15",
          lastModified: "2025-10-20",
        },
        {
          id: "2",
          name: "Criminal Complaint/Information",
          status: "draft",
          priority: "medium",
          dueDate: "2025-11-20",
        },
        {
          id: "3",
          name: "Civil Complaint",
          status: "not_started",
          priority: "medium",
        },
        {
          id: "4",
          name: "Answer or Motion to Dismiss",
          status: "not_started",
          priority: "high",
        },
      ],
    },
    {
      id: "discovery",
      title: "Discovery Phase",
      icon: "🔍",
      description:
        "Interrogatories, Document Production, Depositions • Brady Material (criminal cases) • Expert witness discovery",
      color: "purple",
      documents: [
        {
          id: "5",
          name: "Interrogatories",
          status: "in_progress",
          priority: "high",
          dueDate: "2025-11-25",
        },
        {
          id: "6",
          name: "Request for Production of Documents",
          status: "complete",
          priority: "medium",
          lastModified: "2025-10-18",
        },
        {
          id: "7",
          name: "Notice of Deposition",
          status: "draft",
          priority: "medium",
          dueDate: "2025-12-01",
        },
        {
          id: "8",
          name: "Brady Material Disclosure",
          status: "not_started",
          priority: "high",
        },
      ],
    },
    {
      id: "pretrial-motions",
      title: "Pretrial Motions",
      icon: "⚖️",
      description:
        "Motion to Suppress, Dismiss, Change Venue • Motion in Limine, Summary Judgment • Severance and Speedy Trial motions",
      color: "indigo",
      documents: [
        {
          id: "9",
          name: "Motion to Suppress Evidence",
          status: "draft",
          priority: "high",
          dueDate: "2025-12-05",
        },
        {
          id: "10",
          name: "Motion to Dismiss Criminal Charges",
          status: "not_started",
          priority: "high",
        },
        {
          id: "11",
          name: "Motion for Change of Venue",
          status: "not_started",
          priority: "low",
        },
        {
          id: "12",
          name: "Motion for Severance",
          status: "not_started",
          priority: "medium",
        },
        {
          id: "13",
          name: "Motion in Limine",
          status: "not_started",
          priority: "medium",
          dueDate: "2025-12-10",
        },
        {
          id: "14",
          name: "Motion for Speedy Trial",
          status: "not_started",
          priority: "low",
        },
        {
          id: "15",
          name: "Motion to Dismiss (Civil)",
          status: "not_started",
          priority: "high",
        },
        {
          id: "16",
          name: "Motion for Summary Judgment",
          status: "not_started",
          priority: "high",
        },
        {
          id: "17",
          name: "Motion to Compel Discovery",
          status: "not_started",
          priority: "medium",
        },
      ],
    },
    {
      id: "settlement",
      title: "Settlement or Plea Negotiations",
      icon: "🤝",
      description:
        "Plea Bargain negotiations (criminal) • Settlement conferences and mediation (civil)",
      color: "green",
      documents: [
        {
          id: "18",
          name: "Plea Agreement",
          status: "not_started",
          priority: "medium",
        },
        {
          id: "19",
          name: "Settlement Agreement",
          status: "not_started",
          priority: "medium",
        },
      ],
    },
    {
      id: "pretrial-conference",
      title: "Final Pretrial Conference",
      icon: "📅",
      description:
        "Finalize witness and exhibit lists • Jury instructions and trial logistics",
      color: "orange",
      documents: [
        {
          id: "20",
          name: "Final Pretrial Conference Order",
          status: "not_started",
          priority: "high",
          dueDate: "2025-12-15",
        },
      ],
    },
    {
      id: "trial-readiness",
      title: "Trial Readiness / Setting",
      icon: "🎯",
      description:
        "Final court orders on evidence admissibility • Trial date confirmation and jury selection",
      color: "red",
      documents: [
        {
          id: "21",
          name: "Trial Readiness Order",
          status: "not_started",
          priority: "high",
          dueDate: "2025-12-20",
        },
      ],
    },
  ];

  const getPhaseProgress = (phase: Phase) => {
    const total = phase.documents.length;
    const completed = phase.documents.filter(
      (d) => d.status === "complete" || d.status === "filed"
    ).length;
    return {
      completed,
      total,
      percentage: (completed / total) * 100,
    };
  };

  const getOverallProgress = () => {
    const allDocs = phases.flatMap((p) => p.documents);
    const completed = allDocs.filter(
      (d) => d.status === "complete" || d.status === "filed"
    ).length;
    return {
      completed,
      total: allDocs.length,
      percentage: (completed / allDocs.length) * 100,
    };
  };

  const overallProgress = getOverallProgress();
  const currentPhase = phases.find((p) => p.id === selectedPhase);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pretrial Process & Motions
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Manage all pretrial procedures, discovery, motions, and
            case preparation documents
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Overall Progress
            </h3>
            <span className="text-2xl font-bold text-blue-600">
              {overallProgress.completed}/{overallProgress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {overallProgress.completed} documents completed out of{" "}
            {overallProgress.total} total
          </p>
        </div>
      </div>

      {/* Phase Cards Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => {
            const progress = getPhaseProgress(phase);
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{phase.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {phase.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${progress.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {currentPhase && (
        <PretrialDocumentModal
          isOpen={selectedPhase !== null}
          onClose={() => setSelectedPhase(null)}
          phase={currentPhase}
        />
      )}
    </div>
  );
}
