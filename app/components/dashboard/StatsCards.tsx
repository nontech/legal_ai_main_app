"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

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

function resolveCaseStatus(dbCase: any): string {
  const directStatus = dbCase?.status;
  if (typeof directStatus === "string" && directStatus.trim()) {
    return directStatus.trim();
  }
  const detailStatus =
    dbCase?.case_details?.status ||
    dbCase?.case_details?.case_status ||
    dbCase?.case_details?.["case_information"]?.status;
  if (typeof detailStatus === "string" && detailStatus.trim()) {
    return detailStatus.trim();
  }
  return "Active";
}

export default function StatsCards() {
  const router = useRouter();
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';
  const t = useTranslations("stats");
  const tNav = useTranslations("navigation");
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

          const totalCases = cases.length;
          const activeCases = cases.filter((c: any) => resolveCaseStatus(c) === "Active").length;
          const underReview = cases.filter((c: any) => resolveCaseStatus(c) === "Under Review").length;
          const completed = cases.filter((c: any) => resolveCaseStatus(c) === "Completed").length;

          setStats([
            {
              title: t("totalCases"),
              value: totalCases,
              subtitle: t("allTimeCases"),
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
              title: t("activeCases"),
              value: activeCases,
              subtitle: t("currentlyActive"),
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
              title: t("underReview"),
              value: underReview,
              subtitle: t("pendingReview"),
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
              title: t("completed"),
              value: completed,
              subtitle: t("successfullyClosed"),
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
            <h3 className="text-lg font-bold text-ink-900 mb-2">{t("signInViewStats")}</h3>
            <p className="text-sm text-ink-600 mb-4">{t("signInViewStatsDesc")}</p>
            <button
              onClick={() => router.push(`/${country}/${locale}/auth/signin`)}
              className="bg-gradient-to-r from-primary-700 to-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-800 hover:to-primary-700 transition-all"
            >
              {tNav("signIn")}
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



