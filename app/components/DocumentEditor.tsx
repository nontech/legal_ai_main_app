"use client";

import { useState } from "react";

interface DocumentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
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
    content?: string;
  };
  onSave: (updatedDoc: any) => void;
}

export default function DocumentEditor({
  isOpen,
  onClose,
  document,
  onSave,
}: DocumentEditorProps) {
  const [status, setStatus] = useState(document.status);
  const [priority, setPriority] = useState(document.priority);
  const [dueDate, setDueDate] = useState(document.dueDate || "");
  const [content, setContent] = useState(
    document.content || getDefaultTemplate(document.name)
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...document,
      status,
      priority,
      dueDate,
      content,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              title="Back"
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
            <h1 className="text-xl font-semibold text-gray-900">
              {document.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Document
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {/* Document Title (Fixed) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-2">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-gray-900">
                {document.name}
              </h2>
            </div>
          </div>

          {/* Metadata Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                <span>Edit the template below</span>
              </div>
            </div>

            {/* Notion-like Editor */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[600px] px-4 py-3 font-mono text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Start typing your document content..."
              style={{
                lineHeight: "1.8",
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            />

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>
                Fill in the bracketed fields with your case-specific
                information
              </span>
            </div>
          </div>

          {/* Upload File Option */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5"
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
    </div>
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
