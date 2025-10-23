"use client";

import { useState } from "react";
import DocumentEditor from "./DocumentEditor";

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

interface PretrialDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: {
    title: string;
    icon: string;
    description: string;
    documents: Document[];
  };
}

export default function PretrialDocumentModal({
  isOpen,
  onClose,
  phase,
}: PretrialDocumentModalProps) {
  const [editingDocument, setEditingDocument] =
    useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>(
    phase.documents
  );

  const handleSaveDocument = (updatedDoc: Document) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
    );
    setEditingDocument(null);
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: Document["status"]) => {
    const styles = {
      not_started: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Not Started",
        icon: "○",
      },
      draft: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Draft",
        icon: "✎",
      },
      in_progress: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "In Progress",
        icon: "⟳",
      },
      complete: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Complete",
        icon: "✓",
      },
      filed: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Filed",
        icon: "✓✓",
      },
    };
    const style = styles[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
      >
        <span>{style.icon}</span>
        {style.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Document["priority"]) => {
    const styles = {
      low: { bg: "bg-gray-100", text: "text-gray-600", label: "Low" },
      medium: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Medium",
      },
      high: { bg: "bg-red-100", text: "text-red-700", label: "High" },
    };
    const style = styles[priority];
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
    );
  };

  const completedCount = documents.filter(
    (d) => d.status === "complete" || d.status === "filed"
  ).length;
  const totalCount = documents.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {editingDocument && (
                <button
                  onClick={() => setEditingDocument(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  title="Back to list"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}
              <span className="text-4xl">{phase.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">
                  {editingDocument
                    ? editingDocument.name
                    : phase.title}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {editingDocument
                    ? "Edit document details and content"
                    : phase.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
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

        {/* Conditional Content: Document List OR Editor */}
        {!editingDocument ? (
          <>
            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  Progress
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / totalCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 text-base">
                            {doc.name}
                          </h4>
                          {getStatusBadge(doc.status)}
                          {getPriorityBadge(doc.priority)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {doc.dueDate && (
                            <span className="flex items-center gap-1">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Due: {doc.dueDate}
                            </span>
                          )}
                          {doc.lastModified && (
                            <span className="flex items-center gap-1">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Modified: {doc.lastModified}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {doc.status === "not_started" ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDocument(doc);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
                            Create
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDocument(doc);
                              }}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDocument(doc);
                              }}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                              View
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          /* Document Editor View */
          <InlineDocumentEditor
            document={editingDocument}
            onSave={handleSaveDocument}
            onCancel={() => setEditingDocument(null)}
          />
        )}
      </div>
    </div>
  );
}

/* Inline Editor Component */
function InlineDocumentEditor({
  document,
  onSave,
  onCancel,
}: {
  document: Document;
  onSave: (doc: Document) => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState(document.status);
  const [priority, setPriority] = useState(document.priority);
  const [dueDate, setDueDate] = useState(document.dueDate || "");
  const [content, setContent] = useState(
    document.content || getDefaultTemplate(document.name)
  );

  const handleSave = () => {
    onSave({
      ...document,
      status,
      priority,
      dueDate,
      content,
      lastModified: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <>
      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Metadata Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Document Properties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="not_started">Not Started</option>
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="complete">Complete</option>
                  <option value="filed">Filed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Document Content Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Document Content
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Fill in the bracketed fields</span>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] px-4 py-3 font-mono text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Start typing your document content..."
              style={{
                lineHeight: "1.8",
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            />
          </div>

          {/* Upload File Option */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Upload Existing Document
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Already have this document? Upload it to replace the
                  template.
                </p>
                <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center gap-2">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Save/Cancel */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Document
        </button>
      </div>
    </>
  );
}

// Helper function to get default templates
function getDefaultTemplate(documentName: string): string {
  const templates: Record<string, string> = {
    "Grand Jury Indictment": `IN THE [COURT NAME]
[JURISDICTION]

THE PEOPLE OF [STATE] v. [DEFENDANT NAME]
Case No. [CASE NUMBER]

INDICTMENT

The Grand Jury of [County] County, [State], charges:

COUNT I – [CHARGE]
On or about [DATE], in [LOCATION], [DEFENDANT NAME] did [DESCRIPTION OF ALLEGED CRIME], in violation of [STATUTE SECTION].

COUNT II – [ADDITIONAL CHARGES IF APPLICABLE]

Signed: _____________________
Foreperson of the Grand Jury

Date: _____________________`,

    "Criminal Complaint/Information": `IN THE [COURT NAME]
[JURISDICTION]

THE PEOPLE OF [STATE] v. [DEFENDANT NAME]
Case No. [CASE NUMBER]

CRIMINAL COMPLAINT/INFORMATION

[COMPLAINANT NAME], being duly sworn, states:

COUNT I – [CHARGE]
On or about [DATE], at approximately [TIME], in [LOCATION], the defendant, [DEFENDANT NAME], did [DESCRIPTION OF ALLEGED CRIME], in violation of [STATUTE SECTION].

COUNT II – [ADDITIONAL CHARGES IF APPLICABLE]

This information is based on [DESCRIBE SOURCE: personal knowledge, investigation, witness statements, etc.].

_____________________
Signature of Complainant

Sworn to and subscribed before me this [DATE].

_____________________
[JUDICIAL OFFICER]`,

    "Civil Complaint": `IN THE [COURT NAME]
[JURISDICTION]

[PLAINTIFF NAME], Plaintiff
v.
[DEFENDANT NAME], Defendant

Case No. [CASE NUMBER]

COMPLAINT FOR [TYPE OF ACTION]

COMES NOW the Plaintiff, [PLAINTIFF NAME], and for their Complaint against Defendant states:

PARTIES
1. Plaintiff is [description of plaintiff].
2. Defendant is [description of defendant].

JURISDICTION AND VENUE
3. This Court has jurisdiction over this matter pursuant to [cite statute/rule].
4. Venue is proper in this Court because [state reason].

FACTUAL ALLEGATIONS
5. On or about [DATE], [describe relevant facts].
6. [Continue with numbered allegations].

CAUSES OF ACTION

COUNT I – [FIRST CAUSE OF ACTION]
[Incorporate prior allegations and state specific claims]

PRAYER FOR RELIEF
WHEREFORE, Plaintiff respectfully requests:
a. [Specific relief requested]
b. Costs and attorney's fees
c. Such other relief as the Court deems just and proper

_____________________
[ATTORNEY NAME]
Attorney for Plaintiff`,
  };

  return (
    templates[documentName] ||
    `[Document Template]

Please enter the content for ${documentName}.

This is a placeholder template. Replace this text with the appropriate legal document content.`
  );
}
