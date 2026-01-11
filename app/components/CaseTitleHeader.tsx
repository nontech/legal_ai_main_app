"use client";

import { useState, useEffect } from "react";

interface CaseTitleHeaderProps {
  caseId: string;
  initialTitle: string;
  isOwner: boolean;
  onTitleUpdate?: (newTitle: string) => void;
}

export default function CaseTitleHeader({
  caseId,
  initialTitle,
  isOwner,
  onTitleUpdate,
}: CaseTitleHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  // Update title when initialTitle changes (after async fetch)
  useEffect(() => {
    setTitle(initialTitle);
    setTempTitle(initialTitle);
  }, [initialTitle]);

  const handleEdit = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!tempTitle.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/title`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: tempTitle.trim() }),
      });

      if (res.ok) {
        setTitle(tempTitle.trim());
        setIsEditing(false);
        onTitleUpdate?.(tempTitle.trim());
      } else {
        alert("Failed to update case title");
      }
    } catch (error) {
      console.error("Error updating title:", error);
      alert("Failed to update case title");
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if we're in loading state (no title and initialTitle is empty)
  const isLoading = !title && !initialTitle;
  const displayTitle = isLoading ? "Loading Title..." : (title || "Untitled Case");

  return (
    <div className="w-full mt-16 sm:mt-20">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex gap-6">
          {/* Match the main content container structure */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto w-full">
              <div className="mt-6 rounded-xl bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-black/5">
                <div className="px-6 sm:px-8 py-5 flex items-center justify-center gap-4 relative">
                  {/* Title Display/Edit */}
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full max-w-2xl">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg sm:text-xl font-semibold bg-white text-center"
                        placeholder="Enter case title"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave();
                          if (e.key === "Escape") handleCancel();
                        }}
                      />
                      <button
                        onClick={handleSave}
                        disabled={isSaving || !tempTitle.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 relative w-full">
                      <h1 className={`text-xl sm:text-2xl font-bold text-gray-900 ${isLoading ? 'text-gray-400' : ''}`}>
                        {displayTitle}
                      </h1>
                      {isOwner && !isLoading && (
                        <button
                          onClick={handleEdit}
                          className="absolute right-0 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit case title"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Spacer for sidebar on desktop - matches sidebar width */}
          <div className="hidden md:block w-64 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
