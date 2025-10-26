"use client";

import { useState } from "react";

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

const mockCases: Case[] = [
  {
    id: "CASE-001",
    title: "State v. Johnson - Assault Charges",
    type: "Criminal",
    status: "Active",
    currentStep: "Jury Selection",
    yourRole: "Prosecutor",
    permissions: "Admin",
    priority: "High",
    documents: 23,
    lastUpdated: "2 hours ago",
  },
  {
    id: "CASE-002",
    title: "Smith Corp v. Anderson LLC - Contract Dispute",
    type: "Civil",
    status: "Under Review",
    currentStep: "Case Details",
    yourRole: "Plaintiff's Attorney",
    permissions: "Edit",
    priority: "Medium",
    documents: 8,
    lastUpdated: "1 day ago",
  },
  {
    id: "CASE-003",
    title: "People v. Williams - DUI",
    type: "Criminal",
    status: "Active",
    currentStep: "Trial Strategy",
    yourRole: "Defense Attorney",
    permissions: "Admin",
    priority: "Medium",
    documents: 15,
    lastUpdated: "3 hours ago",
  },
  {
    id: "CASE-004",
    title: "Davis v. Metro Insurance - Personal Injury",
    type: "Civil",
    status: "Completed",
    currentStep: "Verdict",
    yourRole: "Plaintiff's Attorney",
    permissions: "View Only",
    priority: "Low",
    documents: 42,
    lastUpdated: "5 days ago",
  },
];

export default function CasePortfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filteredCases = mockCases.filter((case_) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Case Portfolio
            </h2>
            <p className="text-sm text-gray-600">
              Manage and track all your legal cases with comprehensive
              insights
            </p>
          </div>
          <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 self-start md:self-auto">
            <svg
              className="w-5 h-5 flex-shrink-0"
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
            <span>+ New Case Analysis</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm appearance-none cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Under Review</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm appearance-none cursor-pointer"
              >
                <option>All Types</option>
                <option>Criminal</option>
                <option>Civil</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Case ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Your Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.map((case_) => (
              <tr
                key={case_.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {case_.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {case_.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {case_.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      case_.status === "Active"
                        ? "bg-yellow-100 text-yellow-800"
                        : case_.status === "Completed"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {case_.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {case_.yourRole}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                      {case_.documents}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {case_.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
