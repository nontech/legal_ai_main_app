"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CompactJurisdiction from "./CompactJurisdiction";
import CompactCaseType from "./CompactCaseType";
import CompactRole from "./CompactRole";

interface QuickAnalysisFormProps {
  initialDocuments?: File[];
  onCalculateResults?: (data: any) => void;
}

export default function QuickAnalysisForm({
  initialDocuments = [],
  onCalculateResults,
}: QuickAnalysisFormProps) {
  const router = useRouter();
  const [caseName, setCaseName] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] =
    useState<File[]>(initialDocuments);
  // Initialize with the same defaults used inside the compact components
  const [jurisdiction, setJurisdiction] = useState<any>({
    country: "United States of America",
    state: "Alabama",
    city: "Mobile",
    court: "Southern District of Alabama",
  });
  // Store the case type as its string id that API expects
  const [caseTypeId, setCaseTypeId] = useState<string>("civil");
  const [role, setRole] = useState<string>("plaintiff");

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
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

  const handleSubmit = async () => {
    // Collect all form data
    const formData = {
      caseName,
      caseDescription,
      documents: uploadedFiles,
      timestamp: new Date(),
    };

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseName,
          caseDescription,
          jurisdiction,
          case_type: caseTypeId,
          role,
          result: null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to create case result");
      }
      const createdId = json.id as string | number | undefined;

      // Store data in sessionStorage for the detailed flow to access
      sessionStorage.setItem(
        "quickAnalysisData",
        JSON.stringify({
          ...formData,
          caseResultId: createdId,
          jurisdiction,
          case_type: caseTypeId,
          role,
          result: null,
        })
      );

      // Navigate directly to results page with case ID
      router.push(`/case-analysis/detailed?step=7&caseId=${createdId}`);
    } catch (e) {
      // Fallback: still store form data so user doesn't lose progress
      sessionStorage.setItem(
        "quickAnalysisData",
        JSON.stringify(formData)
      );
      alert("Error creating case. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Sticky Header */}
      <div className="sticky top-20 z-20 bg-gray-50 pb-8">
        <div className="text-center pt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quick Case Analysis
          </h1>
          <p className="text-gray-600">
            Fill in the basic information below to get your
            preliminary analysis
          </p>
        </div>
      </div>

      {/* Scrollable Content Area - with padding bottom for fixed button */}
      <div className="max-w-6xl mx-auto px-4 pb-32 h-[calc(100vh-360px)] overflow-y-auto">
        {/* Form Sections */}
        <div className="space-y-6">
          {/* Jurisdiction */}
          <CompactJurisdiction onUpdate={setJurisdiction} />

          {/* Case Type */}
          <CompactCaseType onUpdate={(ct: any) => setCaseTypeId(ct?.id)} />

          {/* Role */}
          <CompactRole onUpdate={(r: any) => setRole(r)} />

          {/* Basic Case Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-blue-700"
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
                <h3 className="text-lg font-bold text-gray-900">
                  Step 4: Case Information
                </h3>
                <p className="text-sm text-gray-600">
                  Basic details about your case
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Document Upload - MOVED TO TOP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Case Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
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
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF •
                      Max 10 MB
                    </p>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Uploaded Files ({uploadedFiles.length})
                    </p>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <svg
                            className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0"
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
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="ml-3 text-red-600 hover:text-red-800 flex-shrink-0"
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
                    ))}
                  </div>
                )}

                {/* Auto-fills label */}
                <div className="mt-3 text-center">
                  <span className="text-xs text-blue-600 font-medium">
                    📄 Auto-fills fields below
                  </span>
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 font-semibold text-sm">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Case Title/Name */}
              <div>
                <label
                  htmlFor="caseName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Case Title/Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="caseName"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="e.g., Smith v. Johnson, State v. Anderson"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Case Description */}
              <div>
                <label
                  htmlFor="caseDescription"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Comprehensive Case Description{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="caseDescription"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Provide a detailed description of the case, including key facts, timeline of events, parties involved, and the nature of the dispute or charges. Be as specific as possible."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Include dates, locations, key events, and
                  circumstances
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Calculate Results Button at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center">
            <button
              onClick={handleSubmit}
              disabled={!caseName || !caseDescription}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center gap-3"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>Calculate Results</span>
            </button>
            {(!caseName || !caseDescription) && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Please fill in required fields to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
