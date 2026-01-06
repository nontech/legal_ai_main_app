"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface CaseType {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  typicalCases: string[];
  standardOfProof: string;
}

interface CompactCaseTypeProps {
  onUpdate?: (caseType: CaseType) => void;
  initialCaseTypeId?: string;
  countryId?: string;
  showExtractedBadge?: boolean;
}

// Map icon names to emoji characters
const ICON_MAP: { [key: string]: string } = {
  "dollar-sign": "💰",
  DollarSign: "💰",
  scale: "⚖️",
  Scale: "⚖️",
  briefcase: "💼",
  Briefcase: "💼",
  users: "👥",
  Users: "👥",
  shield: "🛡️",
  Shield: "🛡️",
  heart: "❤️",
  Heart: "❤️",
  leaf: "🌱",
  Leaf: "🌱",
  globe: "🌍",
  Globe: "🌍",
  home: "🏠",
  Home: "🏠",
  building: "🏢",
  Building: "🏢",
  gavel: "⚔️",
  Gavel: "⚔️",
  anchor: "⚓",
  Anchor: "⚓",
  "hard-hat": "👷",
  HardHat: "👷",
  lightbulb: "💡",
  Lightbulb: "💡",
  book: "📚",
  Book: "📚",
  "file-text": "📄",
  FileText: "📄",
  ship: "🚢",
  Ship: "🚢",
  plane: "✈️",
  Plane: "✈️",
  badge: "🎖️",
  Badge: "🎖️",
  default: "⚖️",
};

const getEmojiIcon = (iconName: string | undefined): string => {
  if (!iconName) return ICON_MAP["default"];
  // If it's already an emoji, return it
  if (iconName.match(/[\u{1F300}-\u{1F9FF}]/u)) return iconName;
  // Otherwise, look it up in the map
  return ICON_MAP[iconName] || ICON_MAP["default"];
};

