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
  state_province: string | null;
  city: string | null;
  court: string | null;
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
    state: string;
    city: string;
    court: string;
    country_id: string;
  }) => void;
  initialValues?: {
    country?: string;
    state?: string;
    city?: string;
    court?: string;
    country_id?: string;
  };
  hideSaveButton?: boolean;
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
}: JurisdictionSectionProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(
    []
  );
  const [country, setCountry] = useState<string>("");
  const [countryId, setCountryId] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [court, setCourt] = useState<string>("");

  // Custom "Other" values
  const [customCountry, setCustomCountry] = useState<string>("");
  const [customState, setCustomState] = useState<string>("");
  const [customCity, setCustomCity] = useState<string>("");
  const [customCourt, setCustomCourt] = useState<string>("");

  const [isLoading, setIsLoading] = useState(!!caseId);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingJurisdictions, setIsLoadingJurisdictions] =
    useState(false);
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

  // Initialize from initialValues if provided (for Quick Analysis)
  // Only initialize when we have actual data, not empty objects
  useEffect(() => {
    if (!initialValues || !countries.length || caseId) return;

    const { country, state, city, court, country_id } = initialValues;
    const hasActualData = Boolean(country || state || city || court);

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
          // Set state/city/court - they will be validated when jurisdictions load
          if (state) setState(state);
          if (city) setCity(city);
          if (court) setCourt(court);
        } else {
          setCountry("__other__");
          setCustomCountry(country);
          // If country is "Other", move dependent fields to "Other" too
          if (state) {
            setState("__other__");
            setCustomState(state);
          }
          if (city) {
            setCity("__other__");
            setCustomCity(city);
          }
          if (court) {
            setCourt("__other__");
            setCustomCourt(court);
          }
        }
      } else if (country_id) {
        // If we have country_id but no country name, set it directly
        setCountryId(country_id);
        if (state) setState(state);
        if (city) setCity(city);
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
            const { country, state, city, court } =
              json.data.jurisdiction;

            // Handle country - check if it exists in predefined list
            if (country) {
              const selectedCountry = countries.find(
                (c) => c.name === country
              );
              if (selectedCountry) {
                setCountry(country);
                setCountryId(selectedCountry.id);
                // Will check state/city/court against jurisdictions when they load
                setState(state || "");
                setCity(city || "");
                setCourt(court || "");
              } else {
                // Country not in list - use "Other"
                // Also move state/city/court to custom fields immediately
                setCountry("__other__");
                setCustomCountry(country);

                if (state) {
                  setState("__other__");
                  setCustomState(state);
                }
                if (city) {
                  setCity("__other__");
                  setCustomCity(city);
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
    let newState = state;
    let newCity = city;
    let newCourt = court;
    let newCustomState = customState;
    let newCustomCity = customCity;
    let newCustomCourt = customCourt;

    // Check state
    if (state && state !== "__other__") {
      const stateExists = jurisdictions.some((j) =>
        matches(state, j.state_province)
      );
      if (!stateExists) {
        console.log(
          `⚠️ State "${state}" not found in jurisdictions, moving to "Other"`
        );
        newCustomState = state;
        newState = "__other__";
        needsUpdate = true;
      } else {
        // Find the exact match to use the database value (handles case/whitespace differences)
        const matchedJurisdiction = jurisdictions.find((j) =>
          matches(state, j.state_province)
        );
        if (
          matchedJurisdiction &&
          matchedJurisdiction.state_province &&
          matchedJurisdiction.state_province !== state
        ) {
          console.log(
            `🔄 Normalizing state: "${state}" → "${matchedJurisdiction.state_province}"`
          );
          newState = matchedJurisdiction.state_province;
          needsUpdate = true;
        }
      }
    }

    // Check city
    if (city && city !== "__other__") {
      const cityExists = jurisdictions.some((j) =>
        matches(city, j.city)
      );
      if (!cityExists) {
        console.log(
          `⚠️ City "${city}" not found in jurisdictions, moving to "Other"`
        );
        newCustomCity = city;
        newCity = "__other__";
        needsUpdate = true;
      } else {
        // Find the exact match to use the database value
        const matchedJurisdiction = jurisdictions.find((j) =>
          matches(city, j.city)
        );
        if (
          matchedJurisdiction &&
          matchedJurisdiction.city &&
          matchedJurisdiction.city !== city
        ) {
          console.log(
            `🔄 Normalizing city: "${city}" → "${matchedJurisdiction.city}"`
          );
          newCity = matchedJurisdiction.city;
          needsUpdate = true;
        }
      }
    }

    // Check court
    if (court && court !== "__other__") {
      const courtExists = jurisdictions.some((j) =>
        matches(court, j.court)
      );
      if (!courtExists) {
        console.log(
          `⚠️ Court "${court}" not found in jurisdictions, moving to "Other"`
        );
        newCustomCourt = court;
        newCourt = "__other__";
        needsUpdate = true;
      } else {
        // Find the exact match to use the database value
        const matchedJurisdiction = jurisdictions.find((j) =>
          matches(court, j.court)
        );
        if (
          matchedJurisdiction &&
          matchedJurisdiction.court &&
          matchedJurisdiction.court !== court
        ) {
          console.log(
            `🔄 Normalizing court: "${court}" → "${matchedJurisdiction.court}"`
          );
          newCourt = matchedJurisdiction.court;
          needsUpdate = true;
        }
      }
    }

    // Apply updates in a single batch to avoid multiple re-renders
    if (needsUpdate) {
      if (newState !== state) setState(newState);
      if (newCity !== city) setCity(newCity);
      if (newCourt !== court) setCourt(newCourt);
      if (newCustomState !== customState)
        setCustomState(newCustomState);
      if (newCustomCity !== customCity) setCustomCity(newCustomCity);
      if (newCustomCourt !== customCourt)
        setCustomCourt(newCustomCourt);
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
    const stateValue = state === "__other__" ? customState : state;
    const cityValue = city === "__other__" ? customCity : city;
    const courtValue = court === "__other__" ? customCourt : court;
    const isComplete =
      countryValue && stateValue && cityValue && courtValue;

    if (onCompletionChangeRef.current) {
      onCompletionChangeRef.current(!!isComplete);
    }

    // For Quick Analysis mode - only call if values actually changed
    if (onUpdateRef.current) {
      const currentValues = JSON.stringify({
        country: countryValue,
        state: stateValue,
        city: cityValue,
        court: courtValue,
        country_id: countryId,
      });

      // Only call onUpdate if values actually changed
      if (currentValues !== lastUpdateRef.current) {
        lastUpdateRef.current = currentValues;
        onUpdateRef.current({
          country: countryValue,
          state: stateValue,
          city: cityValue,
          court: courtValue,
          country_id: countryId,
        });
      }
    }
  }, [
    country,
    state,
    city,
    court,
    customCountry,
    customState,
    customCity,
    customCourt,
    countryId,
  ]);

  // Notify parent of country change
  useEffect(() => {
    if (onCountryChange && countryId) {
      onCountryChange(countryId);
    }
  }, [countryId, onCountryChange]);

  // Notify parent of jurisdiction change
  useEffect(() => {
    if (
      onJurisdictionChange &&
      state &&
      city &&
      court &&
      jurisdictions.length > 0
    ) {
      // Find the jurisdiction that matches the selected state, city, and court
      const stateValue = state === "__other__" ? customState : state;
      const cityValue = city === "__other__" ? customCity : city;
      const courtValue = court === "__other__" ? customCourt : court;

      const matchingJurisdiction = jurisdictions.find(
        (j) =>
          j.state_province === stateValue &&
          j.city === cityValue &&
          j.court === courtValue
      );
      if (matchingJurisdiction) {
        onJurisdictionChange(matchingJurisdiction.id);
      }
    }
  }, [
    state,
    city,
    court,
    customState,
    customCity,
    customCourt,
    jurisdictions,
    onJurisdictionChange,
  ]);

  const handleCountryChange = (selectedCountryName: string) => {
    setCountry(selectedCountryName);

    // Always clear dependent fields when country changes
    setState("");
    setCity("");
    setCourt("");
    setCustomState("");
    setCustomCity("");
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

  const stateOptions = Array.from(
    new Set(
      jurisdictions.map((j) => j.state_province).filter(Boolean)
    )
  ).map((s) => ({ value: s!, label: s! }));

  const cityOptions = Array.from(
    new Set(
      jurisdictions
        .filter(
          (j) =>
            !state ||
            state === "__other__" ||
            j.state_province === state
        )
        .map((j) => j.city)
        .filter(Boolean)
    )
  ).map((c) => ({ value: c!, label: c! }));

  const courtOptions = Array.from(
    new Set(
      jurisdictions
        .filter(
          (j) =>
            (!state ||
              state === "__other__" ||
              j.state_province === state) &&
            (!city || city === "__other__" || j.city === city)
        )
        .map((j) => j.court)
        .filter(Boolean)
    )
  ).map((c) => ({ value: c!, label: c! }));

  const isCompact = variant === "compact";

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${
        isCompact ? "p-3 sm:p-6" : "shadow-sm p-8"
      }`}
    >
      {/* Section Header */}
      {isCompact ? (
        <div className="flex items-start mb-3 sm:mb-4">
          <div
            className={`flex items-center justify-center ${
              isCompact ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10"
            } bg-primary-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0`}
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
            <h3 className="text-base sm:text-lg font-bold text-ink-900">
              Step 1: Jurisdiction{" "}
              <span className="text-red-500">*</span>
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

              {/* State/Province Field */}
              <div>
                <SearchableSelect
                  options={stateOptions}
                  value={state}
                  onChange={setState}
                  placeholder="Select state/province"
                  disabled={
                    isLoadingJurisdictions ||
                    (!countryId && country !== "__other__")
                  }
                  allowOther={true}
                  otherLabel="Other (specify)"
                />
                {state === "__other__" && (
                  <input
                    type="text"
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="Enter state/province"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                )}
              </div>

              {/* City Field */}
              <div>
                <SearchableSelect
                  options={cityOptions}
                  value={city}
                  onChange={setCity}
                  placeholder="Select city"
                  disabled={
                    isLoadingJurisdictions ||
                    (!countryId && country !== "__other__")
                  }
                  allowOther={true}
                  otherLabel="Other (specify)"
                />
                {city === "__other__" && (
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Enter city name"
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
                    isLoadingJurisdictions ||
                    (!countryId && country !== "__other__")
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

                {/* State/Province Field */}
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    State/Province
                  </label>
                  <SearchableSelect
                    options={stateOptions}
                    value={state}
                    onChange={setState}
                    placeholder="Select a state/province"
                    disabled={
                      isLoadingJurisdictions ||
                      (!countryId && country !== "__other__")
                    }
                    allowOther={true}
                    otherLabel="Other (specify)"
                  />
                  {state === "__other__" && (
                    <input
                      type="text"
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      placeholder="Enter state/province"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  )}
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City Field */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    City
                  </label>
                  <SearchableSelect
                    options={cityOptions}
                    value={city}
                    onChange={setCity}
                    placeholder="Select a city"
                    disabled={
                      isLoadingJurisdictions ||
                      (!countryId && country !== "__other__")
                    }
                    allowOther={true}
                    otherLabel="Other (specify)"
                  />
                  {city === "__other__" && (
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Enter city name"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  )}
                </div>

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
                      isLoadingJurisdictions ||
                      (!countryId && country !== "__other__")
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
                state: getFinalValue(state, customState),
                city: getFinalValue(city, customCity),
                court: getFinalValue(court, customCourt),
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
