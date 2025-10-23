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
  isMarkedComplete?: boolean;
  onFilesUpdate?: (files: UploadedFile[]) => void;
  onToggleComplete?: () => void;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  initialFiles = [],
  isMarkedComplete = false,
  onFilesUpdate,
  onToggleComplete,
}: FileUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when initialFiles changes
  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

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
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    if (onFilesUpdate) {
      onFilesUpdate(updatedFiles);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-blue-100 text-sm">{description}</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
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
                Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF • Max 10
                MB
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
          {uploadedFiles.length > 0 && (
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

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-3">
          <button
            onClick={onToggleComplete}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isMarkedComplete
                ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {isMarkedComplete ? (
              <>
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
                Marked as Complete
              </>
            ) : (
              <>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mark as Complete
              </>
            )}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
