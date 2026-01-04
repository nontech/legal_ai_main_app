import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Acceptable Use Policy - TheLawThing",
  description:
    "Acceptable Use Policy for TheLawThing legal AI platform",
};

export default function AcceptableUse() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">
            Acceptable Use Policy
          </h1>
          <p className="text-sm text-ink-500 mb-8">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                1. Introduction
              </h2>
              <p>
                This Acceptable Use Policy ("AUP") outlines the rules
                and guidelines for using TheLawThing's AI-powered legal
                case analysis platform (the "Service"). By using the
                Service, you agree to comply with this AUP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                2. Prohibited Activities
              </h2>
              <p>You may not use the Service to:</p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.1 Illegal Activities
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Violate any applicable laws, regulations, or legal
                  obligations
                </li>
                <li>
                  Upload or process content that is illegal,
                  fraudulent, or violates third-party rights
                </li>
                <li>Facilitate or engage in any criminal activity</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.2 Intellectual Property Violations
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Upload content you do not own or have rights to use
                </li>
                <li>
                  Infringe on copyrights, trademarks, or other
                  intellectual property
                </li>
                <li>
                  Attempt to reverse engineer, extract, or copy AI
                  model weights or proprietary algorithms
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.3 Security Violations
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Attempt to gain unauthorized access to the Service
                  or other users' accounts
                </li>
                <li>
                  Perform security testing or penetration testing
                  without explicit written authorization
                </li>
                <li>
                  Introduce malware, viruses, or other harmful code
                </li>
                <li>
                  Interfere with or disrupt the Service's
                  infrastructure
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.4 Harmful Content
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Generate content for discrimination, harassment, or
                  violence
                </li>
                <li>
                  Create content that is defamatory, libelous, or
                  violates privacy rights
                </li>
                <li>
                  Process content that contains hate speech or incites
                  violence
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.5 Regulated Data
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Process Protected Health Information (PHI) under
                  HIPAA without explicit authorization
                </li>
                <li>
                  Process payment card data (PCI-DSS) without proper
                  safeguards
                </li>
                <li>
                  Process special category personal data (e.g.,
                  biometric data) without lawful basis
                </li>
                <li>
                  Upload content containing sensitive financial
                  information without appropriate controls
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.6 Automated Decisions
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Create automated legal decisions with legal effects
                  without human oversight
                </li>
                <li>
                  Use Service outputs as the sole basis for legal
                  actions without professional review
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                2.7 Misuse of Service
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Benchmark or compare the Service to disparage it
                  without disclosure
                </li>
                <li>
                  Use the Service in a manner that exceeds reasonable
                  usage limits
                </li>
                <li>
                  Resell or redistribute Service access without
                  authorization
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                3. Enforcement
              </h2>
              <p>
                We reserve the right to investigate suspected
                violations of this AUP. We may:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Suspend or terminate your account immediately</li>
                <li>Remove or block access to prohibited content</li>
                <li>
                  Report violations to law enforcement authorities
                </li>
                <li>
                  Take legal action to protect our rights and users
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                4. Reporting Violations
              </h2>
              <p>
                If you become aware of any violation of this AUP,
                please report it to us immediately at{" "}
                <a
                  href="mailto:abuse@TheLawThing.dev"
                  className="text-primary-600 hover:underline"
                >
                  abuse@TheLawThing.dev
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                5. Changes to This Policy
              </h2>
              <p>
                We may update this AUP from time to time. Continued
                use of the Service after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                6. Contact
              </h2>
              <p>
                Questions about this AUP? Contact us at{" "}
                <a
                  href="mailto:legal@TheLawThing.dev"
                  className="text-primary-600 hover:underline"
                >
                  legal@TheLawThing.dev
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
