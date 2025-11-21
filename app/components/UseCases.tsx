"use client";

import Link from "next/link";

interface ProfileCardProps {
  title: string;
  features: string[];
  icon: React.ReactNode;
}

function ProfileCard({ title, features, icon }: ProfileCardProps) {
  return (
    <div className="bg-surface-000 rounded-xl p-6 shadow-md border border-border-200 transition-all duration-300 hover:shadow-lg hover:border-primary-300 flex flex-col h-full min-h-[280px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
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
      <Link
        href="#"
        className="flex items-center gap-2 text-primary-700 font-bold hover:text-primary-800 transition-colors mt-auto pt-4 border-t border-border-100"
      >
        <span>Explore Solutions</span>
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}

export default function UseCases() {
  const profiles = [
    {
      title: "Legal Professionals",
      features: [
        "Quickly analyze new client's case viability",
        "Estimate win probability & settlement ranges",
        "Identify missing documents & risk factors",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-primary-700"
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
      ),
    },
    {
      title: "Individuals Navigating Legal Situations",
      features: [
        'Understand "Do I have a case?"',
        'Know "What are my next steps?"',
        "Learn likely outcomes before consultation",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-primary-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: "Legal Operations Teams at SMEs",
      features: [
        "Assess legal risk before escalating to a lawyer",
        "Prepare internal documentation & recommended steps",
        "Understand expected outcomes before going to court",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-primary-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      title: "Law Students / Paralegals",
      features: [
        "Accelerate research",
        "Summarize large case documents",
        "Draft memos and identify legal arguments",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-primary-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14v9M12 14l-6.16-3.422a12.083 12.083 0 01.665-6.479L12 14m0 0l6.16-3.422a12.083 12.083 0 00-.665-6.479L12 14m0 0V5"
          />
        </svg>
      ),
    },
    {
      title: "Insurance Companies",
      features: [
        "Predict litigation outcome",
        "Estimate settlement and risk exposure",
        "Decide whether to fight or settle claims",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-primary-700"
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
      ),
    },
  ];

  return (
    <section className="bg-surface-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-700 mb-4">
            Who are you?
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Our platform is designed for a wide range of legal needs.
            Select your profile to see how we can help.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              title={profile.title}
              features={profile.features}
              icon={profile.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
