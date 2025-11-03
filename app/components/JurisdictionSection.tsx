"use client";

import { useState, useEffect } from "react";
import SaveCaseButton from "./SaveCaseButton";

interface JurisdictionSectionProps {
  caseId?: string;
  onCompletionChange?: (isComplete: boolean) => void;
}

export default function JurisdictionSection({ caseId, onCompletionChange }: JurisdictionSectionProps) {
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [court, setCourt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(!!caseId);

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

      {isLoading ? (
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
                <input
                  id="country"
                  type="text"
                  list="countryList"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter or select country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
                />
                <datalist id="countryList">
                  <option value="United States of America" />
                  <option value="Canada" />
                  <option value="United Kingdom" />
                </datalist>
              </div>

              {/* State/Province Field */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  State/Province
                </label>
                <input
                  id="state"
                  type="text"
                  list="stateList"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter or select state"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
                />
                <datalist id="stateList">
                  <option value="Alabama" />
                  <option value="Alaska" />
                  <option value="Arizona" />
                  <option value="California" />
                  <option value="Florida" />
                  <option value="New York" />
                  <option value="Texas" />
                </datalist>
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
                <input
                  id="city"
                  type="text"
                  list="cityList"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter or select city"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
                />
                <datalist id="cityList">
                  <option value="Mobile" />
                  <option value="Birmingham" />
                  <option value="Montgomery" />
                  <option value="Huntsville" />
                </datalist>
              </div>

              {/* Court Field */}
              <div>
                <label
                  htmlFor="court"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Court
                </label>
                <input
                  id="court"
                  type="text"
                  list="courtList"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  placeholder="Enter or select court"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
                />
                <datalist id="courtList">
                  <option value="Southern District of Alabama" />
                  <option value="Northern District of Alabama" />
                  <option value="Middle District of Alabama" />
                </datalist>
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