const DEFAULT_CASE_TYPES: CaseType[] = [
  {
    id: "tax",
    title: "Tax Law",
    subtitle: "Federal and state tax disputes",
    icon: "💰",
    typicalCases: [
      "IRS Audits & Appeals",
      "Tax Evasion & Fraud Cases",
      "Business Tax Deductions",
      "Estate & Gift Tax Disputes",
      "Tax Court Proceedings",
    ],
    standardOfProof: "Clear and convincing evidence",
  },
  {
    id: "civil",
    title: "Civil Law",
    subtitle: "Legal disputes between parties",
    icon: "⚖️",
    typicalCases: [
      "Personal Injury & Negligence Claims",
      "Contract Disputes & Breach of Agreement",
      "Property Disputes & Real Estate Issues",
      "Employment Law & Discrimination",
      "Tort Claims & Damages",
    ],
    standardOfProof: "Preponderance of evidence (51% likelihood)",
  },
  {
    id: "criminal",
    title: "Criminal Law",
    subtitle: "State/federal prosecution of crimes",
    icon: "🚔",
    typicalCases: [
      "Felonies (Murder, Rape, Robbery)",
      "Misdemeanors (Theft, Assault, DUI)",
      "White Collar Crimes (Fraud, Embezzlement)",
      "Drug Offenses & Trafficking",
      "Domestic Violence & Sexual Assault",
    ],
    standardOfProof: "Beyond reasonable doubt (95%+ certainty)",
  },
  {
    id: "labor",
    title: "Labor Law",
    subtitle: "Workplace rights and employment disputes",
    icon: "👷",
    typicalCases: [
      "Employment Discrimination",
      "Wage & Hour Violations",
      "Union Organizing & Collective Bargaining",
      "Wrongful Termination",
      "Workplace Safety (OSHA) Violations",
    ],
    standardOfProof: "Preponderance of evidence",
  },
  {
    id: "family",
    title: "Family Law",
    subtitle: "Domestic relations and family matters",
    icon: "👨‍👩‍👧‍👦",
    typicalCases: [
      "Divorce & Legal Separation",
      "Child Custody & Visitation Rights",
      "Adoption & Guardianship",
      "Child & Spousal Support",
      "Domestic Violence Protection",
    ],
    standardOfProof:
      "Preponderance of evidence (best interests standard)",
  },
  {
    id: "maritime",
    title: "Maritime Law",
    subtitle: "Nautical and maritime legal matters",
    icon: "⚓",
    typicalCases: [
      "Shipping & Maritime Commerce",
      "Marine Accidents & Collisions",
      "Salvage & Maritime Liens",
      "Crew Injuries & Jones Act Claims",
      "Maritime Insurance Disputes",
    ],
    standardOfProof: "Preponderance of evidence",
  },
  {
    id: "property",
    title: "Property Law",
    subtitle: "Real estate and property rights",
    icon: "🏠",
    typicalCases: [
      "Real Estate Transactions",
      "Landlord-Tenant Disputes",
      "Zoning & Land Use Issues",
      "Property Ownership Disputes",
      "Easements & Property Rights",
    ],
    standardOfProof: "Preponderance of evidence",
  },
  {
    id: "corporate",
    title: "Corporate Law",
    subtitle: "Business operations and commercial disputes",
    icon: "🏢",
    typicalCases: [
      "Mergers & Acquisitions",
      "Securities Fraud & Violations",
      "Corporate Governance Disputes",
      "Shareholder Rights & Litigation",
      "Commercial Contract Disputes",
    ],
    standardOfProof: "Preponderance of evidence",
  },
  {
    id: "immigration",
    title: "Immigration Law",
    subtitle: "Immigration and naturalization matters",
    icon: "🌍",
    typicalCases: [
      "Deportation & Removal Proceedings",
      "Asylum & Refugee Claims",
      "Visa Applications & Denials",
      "Citizenship & Naturalization",
      "Family-Based Immigration",
    ],
    standardOfProof: "Clear and convincing evidence",
  },
  {
    id: "human-rights",
    title: "Human Rights Law",
    subtitle: "Fundamental human rights and freedoms",
    icon: "✊",
    typicalCases: [
      "Civil Rights Violations",
      "Freedom of Speech & Expression",
      "Religious Freedom Cases",
      "Equality & Anti-Discrimination",
      "International Human Rights Violations",
    ],
    standardOfProof: "Preponderance to clear and convincing",
  },
  {
    id: "environmental",
    title: "Environmental Law",
    subtitle: "Environmental protection and regulations",
    icon: "🌱",
    typicalCases: [
      "Pollution & Contamination Claims",
      "Environmental Impact Assessments",
      "Clean Air & Water Act Violations",
      "Hazardous Waste Disposal",
      "Wildlife Protection & Conservation",
    ],
    standardOfProof: "Preponderance of evidence",
  },
  {
    id: "international",
    title: "International Law",
    subtitle: "Cross-border and international disputes",
    icon: "🌐",
    typicalCases: [
      "International Trade Disputes",
      "Treaty Interpretation & Enforcement",
      "Diplomatic Immunity Cases",
      "International Commercial Arbitration",
      "Cross-Border Criminal Matters",
    ],
    standardOfProof: "Varies by jurisdiction and treaty",
  },
];

const DEFAULT_CASE_TYPE_ID = "civil";
const DEFAULT_CASE_TYPE =
  DEFAULT_CASE_TYPES.find((caseType) => caseType.id === DEFAULT_CASE_TYPE_ID) ??
  DEFAULT_CASE_TYPES[0]!;

function getCaseTypeById(id?: string | null, caseTypes?: CaseType[]) {
  if (!id) return undefined;
  return (caseTypes || DEFAULT_CASE_TYPES).find((caseType) => caseType.id === id);
}

