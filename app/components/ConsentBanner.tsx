"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  readConsentFromStorage,
  writeConsentToStorage,
} from "@/lib/consent";

export default function ConsentBanner() {
  const t = useTranslations("consentBanner");
  const params = useParams();
  const country = params.country as string | undefined;
  const locale = params.locale as string | undefined;
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasDecision = readConsentFromStorage() !== null;
    setIsVisible(!hasDecision);
    setIsReady(true);
  }, []);

  const handleAccept = useCallback(() => {
    writeConsentToStorage("accepted");
    setIsVisible(false);
  }, []);

  const handleDecline = useCallback(() => {
    writeConsentToStorage("declined");
    setIsVisible(false);
  }, []);

  if (!isReady || !isVisible) {
    return null;
  }

  const policyHref =
    country && locale ? `/${country}/${locale}/cookies` : "/cookies";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl border border-border-200 bg-surface-000/95 backdrop-blur shadow-xl p-4 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm sm:text-base text-ink-700">
            <p className="font-semibold text-ink-900">{t("title")}</p>
            <p className="mt-1">
              {t("description")}{" "}
              <Link
                href={policyHref}
                className="text-primary-600 hover:text-primary-700 underline underline-offset-2"
              >
                {t("policyLink")}
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Link
              href={policyHref}
              className="inline-flex items-center justify-center rounded-lg border border-border-300 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-surface-100 transition-colors"
            >
              {t("settings")}
            </Link>
            <button
              type="button"
              onClick={handleDecline}
              className="inline-flex items-center justify-center rounded-lg border border-border-300 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-surface-100 transition-colors"
            >
              {t("decline")}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
