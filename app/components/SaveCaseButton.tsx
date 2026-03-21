"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { dispatchCaseUpdated } from "./RegenerateHeaderButton";
import LogoLoader from "./LogoLoader";

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
    const initializedRef = useRef(false);
    const lastSavedValueRef = useRef<string>("");
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const serializeValue = (nextValue: any) => {
        try {
            return JSON.stringify(nextValue);
        } catch {
            return String(nextValue);
        }
    };

    const hasMeaningfulValue = (nextValue: any): boolean => {
        if (nextValue === null || nextValue === undefined) return false;
        if (typeof nextValue === "string") return nextValue.trim().length > 0;
        if (Array.isArray(nextValue)) return nextValue.length > 0;
        if (typeof nextValue === "object") {
            const objectValues = Object.values(nextValue);
            if (objectValues.length === 0) return false;
            return objectValues.some((item) => {
                if (item === null || item === undefined) return false;
                if (typeof item === "string") return item.trim().length > 0;
                if (Array.isArray(item)) return item.length > 0;
                return true;
            });
        }
        return true;
    };

    const saveNow = async (serializedValue: string) => {
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
            lastSavedValueRef.current = serializedValue;
            dispatchCaseUpdated();
            if (onSave) onSave();

            // Clear success message after 2 seconds
            if (messageTimerRef.current) {
                clearTimeout(messageTimerRef.current);
            }
            messageTimerRef.current = setTimeout(() => setMessage(null), 2000);
        } catch (e) {
            setMessage({
                type: "error",
                text: e instanceof Error ? e.message : t("failedToSave"),
            });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const serialized = serializeValue(value);

        if (!initializedRef.current) {
            initializedRef.current = true;
            lastSavedValueRef.current = serialized;
            return;
        }

        if (!caseId || !hasMeaningfulValue(value) || serialized === lastSavedValueRef.current) {
            return;
        }

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(() => {
            saveNow(serialized);
        }, 800);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [caseId, field, value]);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            if (messageTimerRef.current) {
                clearTimeout(messageTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border-200 text-sm">
            {isSaving ? (
                <span className="inline-flex items-center gap-2 text-primary-600 font-medium">
                    <LogoLoader size="xs" />
                    {t("saving")}
                </span>
            ) : (
                <span className="inline-flex items-center gap-2 text-ink-500 font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-save enabled
                </span>
            )}
            {message && (
                <span className={`text-sm font-medium ${message.type === "success" ? "text-success-600" : "text-critical-600"}`}>
                    {message.text}
                </span>
            )}
        </div>
    );
}
