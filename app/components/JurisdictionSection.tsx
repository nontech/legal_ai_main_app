"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import SaveCaseButton from "./SaveCaseButton";
import SearchableSelect from "./ui/searchable-select";

interface Country {
  id: string;
  name: string;
  iso_code: string;
}

interface Jurisdiction {
  id: string;
  country_id: string;
  name: string | null;
  type: string | null;
  code: string | null;
}

interface Court {
  id: string;
  country_id: string | null;
  jurisdiction_id: string | null;
  court_level_id: string | null;
  name: string | null;
  official_name: string | null;
}

interface JurisdictionData {
  country: string;
  jurisdiction: string;
  court_name: string;
  country_code: string;
  jurisdiction_code: string;
}

interface JurisdictionSectionProps {
  caseId?: string;
  onCompletionChange?: (isComplete: boolean) => void;
  onCountryChange?: (countryId: string) => void;
  onJurisdictionChange?: (jurisdictionId: string) => void;
  variant?: "full" | "compact";
  onUpdate?: (data: JurisdictionData) => void;
  initialValues?: Partial<JurisdictionData>;
  hideSaveButton?: boolean;
  showExtractedBadge?: boolean;
}

// Helper: Calculate string similarity (Levenshtein distance)
const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  // Check substring match
  if (s1.includes(s2) || s2.includes(s1)) {
    const longer = Math.max(s1.length, s2.length);
    const shorter = Math.min(s1.length, s2.length);
    return (shorter / longer) * 100;
  }

  // Levenshtein distance
  const matrix: number[][] = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(0));

  for (let i = 0; i <= s2.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      const cost = s2[i - 1] === s1[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j - 1] + cost,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1
      );
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  return ((maxLength - distance) / maxLength) * 100;
};

// Helper: Case-insensitive string match
const matchesString = (str1: string, str2: string | null | undefined): boolean => {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
};

