"use client";

import { useState } from "react";

interface CompactJurisdictionProps {
  onUpdate?: (data: {
    country: string;
    state: string;
    city: string;
    court: string;
  }) => void;
  initialValues?: {
    country?: string;
    state?: string;
    city?: string;
    court?: string;
  };
}

export default function CompactJurisdiction({
  onUpdate,
  initialValues = {},
}: CompactJurisdictionProps) {
  const [country, setCountry] = useState(initialValues.country || "");
  const [state, setState] = useState(initialValues.state || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [court, setCourt] = useState(initialValues.court || "");

  const handleChange = (field: string, value: string) => {
    const updates = { country, state, city, court };
    updates[field as keyof typeof updates] = value;

    if (field === "country") setCountry(value);
    if (field === "state") setState(value);
    if (field === "city") setCity(value);
    if (field === "court") setCourt(value);

    if (onUpdate) {
      onUpdate(updates);
    }
  };

  const countryOptions = [
    "United States of America",
    "Canada",
    "United Kingdom",
  ];

  const stateOptions = [
    "Alabama",
    "Alaska",
    "Arizona",
    "California",
    "Florida",
    "New York",
    "Texas",
  ];

  const cityOptions = [
    "Mobile",
    "Birmingham",
    "Montgomery",
    "Huntsville",
  ];

  const courtOptions = [
    "Southern District of Alabama",
    "Northern District of Alabama",
    "Middle District of Alabama",
  ];

  return (
    <div className="bg-surface-000 rounded-lg border border-border-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3">
          <svg
            className="w-5 h-5 text-primary-600"
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
        <div>
          <h3 className="text-lg font-bold text-ink-900">
            Step 1: Jurisdiction{" "}
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-ink-600">
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
            value={countryOptions.includes(country) ? country : country ? "Other" : ""}
            onChange={(e) => handleChange("country", e.target.value === "Other" ? "" : e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
          >
            <option value="">Select country</option>
            {countryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="Other">Other (enter manually)</option>
          </select>
          {country && !countryOptions.includes(country) && (
            <input
              type="text"
              value={country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="Enter country"
              className="mt-2 w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
              autoComplete="off"
            />
          )}
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
            value={stateOptions.includes(state) ? state : state ? "Other" : ""}
            onChange={(e) => handleChange("state", e.target.value === "Other" ? "" : e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
          >
            <option value="">Select state</option>
            {stateOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="Other">Other (enter manually)</option>
          </select>
          {state && !stateOptions.includes(state) && (
            <input
              type="text"
              value={state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="Enter state"
              className="mt-2 w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
              autoComplete="off"
            />
          )}
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
            value={cityOptions.includes(city) ? city : city ? "Other" : ""}
            onChange={(e) => handleChange("city", e.target.value === "Other" ? "" : e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
          >
            <option value="">Select city</option>
            {cityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="Other">Other (enter manually)</option>
          </select>
          {city && !cityOptions.includes(city) && (
            <input
              type="text"
              value={city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter city"
              className="mt-2 w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
            />
          )}
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
            value={courtOptions.includes(court) ? court : court ? "Other" : ""}
            onChange={(e) => handleChange("court", e.target.value === "Other" ? "" : e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
          >
            <option value="">Select court</option>
            {courtOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="Other">Other (enter manually)</option>
          </select>
          {court && !courtOptions.includes(court) && (
            <input
              type="text"
              value={court}
              onChange={(e) => handleChange("court", e.target.value)}
              placeholder="Enter court"
              className="mt-2 w-full px-3 py-2 text-sm border border-border-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-000 text-ink-900"
            />
          )}
        </div>
      </div>
    </div>
  );
}
