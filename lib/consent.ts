export const CONSENT_KEY = "tlc_cookie_consent";
export const CONSENT_EVENT = "tlc-consent-updated";

export type ConsentValue = "accepted" | "declined";

export function readConsentFromStorage(): ConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "declined") {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}

export function writeConsentToStorage(value: ConsentValue) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    return;
  }

  window.dispatchEvent(new Event(CONSENT_EVENT));
}
