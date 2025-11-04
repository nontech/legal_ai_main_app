"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-surface-000 rounded-2xl p-6 shadow-sm border border-border-200 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-ink-600 mb-1">
            {title}
          </p>
          <p className="text-4xl font-bold text-ink-900">{value}</p>
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <p className="text-xs text-ink-500 flex items-center gap-1">
        {subtitle}
      </p>
    </div>
  );
}

export default function StatsCards() {
  const router = useRouter();
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/cases");
        const json = await res.json();

        if (res.status === 401) {
          setIsAuthenticated(false);
          setStats([]);
        } else if (!res.ok || !json?.ok) {
          setError(json?.error || "Failed to fetch stats");
          setStats([]);
        } else {
          setIsAuthenticated(true);
          const cases = json.cases || [];

          // Filter out untitled cases for stats calculation
          const validCases = cases.filter((c: any) => {
            const caseName = c.case_details?.["case_information"]?.caseName;
            return caseName && caseName !== "Untitled Case";
          });

          // Calculate stats from valid cases only
          const totalCases = validCases.length;
          const activeCases = validCases.filter((c: any) => c.status === "Active" || !c.status).length;
          const underReview = validCases.filter((c: any) => c.status === "Under Review").length;
          const completed = validCases.filter((c: any) => c.status === "Completed").length;

          setStats([
            {
              title: "Total Cases",
              value: totalCases,
              subtitle: "All time cases",
              iconBg: "bg-surface-100",
              iconColor: "text-ink-700",
              icon: (
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "Active Cases",
              value: activeCases,
              subtitle: "Currently active",
              iconBg: "bg-highlight-200",
              iconColor: "text-highlight-600",
              icon: (
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              title: "Under Review",
              value: underReview,
              subtitle: "Pending review",
              iconBg: "bg-primary-100",
              iconColor: "text-primary-600",
              icon: (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              ),
            },
            {
              title: "Completed",
              value: completed,
              subtitle: "Successfully closed",
              iconBg: "bg-success-100",
              iconColor: "text-success-600",
              icon: (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
          ]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-200 rounded-2xl p-6 shadow-sm border border-border-300 animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-40 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-000 rounded-2xl p-6 shadow-sm border border-border-200 h-32"></div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-surface-000/90 backdrop-blur-sm px-6 py-4 rounded-lg">
            <h3 className="text-lg font-bold text-ink-900 mb-2">Sign in to view your stats</h3>
            <p className="text-sm text-ink-600 mb-4">Please sign in to access your case statistics</p>
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-gradient-to-r from-primary-700 to-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-800 hover:to-primary-700 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}



