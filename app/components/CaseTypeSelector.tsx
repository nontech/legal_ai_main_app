"use client";

import { useState, useEffect } from "react";
import SaveCaseButton from "./SaveCaseButton";
import { useTranslations } from "next-intl";

interface CaseType {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  typicalCases: string[];
  standardOfProof: string;
}

// Map icon names to emoji characters
const ICON_MAP: { [key: string]: string } = {
  // Lucide icon names to emoji
  "dollar-sign": "💰",
  DollarSign: "💰",
  scale: "⚖️",
  Scale: "⚖️",
  briefcase: "👔",
  Briefcase: "👔",
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
  // Add default fallback
  default: "⚖️",
};

const getEmojiIcon = (iconName: string | undefined): string => {
  if (!iconName) return ICON_MAP["default"];
  return ICON_MAP[iconName] || ICON_MAP["default"];
};

interface CaseTypeSelectorProps {
  caseId?: string;
  countryId?: string;
}

export default function CaseTypeSelector({
  caseId,
  countryId,
}: CaseTypeSelectorProps) {
  const t = useTranslations("caseAnalysis.caseType");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseType, setSelectedCaseType] =
    useState<CaseType | null>(null);
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [isLoading, setIsLoading] = useState(!!caseId);
  const [isFetchingCaseTypes, setIsFetchingCaseTypes] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default case types as fallback
  const defaultCaseTypes: CaseType[] = [
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
    {
      id: "administrative",
      title: "Administrative Law",
      subtitle: "Government agency actions and regulations",
      icon: "📋",
      typicalCases: [
        "Regulatory Compliance Disputes",
        "Licensing & Permit Appeals",
        "Agency Rule Challenges",
        "Government Benefits Appeals",
        "Administrative Hearings",
      ],
      standardOfProof: "Substantial evidence standard",
    },
    {
      id: "constitutional",
      title: "Constitutional Law",
      subtitle: "Fundamental rights and government powers",
      icon: "📜",
      typicalCases: [
        "Civil Rights & Liberties",
        "First Amendment Challenges",
        "Due Process Violations",
        "Equal Protection Claims",
        "Government Power Disputes",
      ],
      standardOfProof: "Various (strict scrutiny to rational basis)",
    },
    {
      id: "ip",
      title: "IP Law",
      subtitle: "Creative and intellectual property rights",
      icon: "💡",
      typicalCases: [
        "Patent Infringement & Disputes",
        "Trademark & Copyright Violations",
        "Trade Secret Misappropriation",
        "Software & Technology Licensing",
        "Entertainment & Media Rights",
      ],
      standardOfProof: "Preponderance of evidence",
    },
  ];

  // Fetch case types from API when country changes
  useEffect(() => {
    if (!countryId) {
      setCaseTypes(defaultCaseTypes);
      return;
    }

    let isMounted = true;

    const fetchCaseTypesFromAPI = async () => {
      try {
        setIsFetchingCaseTypes(true);
        const res = await fetch(
          `/api/admin/case-types?country_id=${countryId}`
        );
        const json = await res.json();

        if (!isMounted) return;

        if (
          json.ok &&
          json.data &&
          Object.keys(json.data).length > 0
        ) {
          // Transform API response (JSONB object) to array format
          const apiCaseTypes = Object.entries(json.data).map(
            ([key, value]: [string, any]) => {
              // Get icon from API and convert to emoji, or find from default case types
              let icon = value.icon;
              if (icon) {
                // Convert icon name to emoji
                icon = getEmojiIcon(icon);
              } else {
                const defaultCaseType = defaultCaseTypes.find(
                  (ct) => ct.id === key
                );
                icon = defaultCaseType?.icon || "⚖️";
              }
              return {
                id: key,
                title: value.name || value.title || key,
                subtitle: value.description || value.subtitle || "",
                icon: icon,
                typicalCases:
                  value.typical_cases || value.typicalCases || [],
                standardOfProof:
                  value.standard_of_proof ||
                  value.standardOfProof ||
                  "",
              };
            }
          );
          setCaseTypes(apiCaseTypes);
        } else {
          // No API data found, use default case types
          setCaseTypes(defaultCaseTypes);
        }

        if (!json.ok) {
          setError(json.error || "Failed to fetch case types");
        }
      } catch (err) {
        console.error("Failed to fetch case types:", err);
        setCaseTypes(defaultCaseTypes);
        setError("Failed to fetch case types");
      } finally {
        if (isMounted) {
          setIsFetchingCaseTypes(false);
        }
      }
    };

    fetchCaseTypesFromAPI();

    return () => {
      isMounted = false;
    };
  }, [countryId]);

  useEffect(() => {
    if (caseId) {
      const fetchCaseTypeData = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.case_type) {
            const caseTypeId = json.data.case_type;
            let foundCaseType = caseTypes.find(
              (ct) => ct.id === caseTypeId
            );

            // Ensure the case type has an icon
            if (foundCaseType && !foundCaseType.icon) {
              const defaultCaseType = defaultCaseTypes.find(
                (ct) => ct.id === caseTypeId
              );
              if (defaultCaseType?.icon) {
                foundCaseType = {
                  ...foundCaseType,
                  icon: defaultCaseType.icon,
                };
              } else {
                foundCaseType = { ...foundCaseType, icon: "⚖️" };
              }
            }

            if (foundCaseType) {
              setSelectedCaseType(foundCaseType);
            } else {
              const fallback = caseTypes[1] || defaultCaseTypes[1];
              setSelectedCaseType(fallback);
            }
          } else {
            const fallback = caseTypes[1] || defaultCaseTypes[1];
            setSelectedCaseType(fallback);
          }
        } catch (error) {
          console.error("Failed to fetch case type data:", error);
          const fallback = caseTypes[1] || defaultCaseTypes[1];
          setSelectedCaseType(fallback);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCaseTypeData();
    } else {
      const fallback = caseTypes[1] || defaultCaseTypes[1];
      setSelectedCaseType(fallback);
      setIsLoading(false);
    }
  }, [caseId, caseTypes]);

  const handleSelectCaseType = (caseType: CaseType) => {
    setSelectedCaseType(caseType);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Selected Case Type Display */}
        <div className="bg-surface-000 p-3 sm:p-6">
          {isLoading || isFetchingCaseTypes ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-surface-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0 animate-pulse">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-surface-200 rounded"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="h-5 sm:h-6 bg-surface-100 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-surface-100 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2">
                <div className="h-5 sm:h-6 bg-surface-100 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                  <span className="text-xl sm:text-2xl text-primary-600">
                    {selectedCaseType?.icon
                      ? getEmojiIcon(selectedCaseType.icon)
                      : "⚖️"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 mb-1">
                    {t("stepTitle")}{" "}
                    <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600 truncate">
                    {selectedCaseType?.subtitle || t("selectTitle")}
                  </p>
                </div>
              </div>

              {/* Clickable Case Type Name */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors group cursor-pointer"
              >
                <span className="text-base sm:text-lg font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                  {selectedCaseType?.title || t("selectTitle")}
                </span>
                <svg
                  className="w-4 h-4 text-ink-400 group-hover:text-primary-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Confirmation Card */}
        <div className="bg-highlight-200 border border-transparent rounded-lg p-3 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-highlight-600 flex-shrink-0 mt-0.5 sm:mt-1"
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
            <div>
              <h4 className="font-bold text-ink-900 mb-1 sm:mb-2 text-sm sm:text-base">
                {t("selectionConfirmed")}
              </h4>
              <p className="text-ink-600 text-xs sm:text-sm">
                {t.rich("selectionConfirmedDesc", {
                  type: selectedCaseType?.title || t("na"),
                  font: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>
            </div>
          </div>
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
                  <h2 className="text-2xl font-bold text-white">
                    {t("selectTitle")}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-surface-200 transition-colors"
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
                <p className="text-primary-100 text-sm mt-1">
                  {t("selectDescription")}
                </p>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {isFetchingCaseTypes ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border-2 border-border-200 animate-pulse"
                      >
                        <div className="flex items-start mb-2">
                          <div className="w-8 h-8 bg-surface-200 rounded mr-3"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-surface-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-surface-200 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="space-y-2 mb-2">
                          <div className="h-3 bg-surface-200 rounded w-full"></div>
                          <div className="h-3 bg-surface-200 rounded w-3/4"></div>
                        </div>
                        <div className="h-3 bg-surface-200 rounded w-20 mt-2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caseTypes.map((caseType) => (
                      <button
                        key={caseType.id}
                        onClick={() => handleSelectCaseType(caseType)}
                        className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          selectedCaseType?.id === caseType.id
                            ? "border-primary-500 bg-primary-100"
                            : "border-border-200 hover:border-primary-300"
                        }`}
                      >
                        <div className="flex items-start mb-2">
                          <div className="text-3xl mr-3">
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
                          {selectedCaseType?.id === caseType.id && (
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
                )}
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
      <SaveCaseButton
        caseId={caseId}
        field="case_type"
        value={selectedCaseType?.id || "civil"}
      />
    </>
  );
}
