"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Briefcase,
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  FileCheck
} from "lucide-react";

interface ProfileCardProps {
  title: string;
  features: string[];
  icon: React.ReactNode;
  href: string;
  learnMoreText: string;
  comingSoonText: string;
}

function ProfileCard({ title, features, icon, href, learnMoreText, comingSoonText }: ProfileCardProps) {
  const isComingSoon = href === "#";

  return (
    <div className="bg-surface-000 rounded-xl p-6 shadow-md border border-border-200 transition-all duration-300 hover:shadow-lg hover:border-primary-300 flex flex-col h-full min-h-[280px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-primary-700">
          {title}
        </h3>
      </div>
      <div className="h-px bg-border-200 mb-5"></div>
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-ink-600 leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      {isComingSoon ? (
        <button
          disabled
          className="flex items-center justify-center gap-2 bg-surface-100 border border-border-200 text-ink-400 px-6 py-3 rounded-lg mt-auto font-semibold cursor-not-allowed"
        >
          <span>{comingSoonText}</span>
        </button>
      ) : (
        <Link
          href={href}
          className="flex items-center justify-center gap-2 bg-primary-900 text-white border border-primary-900 px-6 py-3 rounded-lg hover:bg-primary-800 transition-all duration-200 mt-auto font-semibold shadow-sm"
        >
          <span>{learnMoreText}</span>
        </Link>
      )}
    </div>
  );
}

export default function UseCases() {
  const t = useTranslations("useCases");
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';

  const profiles = [
    {
      title: t("professionals.title"),
      features: [
        t("professionals.feature1"),
        t("professionals.feature2"),
        t("professionals.feature3"),
      ],
      icon: <Briefcase className="w-6 h-6" />,
      href: `/${country}/${locale}/legal-professionals`,
    },
    {
      title: t("individuals.title"),
      features: [
        t("individuals.feature1"),
        t("individuals.feature2"),
        t("individuals.feature3"),
      ],
      icon: <User className="w-6 h-6" />,
      href: `/${country}/${locale}/individuals`,
    },
    {
      title: t("operations.title"),
      features: [
        t("operations.feature1"),
        t("operations.feature2"),
        t("operations.feature3"),
      ],
      icon: <Building2 className="w-6 h-6" />,
      href: "#",
    },
    {
      title: t("students.title"),
      features: [
        t("students.feature1"),
        t("students.feature2"),
        t("students.feature3"),
      ],
      icon: <GraduationCap className="w-6 h-6" />,
      href: "#",
    },
    {
      title: t("insurers.title"),
      features: [
        t("insurers.feature1"),
        t("insurers.feature2"),
        t("insurers.feature3"),
      ],
      icon: <ShieldCheck className="w-6 h-6" />,
      href: "#",
    },
    {
      title: t("taxCompliance.title"),
      features: [
        t("taxCompliance.feature1"),
        t("taxCompliance.feature2"),
        t("taxCompliance.feature3"),
      ],
      icon: <FileCheck className="w-6 h-6" />,
      href: "#",
    },
  ];

  return (
    <section id="use-cases" className="bg-surface-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-700 mb-4">
            {t("heading")}
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              title={profile.title}
              features={profile.features}
              icon={profile.icon}
              href={profile.href}
              learnMoreText={t("learnMore")}
              comingSoonText={t("comingSoon")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
