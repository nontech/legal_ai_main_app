"use client";

import { useState } from "react";

interface CompactJurisdictionProps {
  onUpdate?: (data: {
    country: string;
    state: string;
    city: string;
    court: string;
  }) => void;
}

export default function CompactJurisdiction({
  onUpdate,
}: CompactJurisdictionProps) {
  const [country, setCountry] = useState("United States of America");
  const [state, setState] = useState("Alabama");
  const [city, setCity] = useState("Mobile");
  const [court, setCourt] = useState("Southern District of Alabama");

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mr-3">
          <svg
            className="w-5 h-5 text-gray-700"
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
          <h3 className="text-lg font-bold text-gray-900">
            Step 1: Jurisdiction{" "}
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600">
            Where your case will be heard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="United States of America">
              United States of America
            </option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>

        {/* State/Province */}
        <div>
          <label
            htmlFor="state"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            State/Province
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="Alabama">Alabama</option>
            <option value="Alaska">Alaska</option>
            <option value="Arizona">Arizona</option>
            <option value="California">California</option>
            <option value="Florida">Florida</option>
            <option value="New York">New York</option>
            <option value="Texas">Texas</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="Mobile">Mobile</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Montgomery">Montgomery</option>
            <option value="Huntsville">Huntsville</option>
          </select>
        </div>

        {/* Court */}
        <div>
          <label
            htmlFor="court"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Court
          </label>
          <select
            id="court"
            value={court}
            onChange={(e) => handleChange("court", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="Southern District of Alabama">
              Southern District of Alabama
            </option>
            <option value="Northern District of Alabama">
              Northern District of Alabama
            </option>
            <option value="Middle District of Alabama">
              Middle District of Alabama
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
