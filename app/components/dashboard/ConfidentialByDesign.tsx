"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ConfidentialByDesign() {
  const params = useParams();
  const country = params?.country as string || 'us';
  const locale = params?.locale as string || 'en';
  return (
    <section className="py-20 bg-gradient-to-br from-surface-050 via-surface-100 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              Confidential by design
            </span>
          </h2>
          <p className="text-xl text-ink-600 mb-12 text-center leading-relaxed max-w-3xl mx-auto">
            Legal work is sensitive. TheLawThing is built with security and confidentiality as first principles, not an afterthought.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Data Privacy */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-border-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">Data privacy</h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Not used to train general-purpose models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>Data isolated to your workspace</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Encryption */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-border-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-success-600"
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
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">Encryption</h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-success-600 mt-1">•</span>
                      <span>TLS for data in transit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success-600 mt-1">•</span>
                      <span>At-rest encryption for stored data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-border-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">Access control</h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 mt-1">•</span>
                      <span>Only your workspace sees your cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 mt-1">•</span>
                      <span>Role-based permissions for teams</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-border-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-info-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-info-600"
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
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-ink-900">Compliance alignment</h3>
                  <ul className="space-y-2 text-ink-600">
                    <li className="flex items-start gap-2">
                      <span className="text-info-600 mt-1">•</span>
                      <span>GDPR-compliant infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-info-600 mt-1">•</span>
                      <span>EU and international privacy standards</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/${country}/${locale}/security`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Learn more about security
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

