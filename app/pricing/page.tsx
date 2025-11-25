import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Pricing - Lawgorithm",
  description: "Pricing plans for Lawgorithm legal AI platform",
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Pricing</h1>
          <p className="text-lg text-ink-600 mb-8">
            Choose the plan that fits your legal practice needs.
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Flexible Plans</h2>
              <p>
                Lawgorithm offers flexible pricing options designed to scale with your practice. All plans include access to our core scenario engine features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Contact Us for Pricing</h2>
              <p>
                As an early-stage platform, we work directly with legal practices to create custom pricing that fits your specific needs. Our pricing is based on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Number of users</li>
                <li>Volume of case analyses</li>
                <li>Document storage requirements</li>
                <li>Required security and compliance features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">What's Included</h2>
              <p>All plans include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>AI-powered scenario analysis</li>
                <li>Viability assessments for claims and issues</li>
                <li>Best-case, base-case, and worst-case scenario breakdowns</li>
                <li>Actionable next steps and research suggestions</li>
                <li>Document management and classification</li>
                <li>Secure data storage and encryption</li>
                <li>Email support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Enterprise Options</h2>
              <p>
                For larger firms or organizations with specific requirements, we offer enterprise plans with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom integrations</li>
                <li>Dedicated support and account management</li>
                <li>Enhanced security and compliance features</li>
                <li>Custom data processing agreements (DPAs)</li>
                <li>On-premise deployment options (where applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Get Started</h2>
              <p>
                Ready to learn more about pricing? Contact us to discuss your needs:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:contact@lawgorithm.dev" className="text-primary-600 hover:underline">contact@lawgorithm.dev</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

