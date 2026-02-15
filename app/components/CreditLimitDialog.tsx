"use client";

import { useTranslations } from "next-intl";

interface CreditLimitDialogProps {
    title: string;
    subtitle?: string;
    message: string;
    onClose: () => void;
    showSignIn?: boolean;
    onSignIn?: () => void;
    primaryButtonLabel?: string;
}

export default function CreditLimitDialog({
    title,
    subtitle,
    message,
    onClose,
    showSignIn = false,
    onSignIn,
    primaryButtonLabel,
}: CreditLimitDialogProps) {
    const t = useTranslations("caseAnalysis.creditLimit");
    const label = primaryButtonLabel ?? t("close");
    const sub = subtitle ?? t("subtitle");
    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                <div className="fixed inset-0 bg-primary-950/80 transition-opacity" />

                <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-surface-050 shadow-2xl rounded-2xl border border-border-200">
                    <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-4 sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-primary-100"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{title}</h2>
                                <p className="text-primary-100 text-sm">{sub}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <p className="text-ink-700 text-base leading-relaxed mb-6">
                            {message}
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={onClose}
                                className="inline-flex items-center justify-center rounded-xl border border-border-200 bg-surface-000 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-100"
                            >
                                {label}
                            </button>
                            {showSignIn && onSignIn && (
                                <button
                                    onClick={onSignIn}
                                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-primary-500 hover:to-primary-400"
                                >
                                    {t("signInForMore")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