export default function CompactCaseType({
  onUpdate,
  initialCaseTypeId,
  countryId,
  showExtractedBadge = false,
}: CompactCaseTypeProps) {
  const t = useTranslations("caseAnalysis.caseType");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const caseTypes = DEFAULT_CASE_TYPES;
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>(() => {
    const initialSelection = getCaseTypeById(initialCaseTypeId, DEFAULT_CASE_TYPES);
    return initialSelection ?? DEFAULT_CASE_TYPE;
  });
  const lastInitialCaseTypeIdRef = useRef<string | undefined>(initialCaseTypeId);
  const onUpdateRef = useRef(onUpdate);

  // Keep onUpdate ref up to date
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    // Prevent infinite loops by checking if initialCaseTypeId actually changed
    if (lastInitialCaseTypeIdRef.current === initialCaseTypeId) {
      // If initialCaseTypeId hasn't changed, only validate current selection when caseTypes change
      setSelectedCaseType((current) => {
        const currentExists = caseTypes.some(ct => ct.id === current.id);
        // Only update if current selection is invalid
        if (!currentExists && !initialCaseTypeId) {
          return DEFAULT_CASE_TYPE;
        }
        return current; // Keep current if valid
      });
      return;
    }

    // Update ref BEFORE calling setState to prevent loops
    lastInitialCaseTypeIdRef.current = initialCaseTypeId;

    // Only update if initialCaseTypeId is provided and found in caseTypes
    if (initialCaseTypeId) {
      const targetSelection = getCaseTypeById(initialCaseTypeId, caseTypes);
      if (targetSelection) {
        setSelectedCaseType((current) => {
          // Only update if different
          if (current.id === targetSelection.id) {
            return current;
          }
          return targetSelection;
        });
      }
      // If initialCaseTypeId is provided but not found, keep current selection (already updated ref)
    } else {
      // Only default to "civil" if there's no initialCaseTypeId at all
      // and current selection is invalid
      setSelectedCaseType((current) => {
        const currentExists = caseTypes.some(ct => ct.id === current.id);
        if (currentExists) {
          return current;
        }
        return DEFAULT_CASE_TYPE;
      });
    }
  }, [initialCaseTypeId, caseTypes]);

  useEffect(() => {
    // Only call onUpdate when selectedCaseType changes, not when onUpdate changes
    onUpdateRef.current?.(selectedCaseType);
  }, [selectedCaseType]);

  const handleSelectCaseType = (caseType: CaseType) => {
    setSelectedCaseType(caseType);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-surface-000 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center flex-1 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-xl sm:text-2xl text-primary-600">
                  {selectedCaseType?.icon || "⚖️"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-ink-900 flex items-center gap-2 flex-wrap mb-1">
                  {t("stepTitle")}{" "}
                  <span className="text-red-500">*</span>
                  {showExtractedBadge && (
                    <div className="relative group">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 border border-primary-200 rounded-md cursor-help">
                        <svg className="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium text-primary-700">Extracted</span>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-ink-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                        Extracted from case information documents
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-ink-900"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-ink-600 truncate">
                  {selectedCaseType.subtitle}
                </p>
              </div>
            </div>

            {/* Clickable Case Type Name */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border px-2 py-1 hover:bg-surface-100 transition-colors group cursor-pointer"
            >
              <span className="text-base sm:text-lg font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                {selectedCaseType?.title || "Select Case Type"}
              </span>
              <svg
                className="w-4 h-4 text-ink-400 group-hover:text-primary-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-primary-950/80 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface-050 shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Select Case Type
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">
                      Choose the fundamental nature of your legal case
                      to ensure accurate analysis and applicable legal
                      standards.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-surface-200 transition-colors ml-4"
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

              {/* Modal Content */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caseTypes.map((caseType) => (
                      <button
                        key={caseType.id}
                        onClick={() => handleSelectCaseType(caseType)}
                        className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${selectedCaseType.id === caseType.id
                          ? "border-primary-500 bg-primary-100"
                          : "border-border-200 hover:border-primary-300"
                          }`}
                      >
                        <div className="flex items-start mb-2">
                          <div className="text-3xl mr-3 text-primary-600">
                            {caseType.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-ink-900 text-sm mb-1">
                              {caseType.title}
                            </h3>
                            <p className="text-xs text-ink-600 mb-2">
                              {caseType.subtitle}
                            </p>
                          </div>
                          {selectedCaseType.id === caseType.id && (
                            <div className="flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-primary-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-ink-600 space-y-1 mb-2">
                          {caseType.typicalCases
                            .slice(0, 3)
                            .map((case_, index) => (
                              <div
                                key={index}
                                className="flex items-start"
                              >
                                <span className="text-primary-500 mr-1">
                                  •
                                </span>
                                <span className="line-clamp-1">
                                  {case_}
                                </span>
                              </div>
                            ))}
                        </div>

                        <div className="text-xs text-ink-500 pt-2 border-t border-border-200">
                          <span className="font-medium">Proof:</span>{" "}
                          {caseType.standardOfProof}
                        </div>
                      </button>
                    ))}
                  </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-surface-100 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-surface-200 text-ink-600 rounded-lg hover:bg-surface-200/80 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
