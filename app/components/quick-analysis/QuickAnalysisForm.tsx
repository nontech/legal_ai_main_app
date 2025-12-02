"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JurisdictionSection from "../JurisdictionSection";
import CompactCaseType from "./CompactCaseType";
import CompactRole from "./CompactRole";
import MarkdownRenderer from "../MarkdownRenderer";
import StreamingAnalysisDisplay from "../StreamingAnalysisDisplay";
import StreamingClassificationDisplay from "../StreamingClassificationDisplay";
import { Coins, Scale, Gavel, Briefcase, Heart, Anchor, Home, Building2, Globe, Users } from "lucide-react";

type DocumentCategory =
  | "case_information"
  | "evidence_and_supporting_materials"
  | "relevant_legal_precedents"
  | "key_witness_and_testimony"
  | "police_report"
  | "potential_challenges_and_weaknesses";

interface ClassifiedFile {
  file: File;
  category: DocumentCategory;
  isClassifying: boolean;
}

type RoleType = "defendant" | "plaintiff";

interface QuickAnalysisFormProps {
  initialDocuments?: File[];
  onCalculateResults?: (data: any) => void;
  uploadedMetadata?: any;
  caseInformationFiles?: File[];
  caseId?: string | null;
}

export default function QuickAnalysisForm({
  initialDocuments = [],
  onCalculateResults,
  uploadedMetadata = {},
  caseInformationFiles = [],
  caseId,
}: QuickAnalysisFormProps) {
  const router = useRouter();
  const [countryId, setCountryId] = useState<string>("");
  const [caseName, setCaseName] = useState(uploadedMetadata?.caseName || "");
  const [caseDescription, setCaseDescription] = useState(uploadedMetadata?.caseDescription || "");
  const [classifiedFiles, setClassifiedFiles] = useState<ClassifiedFile[]>(
    initialDocuments.map(file => ({
      file,
      category: "case_information" as DocumentCategory,
      isClassifying: false,
    }))
  );
  // Initialize with metadata from documents or empty
  const [jurisdiction, setJurisdiction] = useState<any>(
    uploadedMetadata?.jurisdiction || {
      country: "",
      state: "",
      city: "",
      court: "",
      country_id: "",
    }
  );
  // Store the case type as its string id that API expects
  const [caseTypeId, setCaseTypeId] = useState<string>(uploadedMetadata?.caseType?.toLowerCase() || "");
  const [role, setRole] = useState<string>(uploadedMetadata?.role?.toLowerCase() || "plaintiff" as RoleType);

  const [isMarkdownPreview, setIsMarkdownPreview] = useState(false);
  const [isStreamingOpen, setIsStreamingOpen] = useState(false);
  const [streamingCaseId, setStreamingCaseId] = useState<string | null>(null);
  const [streamingResult, setStreamingResult] = useState<any>(null);

  const categoryLabels: Record<DocumentCategory, { label: string; color: string; icon: string }> = {
    case_information: { label: "Case Information", color: "primary", icon: "📋" },
    evidence_and_supporting_materials: { label: "Evidence & Materials", color: "accent", icon: "🔍" },
    relevant_legal_precedents: { label: "Legal Precedents", color: "success", icon: "⚖️" },
    key_witness_and_testimony: { label: "Witness & Testimony", color: "highlight", icon: "👤" },
    police_report: { label: "Police Report", color: "critical", icon: "🚔" },
    potential_challenges_and_weaknesses: { label: "Challenges & Weaknesses", color: "highlight", icon: "⚠️" },
  };

  const getCategoryColor = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: "bg-primary-100 text-primary-600 border-primary-200",
      accent: "bg-accent-100 text-accent-600 border-accent-500",
      success: "bg-success-100 text-success-600 border-success-500",
      highlight: "bg-highlight-200 text-highlight-600 border-highlight-500",
      critical: "bg-critical-100 text-critical-600 border-critical-500",
    };
    return colorMap[color] || colorMap.primary;
  };

  const [isClassifyingOpen, setIsClassifyingOpen] = useState(false);
  const [filesToClassify, setFilesToClassify] = useState<Array<{ file: File; fileId: string }>>([]);

  const handleClassificationComplete = (results: Array<{ fileId: string; result: any }>) => {
    // Update all files with their classifications
    results.forEach(({ fileId, result }) => {
      const index = parseInt(fileId);
      const category = (result.file_category || "case_information") as DocumentCategory;

      setClassifiedFiles((prev) =>
        prev.map((cf, i) =>
          i === index
            ? { ...cf, category, isClassifying: false }
            : cf
        )
      );
    });

    setIsClassifyingOpen(false);
    setFilesToClassify([]);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newClassifiedFiles = newFiles.map(file => ({
        file,
        category: "case_information" as DocumentCategory,
        isClassifying: true,
      }));

      setClassifiedFiles(prev => [...prev, ...newClassifiedFiles]);

      // Immediately show classification UI with all files
      const filesToClassify = newClassifiedFiles.map((cf, idx) => ({
        file: cf.file,
        fileId: `${classifiedFiles.length + idx}`,
      }));

      if (filesToClassify.length > 0) {
        setFilesToClassify(filesToClassify);
        setIsClassifyingOpen(true);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setClassifiedFiles(classifiedFiles.filter((_, i) => i !== index));
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

  const getCaseTypeById = (id: string) => {
    const caseTypes: Record<string, any> = {
      tax: {
        id: "tax",
        title: "Tax Law",
        subtitle: "Federal and state tax disputes",
        icon: Coins,
        typicalCases: [
          "IRS Audits & Appeals",
          "Tax Evasion & Fraud Cases",
          "Business Tax Deductions",
          "Estate & Gift Tax Disputes",
          "Tax Court Proceedings",
        ],
        standardOfProof: "Clear and convincing evidence",
      },
      civil: {
        id: "civil",
        title: "Civil Law",
        subtitle: "Legal disputes between parties",
        icon: Scale,
        typicalCases: [
          "Personal Injury & Negligence Claims",
          "Contract Disputes & Breach of Agreement",
          "Property Disputes & Real Estate Issues",
          "Employment Law & Discrimination",
          "Tort Claims & Damages",
        ],
        standardOfProof: "Preponderance of evidence (51% likelihood)",
      },
      criminal: {
        id: "criminal",
        title: "Criminal Law",
        subtitle: "State/federal prosecution of crimes",
        icon: Gavel,
        typicalCases: [
          "Felonies (Murder, Rape, Robbery)",
          "Misdemeanors (Theft, Assault, DUI)",
          "White Collar Crimes (Fraud, Embezzlement)",
          "Drug Offenses & Trafficking",
          "Domestic Violence & Sexual Assault",
        ],
        standardOfProof: "Beyond reasonable doubt (95%+ certainty)",
      },
      labor: {
        id: "labor",
        title: "Labor Law",
        subtitle: "Workplace rights and employment disputes",
        icon: Briefcase,
        typicalCases: [],
        standardOfProof: "",
      },
      family: {
        id: "family",
        title: "Family Law",
        subtitle: "Domestic relations and family matters",
        icon: Heart,
        typicalCases: [],
        standardOfProof: "",
      },
      maritime: {
        id: "maritime",
        title: "Maritime Law",
        subtitle: "Nautical and maritime legal matters",
        icon: Anchor,
        typicalCases: [],
        standardOfProof: "",
      },
      property: {
        id: "property",
        title: "Property Law",
        subtitle: "Real estate and property rights",
        icon: Home,
        typicalCases: [],
        standardOfProof: "",
      },
      corporate: {
        id: "corporate",
        title: "Corporate Law",
        subtitle: "Business operations and commercial disputes",
        icon: Building2,
        typicalCases: [],
        standardOfProof: "",
      },
      immigration: {
        id: "immigration",
        title: "Immigration Law",
        subtitle: "Immigration and naturalization matters",
        icon: Globe,
        typicalCases: [],
        standardOfProof: "",
      },
      "human-rights": {
        id: "human-rights",
        title: "Human Rights Law",
        subtitle: "Fundamental human rights and freedoms",
        icon: Users,
        typicalCases: [],
        standardOfProof: "",
      },
    };
    return caseTypes[id] || null;
  };

  const validateForm = () => {
    if (!caseName?.trim()) {
      alert("Case Title/Name is required.");
      return false;
    }
    if (!caseDescription?.trim()) {
      alert("Comprehensive Case Description is required.");
      return false;
    }
    if (!jurisdiction?.country?.trim() || !jurisdiction?.state?.trim() || !jurisdiction?.city?.trim() || !jurisdiction?.court?.trim()) {
      alert("All jurisdiction fields (Country, State, City, Court) are required.");
      return false;
    }
    if (!caseTypeId?.trim()) {
      alert("Case Type is required.");
      return false;
    }
    if (!role?.trim()) {
      alert("Role is required.");
      return false;
    }
    return true;
  };

  const normalizeCharges = (charges: any[], isCriminal: boolean) => {
    return charges.map(charge => ({
      ...charge,
      defendantPlea: normalizePlea(charge.defendantPlea, isCriminal)
    }));
  };

  const normalizePlea = (plea: string, isCriminal: boolean): string => {
    // For criminal cases: guilty, not-guilty, nolo, pending
    // For civil cases: liable, non-liable, nolo, pending

    if (isCriminal) {
      // Convert civil pleas to criminal pleas
      if (plea === "liable") return "guilty";
      if (plea === "non-liable" || plea === "non_liable") return "not-guilty";
      return plea; // guilty, not-guilty, nolo, pending remain as is
    } else {
      // Convert criminal pleas to civil pleas
      if (plea === "guilty") return "liable";
      if (plea === "not-guilty") return "non-liable";
      return plea; // liable, non-liable, nolo, pending remain as is
    }
  };

  const handleSubmit = async () => {
    // Collect all form data
    const formData = {
      caseName,
      caseDescription,
      documents: classifiedFiles.map(cf => ({
        file: cf.file,
        category: cf.category,
      })),
      timestamp: new Date(),
    };

    if (!validateForm()) {
      return;
    }

    const isCriminalCase = caseTypeId?.toLowerCase() === "criminal";

    try {
      let targetCaseId = caseId;

      // If we have an existing caseId, update it; otherwise create a new case
      if (caseId) {
        targetCaseId = caseId;

        // Update existing case with case details
        const caseDetailsUpdate = {
          case_information: {
            caseName,
            caseDescription,
          }
        };

        const normalizedCharges = normalizeCharges(uploadedMetadata?.charges || [], isCriminalCase);
        const res = await fetch(`/api/cases/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId,
            jurisdiction,
            case_type: caseTypeId,
            role,
            charges: normalizedCharges,
            field: "case_details",
            value: caseDetailsUpdate,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || "Failed to update case");
        }
      } else {
        // Create new case
        const normalizedCharges = normalizeCharges(uploadedMetadata?.charges || [], isCriminalCase);
        const res = await fetch("/api/cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseName,
            caseDescription,
            jurisdiction,
            case_type: caseTypeId,
            role,
            charges: normalizedCharges,
            result: null,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || "Failed to create case result");
        }
        targetCaseId = json.id as string;

        // Set initial completion status for the newly created case
        const totalSections = 6;
        const completedSections = (caseName && caseDescription) ? 1 : 0;
        const completionPercentage = Math.round((completedSections / totalSections) * 100);

        await fetch(`/api/cases/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId: targetCaseId,
            field: "case_details",
            value: {
              _completion_status: completionPercentage,
            },
          }),
        });
      }

      // Store data in sessionStorage for the results screen to access
      sessionStorage.setItem(
        "quickAnalysisData",
        JSON.stringify({
          ...formData,
          caseResultId: targetCaseId,
          jurisdiction,
          case_type: caseTypeId,
          role,
        })
      );

      // Open streaming analysis display and start streaming analysis
      setStreamingCaseId(targetCaseId || null);
      setIsStreamingOpen(true);
    } catch (e) {
      // Fallback: still store form data so user doesn't lose progress
      sessionStorage.setItem(
        "quickAnalysisData",
        JSON.stringify(formData)
      );
      alert(e instanceof Error ? e.message : "Error analyzing case. Please try again.");
    }
  };

  const handleStreamingComplete = (result: any) => {
    setStreamingResult(result);

    // Update sessionStorage with the result
    const existingData = JSON.parse(sessionStorage.getItem("quickAnalysisData") || "{}");
    sessionStorage.setItem(
      "quickAnalysisData",
      JSON.stringify({
        ...existingData,
        result,
      })
    );

    // Navigate to results page after a brief delay (modal will show completion state)
    setTimeout(() => {
      setIsStreamingOpen(false);
      router.push(`/case-analysis/detailed?step=7&caseId=${streamingCaseId}`);
    }, 2000);
  };

  return (
    <div className="relative">
      <StreamingAnalysisDisplay
        isOpen={isStreamingOpen}
        caseId={streamingCaseId || ""}
        onComplete={handleStreamingComplete}
        onClose={() => setIsStreamingOpen(false)}
      />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-32 space-y-6">
        {/* Form Sections */}
        <div className="space-y-6">
          {/* Jurisdiction */}
          <JurisdictionSection
            variant="compact"
            onUpdate={(data) => {
              setJurisdiction(data);
              if (data.country_id) {
                setCountryId(data.country_id);
              }
            }}
            initialValues={jurisdiction}
            hideSaveButton={true}
          />

          {/* Case Type */}
          <CompactCaseType
            initialCaseTypeId={caseTypeId || undefined}
            countryId={countryId}
            onUpdate={(ct: any) => setCaseTypeId(ct?.id)}
          />

          {/* Role */}
          <CompactRole 
            countryId={countryId}
            onUpdate={(r: any) => setRole(r)} 
            initialValue={role as any} 
          />

          {/* Basic Case Information */}
          <div className="bg-surface-000 rounded-lg border border-border-200 p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-primary-600"
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
                <h3 className="text-lg font-bold text-ink-900">
                  Step 4: Case Information
                </h3>
                <p className="text-sm text-ink-600">
                  Basic details about your case
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Case Title/Name */}
              <div>
                <label
                  htmlFor="caseName"
                  className="block text-sm font-semibold text-ink-600 mb-2"
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
                  className="w-full px-4 py-3 border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-ink-900"
                />
              </div>

              {/* Case Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="caseDescription"
                    className="block text-sm font-semibold text-ink-600"
                  >
                    Comprehensive Case Description{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  {caseDescription && (
                    <button
                      type="button"
                      onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
                      className={`px-2 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${isMarkdownPreview
                        ? "bg-success-100 text-success-600 hover:bg-success-100/80"
                        : "bg-surface-100 text-ink-600 hover:bg-surface-200"
                        }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {isMarkdownPreview ? "Edit" : "Preview"}
                    </button>
                  )}
                </div>
                {isMarkdownPreview && caseDescription ? (
                  <div className="w-full p-4 border border-border-200 rounded-lg bg-surface-100 min-h-40 max-h-80 overflow-y-auto markdown-preview">
                    <MarkdownRenderer content={caseDescription} />
                  </div>
                ) : (
                  <textarea
                    id="caseDescription"
                    value={caseDescription}
                    onChange={(e) => setCaseDescription(e.target.value)}
                    placeholder="Provide a detailed description of the case, including key facts, timeline of events, parties involved, and the nature of the dispute or charges. Be as specific as possible."
                    rows={6}
                    className="w-full px-4 py-3 border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-ink-900 resize-none"
                  />
                )}
                <p className="text-xs text-ink-500 mt-2">
                  Include dates, locations, key events, and circumstances. Markdown formatting is supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Calculate Results Button at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-000 border-t border-border-200 shadow-lg z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col items-center">
            <button
              onClick={handleSubmit}
              disabled={isStreamingOpen || !caseName?.trim() ||
                !caseDescription?.trim() ||
                !jurisdiction?.country?.trim() ||
                !jurisdiction?.state?.trim() ||
                !jurisdiction?.city?.trim() ||
                !jurisdiction?.court?.trim() ||
                !caseTypeId?.trim() ||
                !role?.trim()}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary-500 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
            {(!caseName?.trim() ||
              !caseDescription?.trim() ||
              !jurisdiction?.country?.trim() ||
              !jurisdiction?.state?.trim() ||
              !jurisdiction?.city?.trim() ||
              !jurisdiction?.court?.trim() ||
              !caseTypeId?.trim() ||
              !role?.trim()) && (
                <p className="text-center text-sm text-ink-500 mt-2">
                  Please fill in all required fields to continue
                </p>
              )}
          </div>
        </div>
      </div>

      <StreamingClassificationDisplay
        isOpen={isClassifyingOpen}
        files={filesToClassify}
        onComplete={handleClassificationComplete}
        onClose={() => {
          setIsClassifyingOpen(false);
          setFilesToClassify([]);
        }}
      />
    </div>
  );
}
