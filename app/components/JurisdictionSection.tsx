"use client";

import { useState, useEffect, useRef } from "react";
import SaveCaseButton from "./SaveCaseButton";
import SearchableSelect from "./ui/searchable-select";

interface Country {
  id: string;
  name: string;
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

interface JurisdictionSectionProps {
  caseId?: string;
  onCompletionChange?: (isComplete: boolean) => void;
  onCountryChange?: (countryId: string) => void;
  onJurisdictionChange?: (jurisdictionId: string) => void;
  // For Quick Analysis compact mode
  variant?: "full" | "compact";
  onUpdate?: (data: {
    country: string;
    jurisdiction: string;
    court: string;
    country_id: string;
    jurisdiction_id: string;
  }) => void;
  initialValues?: {
    country?: string;
    jurisdiction?: string;
    court?: string;
    country_id?: string;
    jurisdiction_id?: string;
  };
  hideSaveButton?: boolean;
  showExtractedBadge?: boolean;
}

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
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(
    []
  );
  const [courts, setCourts] = useState<Court[]>([]);
  const [country, setCountry] = useState<string>("");
  const [countryId, setCountryId] = useState<string>("");
  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [jurisdictionId, setJurisdictionId] = useState<string>("");
  const [court, setCourt] = useState<string>("");

  // Custom "Other" values
  const [customCountry, setCustomCountry] = useState<string>("");
  const [customJurisdiction, setCustomJurisdiction] =
    useState<string>("");
  const [customCourt, setCustomCourt] = useState<string>("");

