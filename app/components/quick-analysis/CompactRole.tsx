"use client";

import { useState } from "react";
import { Briefcase, Shield, HelpCircle } from "lucide-react";

type RoleType = "defendant" | "plaintiff";

interface CompactRoleProps {
  onUpdate?: (role: RoleType) => void;
  initialValue?: RoleType | null;
}

export default function CompactRole({ onUpdate, initialValue }: CompactRoleProps) {
  const [selectedRole, setSelectedRole] =
    useState<RoleType | null>(initialValue || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setIsModalOpen(false);
    if (onUpdate) {
      onUpdate(role);
    }
  };

  const roles = {
    defendant: {
      title: "Defendant/Respondent",
      subtitle: "Party defending against legal action",
      icon: (
        <Shield className="w-8 h-8" />
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
        <Briefcase className="w-8 h-8" />
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

  const selectedRoleData = selectedRole ? roles[selectedRole] : null;

  return (
    <>
      <div className="bg-surface-000 rounded-lg border border-border-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${(selectedRole && selectedRoleData)
                ? "bg-primary-100 text-primary-600"
                : "bg-surface-100 text-ink-500"
              }`}
            >
              {selectedRole && selectedRoleData ? (
                <span className="text-lg flex items-center justify-center">
                  {selectedRoleData.icon}
                </span>
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900">
                Step 3: Your Role{" "}
                <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-ink-600">
                Your position in this case
              </p>
            </div>
          </div>

          {/* Centered Role Name */}
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-semibold text-ink-900">
              {selectedRoleData?.title}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm whitespace-nowrap shadow-sm"
          >
            {selectedRole ? "Change Role" : "Select Role"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary-950/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-050 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-surface-050 border-b border-border-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink-900">
                Select Your Role
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-400 hover:text-ink-600 transition-colors"
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

            <div className="p-6">
              <p className="text-center text-ink-600 mb-6">
                Your role determines the legal strategy, burden of
                proof, and analysis perspective for this case.
              </p>

              {/* Role Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Defendant Card */}
                <button
                  onClick={() => handleRoleChange("defendant")}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${selectedRole === "defendant"
                    ? "border-primary-500 bg-primary-100"
                    : "border-border-200 bg-surface-000 hover:border-primary-300"
                    }`}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 flex-shrink-0 ${selectedRole === "defendant"
                        ? "bg-primary-600 text-white"
                        : "bg-surface-200 text-ink-500"
                        }`}
                    >
                      {roles.defendant.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ink-900 mb-1">
                        {roles.defendant.title}
                      </h3>
                      <p className="text-sm text-ink-600">
                        {roles.defendant.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">
                      Key Responsibilities:
                    </h4>
                    <ul className="space-y-1">
                      {roles.defendant.responsibilities.map(
                        (resp, index) => (
                          <li
                            key={index}
                            className="text-sm text-ink-600 flex items-start"
                          >
                            <span className="text-primary-600 mr-2">
                              •
                            </span>
                            <span>{resp}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border-200">
                    <p className="text-sm text-ink-600">
                      <span className="font-semibold">
                        Strategic Focus:
                      </span>{" "}
                      {roles.defendant.strategicFocus}
                    </p>
                  </div>
                </button>

                {/* Plaintiff Card */}
                <button
                  onClick={() => handleRoleChange("plaintiff")}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${selectedRole === "plaintiff"
                    ? "border-primary-500 bg-primary-100"
                    : "border-border-200 bg-surface-000 hover:border-primary-300"
                    }`}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 flex-shrink-0 ${selectedRole === "plaintiff"
                        ? "bg-primary-600 text-white"
                        : "bg-surface-200 text-ink-500"
                        }`}
                    >
                      {roles.plaintiff.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ink-900 mb-1">
                        {roles.plaintiff.title}
                      </h3>
                      <p className="text-sm text-ink-600">
                        {roles.plaintiff.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">
                      Key Responsibilities:
                    </h4>
                    <ul className="space-y-1">
                      {roles.plaintiff.responsibilities.map(
                        (resp, index) => (
                          <li
                            key={index}
                            className="text-sm text-ink-600 flex items-start"
                          >
                            <span className="text-primary-600 mr-2">
                              •
                            </span>
                            <span>{resp}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border-200">
                    <p className="text-sm text-ink-600">
                      <span className="font-semibold">
                        Strategic Focus:
                      </span>{" "}
                      {roles.plaintiff.strategicFocus}
                    </p>
                  </div>
                </button>
              </div>

              {/* Selected Role Summary */}
              {selectedRoleData && (
                <div className="bg-highlight-200 border border-transparent rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink-700">
                    <span className="font-semibold">
                      Selected Role:
                    </span>{" "}
                    {selectedRoleData.title} - The analysis will be
                    tailored to your strategic position and legal burden
                    in this case.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
