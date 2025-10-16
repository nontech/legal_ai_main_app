"use client";

import { useState } from "react";

type RoleType = "defendant" | "plaintiff";

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] =
    useState<RoleType>("plaintiff");

  const roles = {
    defendant: {
      title: "Defendant/Respondent",
      subtitle: "Party defending against legal action",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      responsibilities: [
        "Respond to claims",
        "Challenge evidence",
        "Raise defenses",
        "Present contradictory evidence",
        "Seek dismissal or reduced liability",
      ],
      strategicFocus: "Defending against claims",
    },
    plaintiff: {
      title: "Plaintiff/Petitioner",
      subtitle: "Party initiating the legal action",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      responsibilities: [
        "Initiate legal proceedings",
        "Bear burden of proof",
        "Present supporting evidence",
        "Challenge opposing arguments",
        "Seek requested relief",
      ],
      strategicFocus: "Building compelling case for relief",
    },
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mr-3">
              <svg
                className="w-6 h-6 text-amber-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Select Your Role
            </h2>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Your role determines the legal strategy, burden of proof,
            and analysis perspective for this tax case.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Defendant Card */}
          <button
            onClick={() => setSelectedRole("defendant")}
            className={`text-left p-6 rounded-lg border-2 transition-all ${
              selectedRole === "defendant"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start mb-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                  selectedRole === "defendant"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {roles.defendant.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {roles.defendant.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {roles.defendant.subtitle}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Key Responsibilities:
              </h4>
              <ul className="space-y-1">
                {roles.defendant.responsibilities.map(
                  (resp, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{resp}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">
                  Strategic Focus:
                </span>{" "}
                {roles.defendant.strategicFocus}
              </p>
            </div>
          </button>

          {/* Plaintiff Card */}
          <button
            onClick={() => setSelectedRole("plaintiff")}
            className={`text-left p-6 rounded-lg border-2 transition-all ${
              selectedRole === "plaintiff"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start mb-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                  selectedRole === "plaintiff"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {roles.plaintiff.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {roles.plaintiff.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {roles.plaintiff.subtitle}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Key Responsibilities:
              </h4>
              <ul className="space-y-1">
                {roles.plaintiff.responsibilities.map(
                  (resp, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{resp}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">
                  Strategic Focus:
                </span>{" "}
                {roles.plaintiff.strategicFocus}
              </p>
            </div>
          </button>
        </div>

        {/* Selected Role Summary */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">Selected Role:</span>{" "}
            {roles[selectedRole].title} - The analysis will be
            tailored to your strategic position and legal burden in
            this tax case.
          </p>
        </div>
      </div>
    </div>
  );
}
