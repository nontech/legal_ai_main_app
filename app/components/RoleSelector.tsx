"use client";

import { useState, useEffect } from "react";
import SaveCaseButton from "./SaveCaseButton";

type RoleType = "defendant" | "plaintiff";

interface RoleSelectorProps {
  caseId?: string;
}

export default function RoleSelector({ caseId }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!!caseId);

  useEffect(() => {
    if (caseId) {
      const fetchRoleData = async () => {
        try {
          const res = await fetch(`/api/cases/${caseId}`);
          const json = await res.json();

          if (json.ok && json.data?.role) {
            setSelectedRole(json.data.role as RoleType);
          } else {
            setSelectedRole("plaintiff"); // Default
          }
        } catch (error) {
          console.error("Failed to fetch role data:", error);
          setSelectedRole("plaintiff"); // Default on error
        } finally {
          setIsLoading(false);
        }
      };

      fetchRoleData();
    } else {
      setIsLoading(false);
    }
  }, [caseId]);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setIsModalOpen(false);
  };

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

  const selectedRoleData = roles[selectedRole || "plaintiff"];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Select Your Role
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Your role determines the legal strategy, burden of
              proof, and analysis perspective for this tax case.
            </p>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1"
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
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                Role Selection Confirmed
              </h4>
              <p className="text-gray-700 text-sm">
                You have selected{" "}
                <span className="font-semibold">
                  {selectedRoleData.title}
                </span>{" "}
                - The analysis will be tailored to your strategic
                position and legal burden in this case.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Display with Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                <svg
                  className="w-7 h-7 text-amber-700"
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
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Your Role
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedRoleData.subtitle}
                </p>
              </div>
            </div>

            {/* Centered Role Name */}
            <div className="flex-1 flex justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {selectedRoleData.title}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm whitespace-nowrap"
            >
              Change Role
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Select Your Role
                </h2>
                <p className="text-amber-100 text-sm">
                  Choose your position in this case
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Role Cards in Modal */}
            <div className="p-6">
              <p className="text-center text-gray-600 mb-6">
                Your role determines the legal strategy, burden of
                proof, and analysis perspective for this case.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Defendant Card */}
                <button
                  onClick={() => handleRoleSelect("defendant")}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${selectedRole === "defendant"
                    ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 flex-shrink-0 ${selectedRole === "defendant"
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
                            <span className="text-amber-600 mr-2">
                              •
                            </span>
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
                  onClick={() => handleRoleSelect("plaintiff")}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${selectedRole === "plaintiff"
                    ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 flex-shrink-0 ${selectedRole === "plaintiff"
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
                            <span className="text-amber-600 mr-2">
                              •
                            </span>
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

              {/* Selected Role Summary in Modal */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">
                    Selected Role:
                  </span>{" "}
                  {selectedRoleData.title} - The analysis will be
                  tailored to your strategic position and legal burden
                  in this case.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <SaveCaseButton
        caseId={caseId}
        field="role"
        value={selectedRole || "plaintiff"}
      />
    </>
  );
}
