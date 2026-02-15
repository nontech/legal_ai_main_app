"use client";

import { useState, useEffect } from "react";
import { dispatchCaseUpdated } from "./RegenerateHeaderButton";
import { useTranslations } from "next-intl";

interface Charge {
  id: string;
  statuteNumber: string;
  chargeDescription: string;
  essentialFacts: string;
  defendantPlea: string;
}

interface ChargesSectionProps {
  caseId?: string;
  onCompletionChange?: (isComplete: boolean) => void;
}

export default function ChargesSection({ caseId, onCompletionChange }: ChargesSectionProps) {
  const t = useTranslations("caseAnalysis.charges");
  const [charges, setCharges] = useState<Charge[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [caseType, setCaseType] = useState<string>("criminal");
  const [isLoadingCaseType, setIsLoadingCaseType] = useState(true);

  useEffect(() => {
    if (caseId) {
      const fetchChargesData = async () => {
        try {
          setIsLoadingCaseType(true);
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data) {
            const caseData = json.data;

            // Load case type
            if (caseData.case_type) {
              setCaseType(caseData.case_type);
            }

            // Load charges if they exist
            if (caseData.charges && Array.isArray(caseData.charges)) {
              console.log("Case data charges:", caseData.charges);
              setCharges(caseData.charges);
              if (caseData.charges.length > 0) {
                // Notify parent that charges are complete
                if (onCompletionChange) {
                  onCompletionChange(true);
                }
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch charges data:", error);
        } finally {
          setIsLoadingCaseType(false);
        }
      };

      fetchChargesData();
    }
  }, [caseId, onCompletionChange]);

  const addCharge = () => {
    const isCriminal = caseType?.toLowerCase() === "criminal";
    const defaultPlea = isCriminal ? "not-guilty" : "non-liable";

    const newCharge: Charge = {
      id: Date.now().toString(),
      statuteNumber: "",
      chargeDescription: "",
      essentialFacts: "",
      defendantPlea: defaultPlea,
    };
    setCharges([...(charges || []), newCharge]);
  };

  const removeCharge = (chargeId: string) => {
    const updatedCharges = (charges || []).filter((c) => c.id !== chargeId);
    setCharges(updatedCharges);

    // Save to database immediately
    if (caseId) {
      const saveToDb = async () => {
        try {
          await fetch("/api/cases/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              caseId,
              field: "charges",
              value: updatedCharges.length > 0 ? updatedCharges : null,
            }),
          });

          // Notify parent that charges have been removed/updated
          if (onCompletionChange) {
            onCompletionChange(updatedCharges.length > 0);
          }
        } catch (error) {
          console.error("Failed to save charges:", error);
        }
      };

      saveToDb();
    }
  };

  const updateCharge = (chargeId: string, field: keyof Charge, value: string) => {
    setCharges(
      (charges || []).map((c) => (c.id === chargeId ? { ...c, [field]: value } : c))
    );
  };

  const handleSaveCharges = async () => {
    if (!caseId) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/cases/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          field: "charges",
          value: charges,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to save charges");
      }

      dispatchCaseUpdated();

      // Notify parent that charges have been saved (complete if any charges exist)
      if (onCompletionChange && (charges || []).length > 0) {
        onCompletionChange(true);
      }
    } catch (error) {
      console.error("Failed to save charges:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isCriminal = caseType?.toLowerCase() === "criminal";
  // Used for dynamic labels that are simple words, but we prefer full translation keys
  // const chargeLabel = isCriminal ? "Charges" : "Claims"; 
  // const chargeWord = isCriminal ? "charge" : "claim";

  return (
    <div className="space-y-6">
      {/* Charges/Claims Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isCriminal ? t("title") : t("titleClaims")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isCriminal ? t("description") : t("descriptionClaims")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {isCriminal
              ? t("addedCount", { count: charges?.length || 0 })
              : t("addedCountClaims", { count: charges?.length || 0 })
            }
          </div>
          <button
            onClick={addCharge}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {isCriminal ? t("addCharge") : t("addClaim")}
          </button>
        </div>

        <div className="space-y-3">
          {(charges || []).map((charge, index) => (
            <div
              key={charge.id}
              className="border-l-4 border-gray-900 bg-white rounded-r-lg overflow-hidden p-4 space-y-4"
            >
              {/* Charge Header with Delete Button */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("count", { number: index + 1 })}
                </h3>
                <button
                  onClick={() => removeCharge(charge.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete this charge"
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
                </button>
              </div>

              {/* Charge Details - Always Expanded */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("statuteNumber")}
                  </label>
                  <input
                    type="text"
                    value={charge.statuteNumber}
                    onChange={(e) =>
                      updateCharge(charge.id, "statuteNumber", e.target.value)
                    }
                    placeholder={t("statuteNumberPlaceholder")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isCriminal ? t("chargeDescription") : t("claimDescription")}
                  </label>
                  <textarea
                    value={charge.chargeDescription}
                    onChange={(e) =>
                      updateCharge(
                        charge.id,
                        "chargeDescription",
                        e.target.value
                      )
                    }
                    placeholder={isCriminal ? t("chargeDescription") : t("claimDescription")}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("essentialFacts")}
                  </label>
                  <textarea
                    value={charge.essentialFacts}
                    onChange={(e) =>
                      updateCharge(charge.id, "essentialFacts", e.target.value)
                    }
                    placeholder={t("essentialFacts")}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isCriminal ? t("defendantPlea") : t("defendantClaim")}
                  </label>
                  <select
                    value={charge.defendantPlea}
                    onChange={(e) =>
                      updateCharge(charge.id, "defendantPlea", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 bg-white"
                  >
                    {isCriminal ? (
                      <>
                        <option value="not-guilty">{t("notGuilty")}</option>
                        <option value="guilty">{t("guilty")}</option>
                        <option value="nolo">{t("noloContendere")}</option>
                        <option value="pending">{t("pending")}</option>
                      </>
                    ) : (
                      <>
                        <option value="non-liable">{t("nonLiable")}</option>
                        <option value="liable">{t("liable")}</option>
                        <option value="nolo">{t("noloContendere")}</option>
                        <option value="pending">{t("pending")}</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button */}
      {caseId && (
        <div className="flex justify-start">
          <button
            onClick={handleSaveCharges}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t("saving")}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t("saveChanges")}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
