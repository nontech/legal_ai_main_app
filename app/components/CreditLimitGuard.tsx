"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import CreditLimitDialog from "./CreditLimitDialog";

interface CreditLimitGuardProps {
    children: React.ReactNode;
    /** Require cases remaining (for pages that create new cases) */
    requireCases?: boolean;
}

export default function CreditLimitGuard({
    children,
    requireCases = true,
}: CreditLimitGuardProps) {
    const router = useRouter();
    const t = useTranslations("caseAnalysis.creditLimit");
    const tCommon = useTranslations("common");
    const params = useParams();
    const country = (params?.country as string) || "de";
    const locale = (params?.locale as string) || "en";

    const [isChecking, setIsChecking] = useState(true);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function checkUsage() {
            try {
                const res = await fetch("/api/usage");
                if (cancelled) return;

                if (!res.ok) {
                    setIsLimitReached(false);
                    setIsChecking(false);
                    return;
                }

                const data = await res.json();
                if (!data.ok) {
                    setIsLimitReached(false);
                    setIsChecking(false);
                    return;
                }

                if (requireCases && data.casesRemaining <= 0) {
                    setIsLimitReached(true);
                    setIsAnonymous(!!data.isAnonymous);
                }
            } catch {
                if (!cancelled) {
                    setIsLimitReached(false);
                }
            } finally {
                if (!cancelled) {
                    setIsChecking(false);
                }
            }
        }

        checkUsage();
        return () => {
            cancelled = true;
        };
    }, [requireCases]);

    const handleGoBack = () => {
        router.push(`/${country}/${locale}`);
    };

    const handleSignIn = () => {
        router.push(`/${country}/${locale}/auth/signin`);
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full" />
                    <p className="text-ink-600">{tCommon("loading")}</p>
                </div>
            </div>
        );
    }

    if (isLimitReached) {
        return (
            <div className="min-h-screen bg-surface-100">
                <CreditLimitDialog
                    title={t("dailyLimitTitle")}
                    subtitle={t("subtitle")}
                    message={t("dailyLimitMessage")}
                    onClose={handleGoBack}
                    primaryButtonLabel={t("goToDashboard")}
                    showSignIn={isAnonymous}
                    onSignIn={handleSignIn}
                />
            </div>
        );
    }

    return <>{children}</>;
}
