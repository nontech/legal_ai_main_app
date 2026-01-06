"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function BackToHome({
  country,
  locale,
}: {
  country: string;
  locale: string;
}) {
  const t = useTranslations("common");

  return (
    <Link
      href={`/${country}/${locale}`}
      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
    >
      <span className="mr-2 group-hover:-translate-x-1 transition-transform">
        ←
      </span>
      {t("backToHome")}
    </Link>
  );
}

