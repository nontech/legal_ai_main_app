"use client";

import { useState, useEffect } from "react";
import SaveCaseButton from "./SaveCaseButton";

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

export default function JurisdictionSection({ caseId, onCompletionChange, onCountryChange, onJurisdictionChange }: JurisdictionSectionProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [country, setCountry] = useState<string>("");
  const [countryId, setCountryId] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [court, setCourt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(!!caseId);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingJurisdictions, setIsLoadingJurisdictions] = useState(false);
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

  // Fetch case data if caseId exists
  useEffect(() => {
    if (caseId) {
      const fetchCaseData = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.jurisdiction) {
            const { country, state, city, court } = json.data.jurisdiction;
            setCountry(country || "");
            setState(state || "");
            setCity(city || "");
            setCourt(court || "");
          }
        } catch (error) {
          console.error("Failed to fetch case data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCaseData();
    } else {
      setIsLoading(false);
    }
  }, [caseId]);

  // Track completion
  useEffect(() => {
    if (onCompletionChange) {
      const isComplete = country && state && city && court;
      onCompletionChange(!!isComplete);
    }
  }, [country, state, city, court, onCompletionChange]);

  // Notify parent of country change
  useEffect(() => {
    if (onCountryChange && countryId) {
      onCountryChange(countryId);
    }
  }, [countryId, onCountryChange]);

  // Notify parent of jurisdiction change
  useEffect(() => {
    if (onJurisdictionChange && state && city && court && jurisdictions.length > 0) {
      // Find the jurisdiction that matches the selected state, city, and court
      const matchingJurisdiction = jurisdictions.find(
        j => j.state_province === state && j.city === city && j.court === court
      );
      if (matchingJurisdiction) {
        onJurisdictionChange(matchingJurisdiction.id);
      }
    }
  }, [state, city, court, jurisdictions, onJurisdictionChange]);

  const handleCountryChange = (selectedCountryName: string) => {
    setCountry(selectedCountryName);
    const selected = countries.find(c => c.name === selectedCountryName);
    if (selected) {
      setCountryId(selected.id);
    }
  };

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
                <select
                  id="country"
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
                >
                  <option value="">Select a country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State/Province Field */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  State/Province
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isLoadingJurisdictions || !countryId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a state/province</option>
                  {jurisdictions && jurisdictions.length > 0 ? (
                    [...new Set(jurisdictions.map(j => j.state_province))].map((state_prov) => (
                      state_prov && (
                        <option key={state_prov} value={state_prov}>
                          {state_prov}
                        </option>
                      )
                    ))
                  ) : (
                    <option disabled>No states available</option>
                  )}
                </select>
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
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isLoadingJurisdictions || !countryId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a city</option>
                  {jurisdictions && jurisdictions.length > 0 ? (
                    jurisdictions
                      .filter(j => !state || j.state_province === state)
                      .map((j) => (
                        j.city && (
                          <option key={j.id} value={j.city}>
                            {j.city}
                          </option>
                        )
                      ))
                  ) : (
                    <option disabled>No cities available</option>
                  )}
                </select>
              </div>

              {/* Court Field */}
              <div>
                <label
                  htmlFor="court"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Court
                </label>
                <select
                  id="court"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  disabled={isLoadingJurisdictions || !countryId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a court</option>
                  {jurisdictions && jurisdictions.length > 0 ? (
                    jurisdictions
                      .filter(j => (!state || j.state_province === state) && (!city || j.city === city))
                      .map((j) => (
                        j.court && (
                          <option key={j.id} value={j.court}>
                            {j.court}
                          </option>
                        )
                      ))
                  ) : (
                    <option disabled>No courts available</option>
                  )}
                </select>
              </div>
            </div>
          </div>
          <SaveCaseButton
            caseId={caseId}
            field="jurisdiction"
            value={{ country, state, city, court }}
          />
        </>)}</div>
  );
}

