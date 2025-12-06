"use client";

import { useState, useEffect } from "react";
import { Briefcase, Shield, HelpCircle } from "lucide-react";

type RoleType = "defendant" | "plaintiff";

interface CompactRoleProps {
  onUpdate?: (role: RoleType) => void;
  initialValue?: RoleType | null;
  countryId?: string;
}

export default function CompactRole({ onUpdate, initialValue, countryId }: CompactRoleProps) {
  const [roles, setRoles] = useState<any>(null);
  const [selectedRole, setSelectedRole] =
    useState<RoleType | null>(initialValue || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingRoles, setIsFetchingRoles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch roles from API when country changes
  useEffect(() => {
    if (!countryId) {
      setRoles(null);
      return;
    }

    const fetchRolesFromAPI = async () => {
      try {
        setIsFetchingRoles(true);
        const res = await fetch(`/api/admin/roles?country_id=${countryId}`);
        const json = await res.json();

        if (json.ok && json.data && typeof json.data === 'object') {
          // Transform API response to roles format
          const rolesObj: any = {};
          Object.entries(json.data).forEach(([key, value]: [string, any]) => {
            rolesObj[key] = {
              title: value.title || value.name || key,
              subtitle: value.subtitle || value.description || "",
              icon: value.icon || null,
              responsibilities: value.responsibilities || value.typical_responsibilities || [],
              strategicFocus: value.strategicFocus || value.strategic_focus || "",
            };
          });
          setRoles(rolesObj);
        } else {
          setRoles(null);
          setError(json.error || "Failed to fetch roles");
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setRoles(null);
        setError("Failed to fetch roles");
      } finally {
        setIsFetchingRoles(false);
      }
    };

    fetchRolesFromAPI();
  }, [countryId]);

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setIsModalOpen(false);
    if (onUpdate) {
      onUpdate(role);
    }
  };

  const DEFAULT_ROLES = {
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

  const effectiveRoles = roles || DEFAULT_ROLES;
  const selectedRoleData = selectedRole ? effectiveRoles[selectedRole] : null;

  return (
    <>
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {error}
        </div>
      )}
      <div className="bg-surface-000 p-3 sm:p-6">
        {isFetchingRoles ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center flex-1 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-surface-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0 animate-pulse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-surface-200 rounded"></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-5 sm:h-6 bg-surface-100 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-surface-100 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2">
              <div className="h-5 sm:h-6 bg-surface-100 rounded w-28 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center flex-1 min-w-0">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-2 sm:mr-3 flex-shrink-0 ${(selectedRole && selectedRoleData)
                  ? "bg-primary-100 text-primary-600"
                  : "bg-surface-100 text-ink-500"
                  }`}
              >
                {selectedRole && selectedRoleData ? (
                  <span className="text-base sm:text-lg flex items-center justify-center">
                    {selectedRoleData.icon}
                  </span>
                ) : (
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-ink-900 mb-1">
                  Step 3: Your Role{" "}
                  <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs sm:text-sm text-ink-600">
                  Your position in this case
                </p>
              </div>
            </div>

            {/* Clickable Role Name */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border px-2 py-1 hover:bg-surface-100 transition-colors group cursor-pointer"
            >
              <span className="text-base sm:text-lg font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                {selectedRoleData?.title || "Select Role"}
              </span>
              <svg
                className="w-4 h-4 text-ink-400 group-hover:text-primary-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary-950/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-surface-050 rounded-lg sm:rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-surface-050 border-b border-border-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-ink-900 truncate">
                Select Your Role
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-400 hover:text-ink-600 transition-colors flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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

            <div className="p-3 sm:p-6">
              <p className="text-center text-ink-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Your role determines the legal strategy, burden of
                proof, and analysis perspective for this case.
              </p>

              {/* Role Selection Cards */}
              {isFetchingRoles ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 sm:p-6 rounded-lg border-2 border-border-200 animate-pulse">
                      <div className="flex items-start mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-surface-200 rounded-full mr-3 sm:mr-4"></div>
                        <div className="flex-1">
                          <div className="h-5 sm:h-6 bg-surface-200 rounded w-32 mb-2"></div>
                          <div className="h-4 bg-surface-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="mb-3 sm:mb-4 hidden sm:block">
                        <div className="h-4 bg-surface-200 rounded w-40 mb-2"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-surface-200 rounded w-full"></div>
                          <div className="h-3 bg-surface-200 rounded w-5/6"></div>
                        </div>
                      </div>
                      <div className="pt-3 sm:pt-4 border-t border-border-200 hidden sm:block">
                        <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  {/* Defendant Card */}
                  <button
                    onClick={() => handleRoleChange("defendant")}
                    className={`text-left p-3 sm:p-6 rounded-lg border-2 transition-all ${selectedRole === "defendant"
                      ? "border-primary-500 bg-primary-100"
                      : "border-border-200 bg-surface-000 hover:border-primary-300"
                      }`}
                  >
                    <div className="flex items-start mb-3 sm:mb-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 ${selectedRole === "defendant"
                          ? "bg-primary-600 text-white"
                          : "bg-surface-200 text-ink-500"
                          }`}
                      >
                        {effectiveRoles.defendant?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 truncate">
                          {effectiveRoles.defendant?.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-600 truncate">
                          {effectiveRoles.defendant?.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4 hidden sm:block">
                      <h4 className="text-sm font-semibold text-ink-900 mb-2">
                        Key Responsibilities:
                      </h4>
                      <ul className="space-y-1">
                        {effectiveRoles.defendant?.responsibilities?.map(
                          (resp: string, index: number) => (
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

                    <div className="pt-3 sm:pt-4 border-t border-border-200 hidden sm:block">
                      <p className="text-sm text-ink-600">
                        <span className="font-semibold">
                          Strategic Focus:
                        </span>{" "}
                        {effectiveRoles.defendant?.strategicFocus}
                      </p>
                    </div>
                  </button>

                  {/* Plaintiff Card */}
                  <button
                    onClick={() => handleRoleChange("plaintiff")}
                    className={`text-left p-3 sm:p-6 rounded-lg border-2 transition-all ${selectedRole === "plaintiff"
                      ? "border-primary-500 bg-primary-100"
                      : "border-border-200 bg-surface-000 hover:border-primary-300"
                      }`}
                  >
                    <div className="flex items-start mb-3 sm:mb-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 ${selectedRole === "plaintiff"
                          ? "bg-primary-600 text-white"
                          : "bg-surface-200 text-ink-500"
                          }`}
                      >
                        {effectiveRoles.plaintiff?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-ink-900 mb-1 truncate">
                          {effectiveRoles.plaintiff?.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-600 truncate">
                          {effectiveRoles.plaintiff?.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4 hidden sm:block">
                      <h4 className="text-sm font-semibold text-ink-900 mb-2">
                        Key Responsibilities:
                      </h4>
                      <ul className="space-y-1">
                        {effectiveRoles.plaintiff?.responsibilities?.map(
                          (resp: string, index: number) => (
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

                    <div className="pt-3 sm:pt-4 border-t border-border-200 hidden sm:block">
                      <p className="text-sm text-ink-600">
                        <span className="font-semibold">
                          Strategic Focus:
                        </span>{" "}
                        {effectiveRoles.plaintiff?.strategicFocus}
                      </p>
                    </div>
                  </button>
                </div>
              )}

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