  const [isLoading, setIsLoading] = useState(!!caseId);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingJurisdictions, setIsLoadingJurisdictions] =
    useState(false);
  const [isLoadingCourts, setIsLoadingCourts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to store callbacks to prevent infinite loops
  const onUpdateRef = useRef(onUpdate);
  const onCompletionChangeRef = useRef(onCompletionChange);
  const lastUpdateRef = useRef<string>("");
  const hasInitializedRef = useRef(false);
  const hasCheckedInitialValuesRef = useRef(false);

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

  // Fetch jurisdictions when country is selected
  useEffect(() => {
    if (!countryId) {
      setJurisdictions([]);
      return;
    }

    const fetchJurisdictions = async () => {
      try {
        setIsLoadingJurisdictions(true);
        const res = await fetch(
          `/api/admin/jurisdictions?country_id=${countryId}`
        );
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

  // Fetch courts when jurisdiction is selected
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

  // Initialize from initialValues if provided (for Quick Analysis)
  // Only initialize when we have actual data, not empty objects
  useEffect(() => {
    if (!initialValues || !countries.length || caseId) return;

    const {
      country,
      jurisdiction,
      court,
      country_id,
      jurisdiction_id,
    } = initialValues;
    const hasActualData = Boolean(country || jurisdiction || court);

    // Debug logging
    console.log("🔍 JurisdictionSection initialValues:", {
      hasActualData,
      hasInitialized: hasInitializedRef.current,
      initialValues,
    });

    // Only initialize if we have data AND haven't initialized yet
    if (hasActualData && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Reset the check flag so we can verify values when jurisdictions load
      hasCheckedInitialValuesRef.current = false;
      console.log(
        "✅ Initializing JurisdictionSection with:",
        initialValues
      );

      if (country) {
        const selectedCountry = countries.find(
          (c) => c.name === country
        );
        if (selectedCountry) {
          setCountry(country);
          setCountryId(selectedCountry.id);
          // Set jurisdiction/court - they will be validated when jurisdictions load
          if (jurisdiction) setJurisdiction(jurisdiction);
          if (court) setCourt(court);
        } else {
          setCountry("__other__");
          setCustomCountry(country);
          // If country is "Other", move dependent fields to "Other" too
          if (jurisdiction) {
            setJurisdiction("__other__");
            setCustomJurisdiction(jurisdiction);
          }
          if (court) {
            setCourt("__other__");
            setCustomCourt(court);
          }
        }
      } else if (country_id) {
        // If we have country_id but no country name, set it directly
        setCountryId(country_id);
        if (jurisdiction_id) setJurisdictionId(jurisdiction_id);
        if (jurisdiction) setJurisdiction(jurisdiction);
        if (court) setCourt(court);
      }
    }
  }, [initialValues, countries, caseId]);

  // Fetch case data if caseId exists
  useEffect(() => {
    if (caseId && countries.length > 0) {
      const fetchCaseData = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.jurisdiction) {
            const { country, jurisdiction, court } =
              json.data.jurisdiction;

            // Handle country - check if it exists in predefined list
            if (country) {
              const selectedCountry = countries.find(
                (c) => c.name === country
              );
              if (selectedCountry) {
                setCountry(country);
                setCountryId(selectedCountry.id);
                // Will check jurisdiction/court against jurisdictions when they load
                setJurisdiction(jurisdiction || "");
                setCourt(court || "");
              } else {
                // Country not in list - use "Other"
                // Also move jurisdiction/court to custom fields immediately
                setCountry("__other__");
                setCustomCountry(country);

                if (jurisdiction) {
                  setJurisdiction("__other__");
                  setCustomJurisdiction(jurisdiction);
                }
                if (court) {
                  setCourt("__other__");
                  setCustomCourt(court);
                }
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch case data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCaseData();
    } else if (!caseId) {
      setIsLoading(false);
    }
  }, [caseId, countries]);

  // Check if saved values match predefined options when jurisdictions load
  // Only check once when jurisdictions first load, not on every state change
  useEffect(() => {
    // Only check if we have jurisdictions and haven't checked initial values yet
    if (
      jurisdictions.length === 0 ||
      hasCheckedInitialValuesRef.current
    ) {
      return;
    }

    // Helper function for case-insensitive, trimmed comparison
    const matches = (
      value1: string,
      value2: string | null | undefined
    ): boolean => {
      if (!value1 || !value2) return false;
      return (
        value1.trim().toLowerCase() === value2.trim().toLowerCase()
      );
    };

    let needsUpdate = false;
    let newJurisdiction = jurisdiction;
    let newCustomJurisdiction = customJurisdiction;

    // Check jurisdiction
    if (jurisdiction && jurisdiction !== "__other__") {
      const jurisdictionExists = jurisdictions.some((j) =>
        matches(jurisdiction, j.name)
      );
      if (!jurisdictionExists) {
        console.log(
          `⚠️ Jurisdiction "${jurisdiction}" not found in jurisdictions, moving to "Other"`
        );
        newCustomJurisdiction = jurisdiction;
        newJurisdiction = "__other__";
        needsUpdate = true;
      } else {
        // Find the exact match to use the database value (handles case/whitespace differences)
        const matchedJurisdiction = jurisdictions.find((j) =>
          matches(jurisdiction, j.name)
        );
        if (
          matchedJurisdiction &&
          matchedJurisdiction.name &&
          matchedJurisdiction.name !== jurisdiction
        ) {
          console.log(
            `🔄 Normalizing jurisdiction: "${jurisdiction}" → "${matchedJurisdiction.name}"`
          );
          newJurisdiction = matchedJurisdiction.name;
          // Also set jurisdiction ID
          setJurisdictionId(matchedJurisdiction.id);
          needsUpdate = true;
        }
      }
    }

    // Apply updates in a single batch to avoid multiple re-renders
    if (needsUpdate) {
      if (newJurisdiction !== jurisdiction)
        setJurisdiction(newJurisdiction);
      if (newCustomJurisdiction !== customJurisdiction)
        setCustomJurisdiction(newCustomJurisdiction);
    }

    // Mark as checked
    hasCheckedInitialValuesRef.current = true;
  }, [jurisdictions]); // Only depend on jurisdictions, not state/city/court

  // Keep refs up to date
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onCompletionChangeRef.current = onCompletionChange;
  }, [onUpdate, onCompletionChange]);

  // Track completion and notify parent (for both modes)
  useEffect(() => {
    const countryValue =
      country === "__other__" ? customCountry : country;
    const jurisdictionValue =
      jurisdiction === "__other__"
        ? customJurisdiction
        : jurisdiction;
    const courtValue = court === "__other__" ? customCourt : court;
    const isComplete =
      countryValue && jurisdictionValue && courtValue;

    if (onCompletionChangeRef.current) {
      onCompletionChangeRef.current(!!isComplete);
    }

    // For Quick Analysis mode - only call if values actually changed
    if (onUpdateRef.current) {
      const currentValues = JSON.stringify({
        country: countryValue,
        jurisdiction: jurisdictionValue,
        court: courtValue,
        country_id: countryId,
        jurisdiction_id: jurisdictionId,
      });

      // Only call onUpdate if values actually changed
      if (currentValues !== lastUpdateRef.current) {
        lastUpdateRef.current = currentValues;
        onUpdateRef.current({
          country: countryValue,
          jurisdiction: jurisdictionValue,
          court: courtValue,
          country_id: countryId,
          jurisdiction_id: jurisdictionId,
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
    countryId,
    jurisdictionId,
  ]);

  // Notify parent of country change
  useEffect(() => {
    if (onCountryChange && countryId) {
      onCountryChange(countryId);
    }
  }, [countryId, onCountryChange]);

  // Jurisdiction change is now handled in handleJurisdictionChange

  const handleCountryChange = (selectedCountryName: string) => {
    setCountry(selectedCountryName);

    // Always clear dependent fields when country changes
    setJurisdiction("");
    setJurisdictionId("");
    setCourt("");
    setCustomJurisdiction("");
    setCustomCourt("");

    // Reset the check flag so we re-check values when new jurisdictions load
    hasCheckedInitialValuesRef.current = false;

    if (selectedCountryName === "__other__") {
      setCountryId("");
      setCustomCountry("");
    } else {
      const selected = countries.find(
        (c) => c.name === selectedCountryName
      );
      if (selected) {
        setCountryId(selected.id);
      }
      // Clear custom country value when switching to predefined country
      setCustomCountry("");
    }
  };

  const handleJurisdictionChange = (
    selectedJurisdictionName: string
  ) => {
    setJurisdiction(selectedJurisdictionName);

    // Clear court when jurisdiction changes
    setCourt("");
    setCustomCourt("");

    if (selectedJurisdictionName === "__other__") {
      setJurisdictionId("");
      setCustomJurisdiction("");
    } else {
      const selected = jurisdictions.find(
        (j) => j.name === selectedJurisdictionName
      );
      if (selected) {
        setJurisdictionId(selected.id);
        // Notify parent of jurisdiction change
        if (onJurisdictionChange) {
          onJurisdictionChange(selected.id);
        }
      }
      // Clear custom jurisdiction value when switching to predefined jurisdiction
      setCustomJurisdiction("");
    }
  };

  // Get final values for saving
  const getFinalValue = (
    selectedValue: string,
    customValue: string
  ) => {
    return selectedValue === "__other__"
      ? customValue
      : selectedValue;
  };

  // Prepare options for SearchableSelect
  const countryOptions = countries.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const jurisdictionOptions = Array.from(
    new Set(jurisdictions.map((j) => j.name).filter(Boolean))
  ).map((name) => ({ value: name!, label: name! }));

  const courtOptions = Array.from(
    new Set(courts.map((c) => c.name).filter(Boolean))
  ).map((name) => ({ value: name!, label: name! }));

  const isCompact = variant === "compact";

  return (
    <div
      className={`bg-white ${
        isCompact ? "p-3 sm:p-6" : "shadow-sm p-8"
      }`}
    >
      {/* Section Header */}
      {isCompact ? (
        <div className="flex items-start mb-3 sm:mb-4">
          <div
            className={`flex items-center justify-center ${
              isCompact ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10"
            } bg-primary-100 mr-2 sm:mr-3 flex-shrink-0`}
          >
            <svg
              className={`${
                isCompact ? "w-4 h-4 sm:w-5 sm:h-5" : "w-6 h-6"
              } text-primary-600`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-ink-900 flex items-center gap-2 flex-wrap">
              Step 1: Jurisdiction{" "}
              <span className="text-red-500">*</span>
              {showExtractedBadge && (
                <div className="relative group">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 border border-primary-200 rounded-md cursor-help">
                    <svg
                      className="w-3 h-3 text-primary-600"
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
                    <span className="text-xs font-medium text-primary-700">
                      Extracted
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-ink-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                    Extracted from case information documents
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-ink-900"></div>
                    </div>
                  </div>
                </div>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-ink-600">
              Where your case will be heard
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-3">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Select Jurisdiction
            </h2>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Choose the location where your case will be filed or is
            currently being heard.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading || isLoadingCountries ? (
        <div
          className={`grid grid-cols-1 ${
            isCompact
              ? "md:grid-cols-4 gap-3"
              : "md:grid-cols-2 gap-6"
          } ${isCompact ? "mb-0" : "mb-8"}`}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Form Fields */}
          {isCompact ? (
            /* Compact Layout - 4 columns */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Country Field */}
              <div>
                <SearchableSelect
                  options={countryOptions}
                  value={country}
                  onChange={handleCountryChange}
                  placeholder="Select country"
                  allowOther={true}
                  otherLabel="Other (specify)"
                />
                {country === "__other__" && (
                  <input
                    type="text"
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    placeholder="Enter country name"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                )}
              </div>

              {/* Jurisdiction Field */}
              <div>
                <SearchableSelect
                  options={jurisdictionOptions}
                  value={jurisdiction}
                  onChange={handleJurisdictionChange}
                  placeholder="Select jurisdiction"
                  disabled={
                    isLoadingJurisdictions ||
                    (!countryId && country !== "__other__")
                  }
                  allowOther={true}
                  otherLabel="Other (specify)"
                />
                {jurisdiction === "__other__" && (
                  <input
                    type="text"
                    value={customJurisdiction}
                    onChange={(e) =>
                      setCustomJurisdiction(e.target.value)
                    }
                    placeholder="Enter jurisdiction"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                )}
              </div>

              {/* Court Field */}
              <div>
                <SearchableSelect
                  options={courtOptions}
                  value={court}
                  onChange={setCourt}
                  placeholder="Select court"
                  disabled={
                    isLoadingCourts ||
                    (!jurisdictionId && jurisdiction !== "__other__")
                  }
                  allowOther={true}
                  otherLabel="Other (specify)"
                />
                {court === "__other__" && (
                  <input
                    type="text"
                    value={customCourt}
                    onChange={(e) => setCustomCourt(e.target.value)}
                    placeholder="Enter court name"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                )}
              </div>
            </div>
          ) : (
            /* Full Layout - 2 rows with 2 columns each */
            <div className="space-y-6 mb-8">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country Field */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Country
                  </label>
                  <SearchableSelect
                    options={countryOptions}
                    value={country}
                    onChange={handleCountryChange}
                    placeholder="Select a country"
                    allowOther={true}
                    otherLabel="Other (specify)"
                  />
                  {country === "__other__" && (
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) =>
                        setCustomCountry(e.target.value)
                      }
                      placeholder="Enter country name"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  )}
                </div>

                {/* Jurisdiction Field */}
                <div>
                  <label
                    htmlFor="jurisdiction"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Jurisdiction
                  </label>
                  <SearchableSelect
                    options={jurisdictionOptions}
                    value={jurisdiction}
                    onChange={handleJurisdictionChange}
                    placeholder="Select a jurisdiction"
                    disabled={
                      isLoadingJurisdictions ||
                      (!countryId && country !== "__other__")
                    }
                    allowOther={true}
                    otherLabel="Other (specify)"
                  />
                  {jurisdiction === "__other__" && (
                    <input
                      type="text"
                      value={customJurisdiction}
                      onChange={(e) =>
                        setCustomJurisdiction(e.target.value)
                      }
                      placeholder="Enter jurisdiction"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  )}
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Court Field */}
                <div>
                  <label
                    htmlFor="court"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Court
                  </label>
                  <SearchableSelect
                    options={courtOptions}
                    value={court}
                    onChange={setCourt}
                    placeholder="Select a court"
                    disabled={
                      isLoadingCourts ||
                      (!jurisdictionId &&
                        jurisdiction !== "__other__")
                    }
                    allowOther={true}
                    otherLabel="Other (specify)"
                  />
                  {court === "__other__" && (
                    <input
                      type="text"
                      value={customCourt}
                      onChange={(e) => setCustomCourt(e.target.value)}
                      placeholder="Enter court name"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {!hideSaveButton && caseId && (
            <SaveCaseButton
              caseId={caseId}
              field="jurisdiction"
              value={{
                country: getFinalValue(country, customCountry),
                jurisdiction: getFinalValue(
                  jurisdiction,
                  customJurisdiction
                ),
                court: getFinalValue(court, customCourt),
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
