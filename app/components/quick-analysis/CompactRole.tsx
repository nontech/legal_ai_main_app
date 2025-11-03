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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3" style={{
              backgroundColor: selectedRole ? '#FEF3C7' : '#F3F4F6',
              color: selectedRole ? '#B45309' : '#6B7280',
            }}>
              {selectedRole && selectedRoleData ? (
                <span className="text-lg">{selectedRoleData.icon ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedRoleData.icon}
                  </span>
                ) : null}</span>
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Step 3: Your Role{" "}
                <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-600">
                Your position in this case
              </p>
            </div>
          </div>

          {/* Centered Role Name */}
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {selectedRoleData?.title}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm whitespace-nowrap"
          >
            {selectedRole ? "Change Role" : "Select Role"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Select Your Role
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
              <p className="text-center text-gray-600 mb-6">
                Your role determines the legal strategy, burden of
                proof, and analysis perspective for this case.
              </p>

              {/* Role Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Defendant Card */}
                <button
                  onClick={() => handleRoleChange("defendant")}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${selectedRole === "defendant"
                    ? "border-amber-500 bg-amber-50"
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
                  onClick={() => handleRoleChange("plaintiff")}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${selectedRole === "plaintiff"
                    ? "border-amber-500 bg-amber-50"
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

              {/* Selected Role Summary */}
              {selectedRoleData && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
