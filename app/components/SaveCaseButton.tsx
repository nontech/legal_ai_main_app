"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface SaveCaseButtonProps {
    caseId?: string;
    field: string;
    value: any;
    onSave?: () => void;
    children?: React.ReactNode;
    [key: string]: any; // Allow additional props for convenience
}

export default function SaveCaseButton({
    caseId,
    field,
    value,
    onSave,
    children,
    ...rest
}: SaveCaseButtonProps) {
    const t = useTranslations("caseAnalysis.saveButton");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSave = async () => {
        if (!caseId) {
            setMessage({ type: "error", text: t("caseIdRequired") });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/cases/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caseId, field, value }),
            });

            const json = await res.json();

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || t("failedToSave"));
            }

            setMessage({ type: "success", text: t("savedSuccessfully") });
            if (onSave) onSave();

            // Clear success message after 2 seconds
            setTimeout(() => setMessage(null), 2000);
        } catch (e) {
            setMessage({
                type: "error",
                text: e instanceof Error ? e.message : t("failedToSave"),
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border-200">
            <button
                onClick={handleSave}
                disabled={isSaving || !caseId}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold shadow-sm hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isSaving ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t("saving")}
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {children || t("saveChanges")}
                    </>
                )}
            </button>

            {message && (
                <span className={`text-sm font-medium ${message.type === "success" ? "text-success-600" : "text-critical-600"}`}>
                    {message.text}
                </span>
            )}
        </div>
    );
}
