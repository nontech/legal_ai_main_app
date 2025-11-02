"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface DocumentItem {
  name: string;
  address?: string;
  category: string;
  categoryIcon: string;
}

interface CaseItem {
  id: string;
  case_name: string;
  documents: DocumentItem[];
}

const SECTION_CONFIG: Record<string, { title: string; icon: string }> = {
  case_information: { title: "Case Information", icon: "📋" },
  evidence_and_supporting_materials: { title: "Evidence & Materials", icon: "🔍" },
  relevant_legal_precedents: { title: "Legal Precedents", icon: "⚖️" },
  key_witnesses_and_testimony: { title: "Witness & Testimony", icon: "👤" },
  police_report: { title: "Police Report", icon: "🚔" },
  potential_challenges_and_weaknesses: { title: "Challenges & Weaknesses", icon: "⚠️" },
};

export default function DocumentsLibrary() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cases");
      const data = await response.json();

      if (!data.ok) {
        setError(data.error || "Failed to load cases");
        return;
      }

      // Transform cases data to include documents
      const casesWithDocs: CaseItem[] = data.cases
        .map((dbCase: any) => {
          const caseDetails = dbCase.case_details || {};
          const caseInformation = caseDetails.case_information || {};
          const documents: DocumentItem[] = [];

          // Collect all documents from all sections
          Object.entries(SECTION_CONFIG).forEach(([dbKey, config]) => {
            const sectionData = caseDetails[dbKey] || {};
            const fileNames = sectionData.file_names || [];
            const fileAddresses = sectionData.file_addresses || [];

            fileNames.forEach((name: string, idx: number) => {
              if (name && name.trim()) {
                documents.push({
                  name,
                  address: fileAddresses[idx],
                  category: config.title,
                  categoryIcon: config.icon,
                });
              }
            });
          });

          return {
            id: dbCase.id,
            case_name: caseInformation.caseName || "Untitled Case",
            documents,
          };
        })
        .filter((c: CaseItem) => c.documents.length > 0);

      setCases(casesWithDocs);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (address: string, fileName: string) => {
    if (address) {
      const link = document.createElement("a");
      link.href = address;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents Library</h1>
          <p className="text-gray-600">All documents from your cases</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchCases}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && cases.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <p className="text-lg text-blue-900">No documents found. Upload documents to get started!</p>
          </div>
        )}

        {/* Cases and Documents */}
        <div className="space-y-8">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Case Title */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">{caseItem.case_name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {caseItem.documents.length} document{caseItem.documents.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Documents List */}
              <div className="divide-y divide-gray-200">
                {caseItem.documents.map((doc, idx) => (
                  <div key={idx} className="px-6 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg">{doc.categoryIcon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.category}</p>
                      </div>
                    </div>
                    {doc.address && (
                      <button
                        onClick={() => handleDownload(doc.address!, doc.name)}
                        className="ml-3 p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Download"
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
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
