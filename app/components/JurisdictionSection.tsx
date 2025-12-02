"use client";

import { useState, useEffect } from "react";
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
}

export default function JurisdictionSection({
  caseId,
  onCompletionChange,
  onCountryChange,
  onJurisdictionChange,
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
  useEffect(() => {
    if (jurisdictions.length > 0 && state && state !== "__other__") {
      const stateExists = jurisdictions.some(
        (j) => j.state_province === state
      );
      if (!stateExists) {
        // State doesn't exist in options - move to "Other"
        setCustomState(state);
        setState("__other__");
      }
    }

    if (jurisdictions.length > 0 && city && city !== "__other__") {
      const cityExists = jurisdictions.some((j) => j.city === city);
      if (!cityExists) {
        setCustomCity(city);
        setCity("__other__");
      }
    }

    if (jurisdictions.length > 0 && court && court !== "__other__") {
      const courtExists = jurisdictions.some(
        (j) => j.court === court
      );
      if (!courtExists) {
        setCustomCourt(court);
        setCourt("__other__");
      }
    }
  }, [jurisdictions, state, city, court]);

  // Track completion
  useEffect(() => {
    if (onCompletionChange) {
      const countryValue =
        country === "__other__" ? customCountry : country;
      const stateValue = state === "__other__" ? customState : state;
      const cityValue = city === "__other__" ? customCity : city;
      const courtValue = court === "__other__" ? customCourt : court;
      const isComplete =
        countryValue && stateValue && cityValue && courtValue;
      onCompletionChange(!!isComplete);
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
    onCompletionChange,
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
    if (selectedCountryName === "__other__") {
      setCountryId("");
      // Clear dependent fields when switching to "Other"
      setState("");
      setCity("");
      setCourt("");
    } else {
      const selected = countries.find(
        (c) => c.name === selectedCountryName
      );
      if (selected) {
        setCountryId(selected.id);
      }
      // Clear custom value if switching from "Other"
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Section Header */}
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading || isLoadingCountries ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Form Fields in Two Rows - 2 fields per row */}
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
                    onChange={(e) => setCustomCountry(e.target.value)}
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
        </>
      )}
    </div>
  );
}
