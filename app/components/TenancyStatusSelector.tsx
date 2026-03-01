"use client";

import { useState, useEffect } from "react";
import { Home, Building2, HelpCircle } from "lucide-react";
import SaveCaseButton from "./SaveCaseButton";
import { useTranslations } from "next-intl";

type TenancyType = "tenant" | "landlord";

interface TenancyStatusSelectorProps {
  caseId?: string;
}

export default function TenancyStatusSelector({
  caseId,
}: TenancyStatusSelectorProps) {
  const t = useTranslations("caseAnalysis.tenancy");
  const [selectedTenancy, setSelectedTenancy] = useState<TenancyType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!!caseId);

  useEffect(() => {
    if (caseId) {
      const fetchTenancyData = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.tenancy_status) {
            const val = json.data.tenancy_status as string;
            setSelectedTenancy(
              val === "landlord" || val === "tenant" ? val : null
            );
          } else {
            setSelectedTenancy(null);
          }
        } catch (error) {
          console.error("Failed to fetch tenancy data:", error);
          setSelectedTenancy(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTenancyData();
    } else {
      setIsLoading(false);
    }
  }, [caseId]);

  const handleTenancySelect = (tenancy: TenancyType) => {
    setSelectedTenancy(tenancy);
    setIsModalOpen(false);
  };

  const OPTIONS = {
    tenant: {
      title: t("tenant"),
      subtitle: t("tenantSubtitle"),
      icon: <Home className="w-8 h-8" />,
    },
    landlord: {
      title: t("landlord"),
      subtitle: t("landlordSubtitle"),
      icon: <Building2 className="w-8 h-8" />,
    },
  };

  const selectedData = selectedTenancy ? OPTIONS[selectedTenancy] : null;

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
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
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-2 sm:mr-3 flex-shrink-0 ${
                    selectedTenancy && selectedData
                      ? "bg-primary-100 text-primary-600"
                      : "bg-surface-100 text-ink-500"
                  }`}
                >
                  {selectedTenancy && selectedData ? (
                    <span className="text-base sm:text-lg flex items-center justify-center">
                      {selectedData.icon}
                    </span>
                  ) : (
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 mb-1">
                    {t("stepTitle")}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600">
                    {t("positionDesc")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border-200 hover:bg-surface-100 transition-colors group cursor-pointer"
              >
                <span className="text-base sm:text-lg font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                  {selectedData?.title || t("selectTitle")}
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

        {selectedData && (
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
                  {t("selectionConfirmedDesc", { status: selectedData.title })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary-950/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-surface-050 rounded-lg sm:rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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

            <div className="p-3 sm:p-6">
              <p className="text-center text-ink-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {t("selectDescription")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <button
                  onClick={() => handleTenancySelect("tenant")}
                  className={`text-left p-3 sm:p-6 rounded-lg border-2 transition-all ${
                    selectedTenancy === "tenant"
                      ? "border-primary-500 bg-primary-100 ring-2 ring-primary-200"
                      : "border-border-200 bg-surface-000 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-start mb-2">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 ${
                        selectedTenancy === "tenant"
                          ? "bg-primary-600 text-white"
                          : "bg-surface-200 text-ink-500"
                      }`}
                    >
                      {OPTIONS.tenant.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 truncate">
                        {OPTIONS.tenant.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-600 truncate">
                        {OPTIONS.tenant.subtitle}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleTenancySelect("landlord")}
                  className={`text-left p-3 sm:p-6 rounded-lg border-2 transition-all ${
                    selectedTenancy === "landlord"
                      ? "border-primary-500 bg-primary-100 ring-2 ring-primary-200"
                      : "border-border-200 bg-surface-000 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-start mb-2">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 ${
                        selectedTenancy === "landlord"
                          ? "bg-primary-600 text-white"
                          : "bg-surface-200 text-ink-500"
                      }`}
                    >
                      {OPTIONS.landlord.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 truncate">
                        {OPTIONS.landlord.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-600 truncate">
                        {OPTIONS.landlord.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {selectedData && (
                <div className="bg-highlight-200 border border-transparent rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink-700">
                    {t("selectionConfirmedDesc", { status: selectedData.title })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <SaveCaseButton
        caseId={caseId}
        field="tenancy_status"
        value={selectedTenancy ?? "tenant"}
      />
    </>
  );
}