export default function JurisdictionSection({
  caseId,
  onCompletionChange,
  onCountryChange,
  onJurisdictionChange,
  variant = "full",
  onUpdate,
  initialValues,
  hideSaveButton = false,
  showExtractedBadge = false,
}: JurisdictionSectionProps) {
  const t = useTranslations("caseAnalysis.jurisdiction");

  // Data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  // Selection state
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [jurisdictionId, setJurisdictionId] = useState("");
  const [court, setCourt] = useState("");

  // Custom values for "Other" option
  const [customCountry, setCustomCountry] = useState("");
  const [customJurisdiction, setCustomJurisdiction] = useState("");
  const [customCourt, setCustomCourt] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(!!caseId);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingJurisdictions, setIsLoadingJurisdictions] = useState(false);
  const [isLoadingCourts, setIsLoadingCourts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for callbacks and initialization tracking
  const onUpdateRef = useRef(onUpdate);
  const onCompletionChangeRef = useRef(onCompletionChange);
  const lastUpdateRef = useRef("");
  const hasInitializedRef = useRef(false);
  const hasUserInteractedRef = useRef(false);

  const isCompact = variant === "compact";

  // Update callback refs
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onCompletionChangeRef.current = onCompletionChange;
  }, [onUpdate, onCompletionChange]);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const res = await fetch("/api/admin/countries");
        const json = await res.json();

        if (json.ok && json.data) {
          setCountries(json.data);
        } else {
          setError(json.error || "Failed to fetch countries");
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setError("Failed to fetch countries");
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch jurisdictions when country changes
  useEffect(() => {
    if (!countryId) {
      setJurisdictions([]);
      return;
    }

    const fetchJurisdictions = async () => {
      try {
        setIsLoadingJurisdictions(true);
        const res = await fetch(`/api/admin/jurisdictions?country_id=${countryId}`);
        const json = await res.json();

        if (json.ok && json.data) {
          setJurisdictions(json.data);
        } else {
          setError(json.error || "Failed to fetch jurisdictions");
        }
      } catch (err) {
        console.error("Failed to fetch jurisdictions:", err);
        setError("Failed to fetch jurisdictions");
      } finally {
        setIsLoadingJurisdictions(false);
      }
    };

    fetchJurisdictions();
  }, [countryId]);

  // Fetch courts when jurisdiction changes
  useEffect(() => {
    if (!countryId || !jurisdictionId) {
      setCourts([]);
      return;
    }

    const fetchCourts = async () => {
      try {
        setIsLoadingCourts(true);
        const res = await fetch(
          `/api/admin/courts?country_id=${countryId}&jurisdiction_id=${jurisdictionId}`
        );
        const json = await res.json();

        if (json.ok && json.data) {
          setCourts(json.data);
        } else {
          setError(json.error || "Failed to fetch courts");
        }
      } catch (err) {
        console.error("Failed to fetch courts:", err);
        setError("Failed to fetch courts");
      } finally {
        setIsLoadingCourts(false);
      }
    };

    fetchCourts();
  }, [countryId, jurisdictionId]);

  // Match country from initialValues (prioritize code over name)
  const matchCountry = useCallback((countries: Country[], initialValues?: Partial<JurisdictionData>) => {
    if (!initialValues) return null;

    // PRIORITY 1: Try matching by ISO code first
    if (initialValues.country_code) {
      const match = countries.find((c) => c.iso_code === initialValues.country_code);
      if (match) {
        console.log("✅ Matched country by code:", initialValues.country_code, "→", match.name);
        return match;
      }
      console.log("⚠️ No country found with code:", initialValues.country_code);
    }

    // PRIORITY 2: Try matching by name (fallback)
    if (initialValues.country) {
      const match = countries.find((c) => matchesString(c.name, initialValues.country));
      if (match) {
        console.log("✅ Matched country by name:", initialValues.country, "→", match.name);
        return match;
      }
      console.log("⚠️ No country found with name:", initialValues.country);
    }

    return null;
  }, []);

  // Match jurisdiction from initialValues (prioritize code over name)
  const matchJurisdiction = useCallback((jurisdictions: Jurisdiction[], initialValues?: Partial<JurisdictionData>) => {
    if (!initialValues) return null;

    // PRIORITY 1: Try matching by code first
    if (initialValues.jurisdiction_code) {
      // Accept both "US-CA" and "CA" formats (and tolerate extra spaces)
      const raw = initialValues.jurisdiction_code.trim();
      const parts = raw
        .split("-")
        .map((p) => p.trim())
        .filter(Boolean);
      const code = (parts.length > 1 ? parts[1] : parts[0]) || "";
      if (code) {
        const match = jurisdictions.find((j) => j.code === code);
        if (match && match.name) {
          console.log("✅ Matched jurisdiction by code:", code, "→", match.name);
          return match;
        }
        console.log("⚠️ No jurisdiction found with code:", code);
      }
    }

    // PRIORITY 2: Try matching by name (fallback)
    if (initialValues.jurisdiction) {
      const match = jurisdictions.find((j) => j.name && matchesString(j.name, initialValues.jurisdiction!));
      if (match && match.name) {
        console.log("✅ Matched jurisdiction by name:", initialValues.jurisdiction, "→", match.name);
        return match;
      }
      console.log("⚠️ No jurisdiction found with name:", initialValues.jurisdiction);
    }

    return null;
  }, []);

  // Match court with fuzzy matching
  const matchCourt = useCallback((courts: Court[], courtName?: string) => {
    if (!courtName) return null;

    // Try exact match first
    const exactMatch = courts.find(
      (c) =>
        (c.name && matchesString(c.name, courtName)) ||
        (c.official_name && matchesString(c.official_name, courtName))
    );

    if (exactMatch && exactMatch.name) {
      console.log("✅ Exact match found for court:", exactMatch.name);
      return exactMatch;
    }

    // Try fuzzy matching (75% threshold)
    const THRESHOLD = 75;
    let bestMatch: Court | null = null;
    let bestScore = 0;

    courts.forEach((c) => {
      if (c.name) {
        const score = calculateSimilarity(courtName, c.name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = c;
        }
      }
      if (c.official_name) {
        const score = calculateSimilarity(courtName, c.official_name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = c;
        }
      }
    });

    if (bestMatch && bestScore >= THRESHOLD) {
      const matchedName = (bestMatch as Court).name;
      if (matchedName) {
        console.log(`🎯 Fuzzy match for court: "${courtName}" → "${matchedName}" (${bestScore.toFixed(1)}%)`);
        return bestMatch;
      }
    }

    console.log(`⚠️ No match for court "${courtName}" (best: ${bestScore.toFixed(1)}%)`);
    return null;
  }, []);

  // Initialize from initialValues or caseId
  useEffect(() => {
    if (hasInitializedRef.current || !countries.length) return;

    const initialize = async () => {
      // Load from caseId if provided
      if (caseId) {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.jurisdiction) {
            const { country: countryName, jurisdiction: jurisdictionName, court: courtName } = json.data.jurisdiction;

            const matchedCountry = matchCountry(countries, { country: countryName || undefined });
            if (matchedCountry) {
              setCountry(matchedCountry.name);
              setCountryId(matchedCountry.id);
              if (jurisdictionName) setJurisdiction(jurisdictionName);
              if (courtName) setCourt(courtName);
            } else if (countryName) {
              setCountry("__other__");
              setCustomCountry(countryName);
              if (jurisdictionName) {
                setJurisdiction("__other__");
                setCustomJurisdiction(jurisdictionName);
              }
              if (courtName) {
                setCourt("__other__");
                setCustomCourt(courtName);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch case data:", error);
        } finally {
          setIsLoading(false);
        }

        // In caseId mode, we consider initialization complete after the fetch attempt
        hasInitializedRef.current = true;
      }
      // Load from initialValues
      else if (
        initialValues &&
        (initialValues.country ||
          initialValues.country_code ||
          initialValues.jurisdiction ||
          initialValues.jurisdiction_code ||
          initialValues.court_name)
      ) {
        const matchedCountry = matchCountry(countries, initialValues);

        if (matchedCountry) {
          setCountry(matchedCountry.name);
          setCountryId(matchedCountry.id);
          if (initialValues.jurisdiction) setJurisdiction(initialValues.jurisdiction);
          if (initialValues.court_name) setCourt(initialValues.court_name);
        } else if (initialValues.country) {
          setCountry("__other__");
          setCustomCountry(initialValues.country);
          if (initialValues.jurisdiction) {
            setJurisdiction("__other__");
            setCustomJurisdiction(initialValues.jurisdiction);
          }
          if (initialValues.court_name) {
            setCourt("__other__");
            setCustomCourt(initialValues.court_name);
          }
        }
        // Only mark initialized once we've actually applied non-empty initial values.
        // This prevents a first-run with empty initialValues from blocking later metadata.
        hasInitializedRef.current = true;
      }
    };

    initialize();
  }, [countries, caseId, initialValues, matchCountry]);

  // Match jurisdiction when jurisdictions load (prioritize code matching)
  useEffect(() => {
    if (!jurisdictions.length) return;
    if (jurisdiction === "__other__") return;

    // Allow code-only initialValues to populate even if `jurisdiction` hasn't been set yet
    if (!jurisdiction && !initialValues?.jurisdiction_code) return;

    // Only try to match if we have initialValues with code or name
    if (!initialValues?.jurisdiction_code && !initialValues?.jurisdiction) return;

    console.log("🔍 Attempting to match jurisdiction with:", {
      code: initialValues?.jurisdiction_code,
      name: initialValues?.jurisdiction,
      currentJurisdiction: jurisdiction
    });

    const matchedJurisdiction = matchJurisdiction(jurisdictions, initialValues);

    if (matchedJurisdiction && matchedJurisdiction.name) {
      if (matchedJurisdiction.name !== jurisdiction) {
        console.log("🔄 Updating jurisdiction:", jurisdiction, "→", matchedJurisdiction.name);
        setJurisdiction(matchedJurisdiction.name);
      }
      setJurisdictionId(matchedJurisdiction.id);
    } else {
      // No match found, move to "Other"
      console.log(`⚠️ Jurisdiction "${jurisdiction}" not found in dropdown, moving to "Other"`);
      setJurisdiction("__other__");
      setCustomJurisdiction(jurisdiction);
    }
  }, [jurisdictions, initialValues?.jurisdiction_code, initialValues?.jurisdiction, matchJurisdiction]);

  // Match court when courts load
  useEffect(() => {
    if (!courts.length || !court || court === "__other__") return;

    const courtName = initialValues?.court_name || court;
    const matchedCourt = matchCourt(courts, courtName);

    if (matchedCourt && matchedCourt.name) {
      setCourt(matchedCourt.name);
    } else {
      setCourt("__other__");
      setCustomCourt(courtName);
    }
  }, [courts, initialValues, matchCourt]);

  // Notify parent of country changes
  useEffect(() => {
    if (countryId && onCountryChange) {
      onCountryChange(countryId);
    }
  }, [countryId, onCountryChange]);

  // Handle changes
  const handleCountryChange = useCallback((selectedCountryName: string) => {
    hasUserInteractedRef.current = true;
    setCountry(selectedCountryName);
    setJurisdiction("");
    setJurisdictionId("");
    setCourt("");
    setCustomJurisdiction("");
    setCustomCourt("");

    if (selectedCountryName === "__other__") {
      setCountryId("");
      setCustomCountry("");
    } else {
      const selected = countries.find((c) => c.name === selectedCountryName);
      if (selected) {
        setCountryId(selected.id);
      }
      setCustomCountry("");
    }
  }, [countries]);

  const handleJurisdictionChange = useCallback((selectedJurisdictionName: string) => {
    hasUserInteractedRef.current = true;
    setJurisdiction(selectedJurisdictionName);
    setCourt("");
    setCustomCourt("");

    if (selectedJurisdictionName === "__other__") {
      setJurisdictionId("");
      setCustomJurisdiction("");
    } else {
      const selected = jurisdictions.find((j) => j.name === selectedJurisdictionName);
      if (selected) {
        setJurisdictionId(selected.id);
        if (onJurisdictionChange) {
          onJurisdictionChange(selected.id);
        }
      }
      setCustomJurisdiction("");
    }
  }, [jurisdictions, onJurisdictionChange]);

  const handleCourtChange = useCallback((selectedCourtName: string) => {
    hasUserInteractedRef.current = true;
    setCourt(selectedCourtName);
    if (selectedCourtName !== "__other__") {
      setCustomCourt("");
    }
  }, []);

  // Get final values
  const getFinalValue = useCallback((selectedValue: string, customValue: string) => {
    return selectedValue === "__other__" ? customValue : selectedValue;
  }, []);

  // Prepare dropdown options
  const countryOptions = useMemo(() =>
    countries.map((c) => ({ value: c.name, label: c.name })),
    [countries]
  );

  const jurisdictionOptions = useMemo(() =>
    Array.from(new Set(jurisdictions.map((j) => j.name).filter((n): n is string => Boolean(n)))),
    [jurisdictions]
  );

  const courtOptions = useMemo(() =>
    Array.from(new Set(courts.map((c) => c.name).filter((n): n is string => Boolean(n)))),
    [courts]
  );

  const initialCountryCode = useMemo(
    () => initialValues?.country_code?.trim() || "",
    [initialValues?.country_code]
  );
  const initialJurisdictionCode = useMemo(
    () => initialValues?.jurisdiction_code?.trim() || "",
    [initialValues?.jurisdiction_code]
  );

  const selectedCountryCode = useMemo(() => {
    if (!country || country === "__other__") return "";
    const byId = countries.find((c) => c.id === countryId);
    const byName = countries.find((c) => c.name === country);
    return (byId ?? byName)?.iso_code || "";
  }, [countries, country, countryId]);

  const selectedJurisdictionRawCode = useMemo(() => {
    if (!jurisdiction || jurisdiction === "__other__") return "";
    const byId = jurisdictions.find((j) => j.id === jurisdictionId);
    const byName = jurisdictions.find((j) => j.name === jurisdiction);
    return (byId ?? byName)?.code || "";
  }, [jurisdictions, jurisdiction, jurisdictionId]);

  const selectedJurisdictionCode = useMemo(() => {
    const jc = selectedJurisdictionRawCode?.trim();
    if (!jc) return "";
    const cc = (selectedCountryCode || initialCountryCode)?.trim();
    return cc ? `${cc}-${jc}` : jc;
  }, [initialCountryCode, selectedCountryCode, selectedJurisdictionRawCode]);

  // Track completion and notify parent
  useEffect(() => {
    const countryValue = getFinalValue(country, customCountry);
    const jurisdictionValue = getFinalValue(jurisdiction, customJurisdiction);
    const courtValue = getFinalValue(court, customCourt);
    const isComplete = !!(countryValue && jurisdictionValue && courtValue);

    // Notify completion change
    if (onCompletionChangeRef.current) {
      onCompletionChangeRef.current(isComplete);
    }

    // Notify data update
    if (onUpdateRef.current) {
      const hasAnyIncomingInitialValues =
        !!initialValues?.country ||
        !!initialValues?.country_code ||
        !!initialValues?.jurisdiction ||
        !!initialValues?.jurisdiction_code ||
        !!initialValues?.court_name;

      // Prevent wiping extracted metadata: if we have incoming initial values but we haven't applied them yet
      // (and the user hasn't interacted), skip emitting updates from the blank/default local state.
      if (hasAnyIncomingInitialValues && !hasInitializedRef.current && !hasUserInteractedRef.current) {
        return;
      }

      const countryCode = country === "__other__" ? "" : (selectedCountryCode || initialCountryCode);
      const jurisdictionCode =
        jurisdiction === "__other__" ? "" : (selectedJurisdictionCode || initialJurisdictionCode);

      const currentValues = JSON.stringify({
        country: countryValue,
        jurisdiction: jurisdictionValue,
        court_name: courtValue,
        country_code: countryCode,
        jurisdiction_code: jurisdictionCode,
      });

      if (currentValues !== lastUpdateRef.current) {
        lastUpdateRef.current = currentValues;
        onUpdateRef.current({
          country: countryValue,
          jurisdiction: jurisdictionValue,
          court_name: courtValue,
          country_code: countryCode,
          jurisdiction_code: jurisdictionCode,
        });
      }
    }
  }, [
    country,
    jurisdiction,
    court,
    customCountry,
    customJurisdiction,
    customCourt,
    getFinalValue,
    initialCountryCode,
    initialJurisdictionCode,
    initialValues?.country,
    initialValues?.jurisdiction,
    initialValues?.court_name,
    selectedCountryCode,
    selectedJurisdictionCode,
  ]);

  // Render
  return (
    <>
      <div className={`bg-white ${isCompact ? "p-3 sm:p-6" : "shadow-sm p-8"}`}>
        {/* Section Header */}
        {isCompact ? (
          <div className="flex items-start mb-3 sm:mb-4">
            <div className={`flex items-center justify-center ${isCompact ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10"} bg-primary-100 mr-2 sm:mr-3 flex-shrink-0`}>
              <svg className={`${isCompact ? "w-4 h-4 sm:w-5 sm:h-5" : "w-6 h-6"} text-primary-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-ink-900 flex items-center gap-2 flex-wrap">
                {t("stepTitle")} <span className="text-red-500">*</span>
                {showExtractedBadge && (
                  <div className="relative group">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 border border-primary-200 rounded-md cursor-help">
                      <svg className="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium text-primary-700">{t("extracted")}</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-ink-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                      {t("extractedTooltip")}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-ink-900"></div>
                      </div>
                    </div>
                  </div>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-ink-600">{t("whereHeard")}</p>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-2">{t("title")}</h2>
            <p className="text-ink-600">{t("description")}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        {isLoading || isLoadingCountries ? (
          <div className={`grid grid-cols-1 ${isCompact ? "md:grid-cols-4 gap-3" : "md:grid-cols-2 gap-6"} ${isCompact ? "mb-0" : "mb-8"}`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-surface-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${isCompact ? "md:grid-cols-4 gap-3" : "md:grid-cols-2 gap-6"} ${isCompact ? "mb-0" : "mb-8"}`}>
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t("country")} <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={countryOptions}
                value={country}
                onChange={handleCountryChange}
                placeholder={t("selectCountry")}
                allowOther
              />
              {country === "__other__" && (
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder={t("enterCountry")}
                  className="mt-2 w-full px-3 py-2 border border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-ink-900"
                />
              )}
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t("stateProvince")} <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={jurisdictionOptions.map((j) => ({ value: j, label: j }))}
                value={jurisdiction}
                onChange={handleJurisdictionChange}
                placeholder={t("selectStateProvince")}
                disabled={!countryId || isLoadingJurisdictions}
                allowOther
              />
              {jurisdiction === "__other__" && (
                <input
                  type="text"
                  value={customJurisdiction}
                  onChange={(e) => setCustomJurisdiction(e.target.value)}
                  placeholder={t("enterStateProvince")}
                  className="mt-2 w-full px-3 py-2 border border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-ink-900"
                />
              )}
            </div>

            {/* Court */}
            <div className={isCompact ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t("courtName")} <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={courtOptions.map((c) => ({ value: c, label: c }))}
                value={court}
                onChange={handleCourtChange}
                placeholder={t("selectCourt")}
                disabled={!jurisdictionId || isLoadingCourts}
                allowOther
              />
              {court === "__other__" && (
                <input
                  type="text"
                  value={customCourt}
                  onChange={(e) => setCustomCourt(e.target.value)}
                  placeholder={t("enterCourt")}
                  className="mt-2 w-full px-3 py-2 border border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-ink-900"
                />
              )}
            </div>
          </div>
        )}

      </div>
      {/* Save Button */}
      {
        !hideSaveButton && caseId && (
          <SaveCaseButton
            caseId={caseId}
            field="jurisdiction"
            value={{
              country: getFinalValue(country, customCountry),
              jurisdiction: getFinalValue(jurisdiction, customJurisdiction),
              court: getFinalValue(court, customCourt),
            }}
          />
        )
      }
    </>
  );
}
