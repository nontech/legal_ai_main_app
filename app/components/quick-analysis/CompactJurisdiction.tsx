"use client";

import { useState, useEffect } from "react";

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

interface CompactJurisdictionProps {
  onUpdate?: (data: {
    country: string;
    state: string;
    city: string;
    court: string;
    country_id?: string;
  }) => void;
  initialValues?: {
    country?: string;
    state?: string;
    city?: string;
    court?: string;
    country_id?: string;
  };
}

export default function CompactJurisdiction({
  onUpdate,
  initialValues = {},
}: CompactJurisdictionProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [country, setCountry] = useState(initialValues.country || "");
  const [countryId, setCountryId] = useState(initialValues.country_id || "");
  const [state, setState] = useState(initialValues.state || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [court, setCourt] = useState(initialValues.court || "");
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

  const handleCountryChange = (selectedCountryName: string) => {
    setCountry(selectedCountryName);
    const selected = countries.find(c => c.name === selectedCountryName);
    if (selected) {
      setCountryId(selected.id);
      // Notify parent with country_id
      if (onUpdate) {
        onUpdate({
          country: selectedCountryName,
          state,
          city,
          court,
          country_id: selected.id,
        });
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    const updates = { 
      country, 
      state, 
      city, 
      court,
      country_id: countryId,
    };
    updates[field as keyof typeof updates] = value;

    if (field === "country") setState(value);
    if (field === "state") setState(value);
    if (field === "city") setCity(value);
    if (field === "court") setCourt(value);

    if (onUpdate) {
      onUpdate({
        country,
        state: field === "state" ? value : state,
        city: field === "city" ? value : city,
        court: field === "court" ? value : court,
        country_id: countryId,
      });
    }
  };

  return (
    <div className="bg-surface-000 rounded-lg border border-border-200 p-3 sm:p-6">
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {error}
        </div>
      )}
      <div className="flex items-start mb-3 sm:mb-4">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label
            htmlFor="country"
            className="block text-xs font-semibold text-ink-600 mb-1.5"
          >
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={isLoadingCountries}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-xs font-semibold text-ink-600 mb-1.5"
          >
            State/Province
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => handleChange("state", e.target.value)}
            disabled={isLoadingJurisdictions || !countryId}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select state/province</option>
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

        <div>
          <label
            htmlFor="city"
            className="block text-xs font-semibold text-ink-600 mb-1.5"
          >
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={isLoadingJurisdictions || !countryId}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select city</option>
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

        <div>
          <label
            htmlFor="court"
            className="block text-xs font-semibold text-ink-600 mb-1.5"
          >
            Court
          </label>
          <select
            id="court"
            value={court}
            onChange={(e) => handleChange("court", e.target.value)}
            disabled={isLoadingJurisdictions || !countryId}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select court</option>
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
  );
}
