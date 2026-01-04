import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Privacy Policy - TheLawThing",
  description: "Privacy Policy for TheLawThing legal AI platform",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-ink-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">1. Introduction</h2>
              <p>
                TheLawThing ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered legal case analysis platform (the "Service").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email address, password)</li>
                <li>Case facts, documents, and other content you upload</li>
                <li>Communication data when you contact us</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usage data and analytics</li>
                <li>Device information and IP addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process your case analyses and generate insights</li>
                <li>Communicate with you about the Service</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-4 font-semibold">
                <strong>Important:</strong> We do not use your case data or documents to train public AI models. Your data is isolated to your account and used solely to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">4. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information only:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With service providers who assist in operating the Service (under strict confidentiality agreements)</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer (merger, acquisition, etc.)</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">6. Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@TheLawThing.dev" className="text-primary-600 hover:underline">privacy@TheLawThing.dev</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">7. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide the Service and comply with legal obligations. You may delete your account and data at any time through the Service settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:privacy@TheLawThing.dev" className="text-primary-600 hover:underline">privacy@TheLawThing.dev</a>
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

