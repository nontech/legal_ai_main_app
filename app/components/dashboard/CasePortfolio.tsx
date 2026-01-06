"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface DBCase {
  id: string;
  case_details?: any;
  case_type?: string | null;
  role?: string | null;
  jurisdiction?: any;
  created_at: string;
  owner_id?: string | null;
  result?: any;
}

interface Case {
  id: string;
  title: string;
  type: "Criminal" | "Civil";
  status: "Active" | "Completed" | "Under Review";
  currentStep: string;
  yourRole: string;
  permissions: string;
  priority: "High" | "Medium" | "Low";
  documents: number;
  lastUpdated: string;
}

// Map DB case to UI case
function getCaseTitle(dbCase: DBCase): string | null {
  const rawTitle = dbCase.case_details?.["case_information"]?.caseName;
  if (!rawTitle) return null;
  const trimmed = rawTitle.trim();
  if (!trimmed || trimmed.toLowerCase() === "untitled case") {
    return null;
  }
  return trimmed;
}

function mapDBCaseToUI(dbCase: DBCase): Case {
  const details = dbCase.case_details || {};
  const title =
    getCaseTitle(dbCase) ||
    `Case ${dbCase.id.slice(0, 8).toUpperCase()}`;
  const caseType = dbCase.case_type === "criminal" ? "Criminal" : "Civil";

  // Calculate lastUpdated as relative time
  const createdAt = new Date(dbCase.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let lastUpdated = "just now";
  if (diffHours > 0) lastUpdated = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays > 0) lastUpdated = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return {
    id: dbCase.id,
    title,
    type: caseType as "Criminal" | "Civil",
    status: "Active",
    currentStep: "Analysis",
    yourRole: dbCase.role || "Plaintiff",
    permissions: "Admin",
    priority: "Medium",
    documents: 0,
    lastUpdated,
  };
}

// Only show cases that have analysis results
function isValidCase(dbCase: DBCase): boolean {
  return Boolean(dbCase?.id && dbCase?.result);
}

export default function CasePortfolio() {
  const router = useRouter();
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';
  const t = useTranslations("casePortfolio");
  const tNav = useTranslations("navigation");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch("/api/cases");
        const json = await res.json();

        if (res.status === 401) {
          setIsAuthenticated(false);
          setCases([]);
        } else if (!res.ok || !json?.ok) {
          setError(json?.error || "Failed to fetch cases");
          setCases([]);
        } else {
          setIsAuthenticated(true);
          const dbCases: DBCase[] = json.cases || [];
          // Filter out untitled cases and map to UI cases
          const uiCases = dbCases
            .filter(isValidCase)
            .map(mapDBCaseToUI);
          setCases(uiCases);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setCases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" ||
      case_.status === statusFilter;
    const matchesType =
      typeFilter === "All Types" || case_.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = async (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t("deleteConfirm"))) return;

    try {
      const res = await fetch(`/api/cases?id=${caseId}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to delete case");
      }

      // Remove from local state
      setCases(cases.filter((c) => c.id !== caseId));
      setDeletingId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete case");
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${!isAuthenticated ? "relative" : ""}`}>
      {/* Blur overlay for unauthenticated users */}
      {!isAuthenticated && (
        <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t("signInViewCases")}</h3>
            <p className="text-sm text-gray-600 mb-4">{t("signInViewCasesDesc")}</p>
            <button
              onClick={() => router.push(`/${country}/${locale}/auth/signin`)}
              className="cursor-pointer bg-gradient-to-r from-accent-400 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-accent-500 hover:to-accent-400 transition-all"
            >
              {tNav("signIn")}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {t("title")}
            </h2>
            <p className="text-sm text-gray-600">
              {t("description")}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${country}/${locale}/case-analysis`)}
            className="cursor-pointer bg-gradient-to-r from-primary-700 to-primary-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-primary-800 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 self-start md:self-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("newCase")}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
          >
            <option>{t("allStatuses")}</option>
            <option>{t("active")}</option>
            <option>{t("underReview")}</option>
            <option>{t("completed")}</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
          >
            <option>{t("allTypes")}</option>
            <option>{t("criminal")}</option>
            <option>{t("civil")}</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-amber-500 rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">{t("loading")}</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCases.length === 0 && isAuthenticated && (
        <div className="p-8 text-center">
          <p className="text-gray-600">{t("noCases")}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && filteredCases.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("caseId")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("caseTitle")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("type")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("yourRole")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("lastUpdated")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((case_) => (
                <tr
                  key={case_.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/${country}/${locale}/case-analysis/detailed?step=7&caseId=${case_.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {case_.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {case_.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {case_.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${case_.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : case_.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {case_.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {case_.yourRole}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {case_.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <button
                      onClick={(e) => handleDelete(case_.id, e)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
