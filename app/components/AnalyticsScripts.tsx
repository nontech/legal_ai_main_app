"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, readConsentFromStorage } from "@/lib/consent";

export default function AnalyticsScripts() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      setHasConsent(readConsentFromStorage() === "accepted");
    };

    updateConsent();
    window.addEventListener(CONSENT_EVENT, updateConsent);

    return () => {
      window.removeEventListener(CONSENT_EVENT, updateConsent);
    };
  }, []);

  if (!hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17430668981"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17430668981');
        `}
      </Script>
    </>
  );
}
