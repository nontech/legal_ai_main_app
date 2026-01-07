"use client";

import { useState, useEffect } from "react";
import { Briefcase, Shield, HelpCircle } from "lucide-react";
import SaveCaseButton from "./SaveCaseButton";
import { useTranslations } from "next-intl";

type RoleType = "defendant" | "plaintiff";

interface RoleSelectorProps {
  caseId?: string;
  countryId?: string;
}

export default function RoleSelector({ caseId, countryId }: RoleSelectorProps) {
  const t = useTranslations("caseAnalysis.role");
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!!caseId);

  useEffect(() => {
    if (caseId) {
      const fetchRoleData = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.role) {
            setSelectedRole(json.data.role as RoleType);
          } else {
            setSelectedRole(null);
          }
        } catch (error) {
          console.error("Failed to fetch role data:", error);
          setSelectedRole(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRoleData();
    } else {
      setIsLoading(false);
    }
  }, [caseId]);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setIsModalOpen(false);
  };

  // Hardcoded roles - same as CompactRole
  const ROLES = {
    defendant: {
      title: "Defendant/Respondent",
      subtitle: "Party defending against legal action",
      icon: <Shield className="w-8 h-8" />,
      responsibilities: [
        "Respond to claims",
        "Challenge evidence",
        "Raise defenses",
        "Present contradictory evidence",
        "Seek dismissal or reduced liability",
      ],
      strategicFocus: "Defending against claims",
    },
    plaintiff: {
      title: "Plaintiff/Petitioner",
      subtitle: "Party initiating the legal action",
      icon: <Briefcase className="w-8 h-8" />,
      responsibilities: [
        "Initiate legal proceedings",
        "Bear burden of proof",
        "Present supporting evidence",
        "Challenge opposing arguments",
        "Seek requested relief",
      ],
      strategicFocus: "Building compelling case for relief",
    },
  };

  const selectedRoleData = selectedRole ? ROLES[selectedRole] : null;

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-surface-000 rounded-lg shadow-sm border border-border-200 p-4 sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-ink-900 mb-2 sm:mb-4">
              {t("selectTitle")}
            </h2>
            <p className="text-sm sm:text-lg text-ink-600 max-w-4xl mx-auto">
              {t("selectDescription")}
            </p>
          </div>
        </div>

        {/* Confirmation Card */}
        {selectedRoleData && (
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
                    role: selectedRoleData.title,
                    font: (chunks) => <span className="font-semibold">{chunks}</span>
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compact Display with Button */}
        <div className="bg-surface-000 p-3 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-surface-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0 animate-pulse">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-surface-200 rounded"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="h-5 sm:h-6 bg-surface-100 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-surface-100 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2">
                <div className="h-5 sm:h-6 bg-surface-100 rounded w-28 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center flex-1 min-w-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-2 sm:mr-3 flex-shrink-0 ${selectedRole && selectedRoleData
                    ? "bg-primary-100 text-primary-600"
                    : "bg-surface-100 text-ink-500"
                    }`}
                >
                  {selectedRole && selectedRoleData ? (
                    <span className="text-base sm:text-lg flex items-center justify-center">
                      {selectedRoleData.icon}
                    </span>
                  ) : (
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 mb-1">
                    {t("stepTitle")}{" "}
                    <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600">
                    {t("positionDesc")}
                  </p>
                </div>
              </div>

              {/* Clickable Role Name */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border-200 hover:bg-surface-100 transition-colors group cursor-pointer"
              >
                <span className="text-base sm:text-lg font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                  {selectedRoleData?.title || "Select Role"}
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
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary-950/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-surface-050 rounded-lg sm:rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-primary-700 to-primary-600 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                  {t("selectTitle")}
                </h2>
                <p className="text-primary-100 text-xs sm:text-sm hidden sm:block">
                  {t("selectDescription")}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-surface-200 transition-colors flex-shrink-0"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Role Cards in Modal */}
            <div className="p-3 sm:p-6">
              <p className="text-center text-ink-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {t("selectDescription")}
              </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                {/* Defendant Card */}
                <button
                  onClick={() => handleRoleSelect("defendant")}
                  className={`text-left p-3 sm:p-6 rounded-lg border-2 transition-all ${selectedRole === "defendant"
                    ? "border-primary-500 bg-primary-100 ring-2 ring-primary-200"
                    : "border-border-200 bg-surface-000 hover:border-primary-300"
                    }`}
                >
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 ${selectedRole === "defendant"
                        ? "bg-primary-600 text-white"
                        : "bg-surface-200 text-ink-500"
                        }`}
                    >
                      {ROLES.defendant.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 truncate">
                        {ROLES.defendant.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-600 truncate">
                        {ROLES.defendant.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4 hidden sm:block">
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">
                      Key Responsibilities:
                    </h4>
                    <ul className="space-y-1">
                      {ROLES.defendant.responsibilities.map(
                        (resp: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-ink-600 flex items-start"
                          >
                            <span className="text-primary-600 mr-2">•</span>
                            <span>{resp}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-border-200 hidden sm:block">
                    <p className="text-sm text-ink-600">
                      <span className="font-semibold">Strategic Focus:</span>{" "}
                      {ROLES.defendant.strategicFocus}
                    </p>
                  </div>
                </button>

                {/* Plaintiff Card */}
                <button
                  onClick={() => handleRoleSelect("plaintiff")}
                  className={`text-left p-3 sm:p-6 rounded-lg border-2 transition-all ${selectedRole === "plaintiff"
                    ? "border-primary-500 bg-primary-100 ring-2 ring-primary-200"
                    : "border-border-200 bg-surface-000 hover:border-primary-300"
                    }`}
                >
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 ${selectedRole === "plaintiff"
                        ? "bg-primary-600 text-white"
                        : "bg-surface-200 text-ink-500"
                        }`}
                    >
                      {ROLES.plaintiff.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 truncate">
                        {ROLES.plaintiff.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-600 truncate">
                        {ROLES.plaintiff.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4 hidden sm:block">
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">
                      Key Responsibilities:
                    </h4>
                    <ul className="space-y-1">
                      {ROLES.plaintiff.responsibilities.map(
                        (resp: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-ink-600 flex items-start"
                          >
                            <span className="text-primary-600 mr-2">•</span>
                            <span>{resp}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-border-200 hidden sm:block">
                    <p className="text-sm text-ink-600">
                      <span className="font-semibold">Strategic Focus:</span>{" "}
                      {ROLES.plaintiff.strategicFocus}
                    </p>
                  </div>
                </button>
              </div>

              {/* Selected Role Summary in Modal */}
              {selectedRoleData && (
                <div className="bg-highlight-200 border border-transparent rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink-700">
                    {t.rich("selectionConfirmedDesc", {
                      role: selectedRoleData.title,
                      font: (chunks) => <span className="font-semibold">{chunks}</span>
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <SaveCaseButton
        caseId={caseId}
        field="role"
        value={selectedRole || "plaintiff"}
      />
    </>
  );
}
