import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Contact - Lawgorithm",
  description: "Contact Lawgorithm for support and inquiries",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Contact & Support</h1>
          <p className="text-lg text-ink-600 mb-8">
            Get in touch with the Lawgorithm team. We're here to help with questions, support, and inquiries.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 bg-surface-050 rounded-xl border border-border-200">
              <h2 className="text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Support
              </h2>
              <p className="text-ink-700 mb-3">
                For technical support, account issues, or questions about using the platform.
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href="mailto:support@lawgorithm.dev" className="text-primary-600 hover:text-primary-700 hover:underline">
                  support@lawgorithm.dev
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                Response time: 24-48 hours
              </p>
            </div>

            <div className="p-6 bg-surface-050 rounded-xl border border-border-200">
              <h2 className="text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                General Inquiries
              </h2>
              <p className="text-ink-700 mb-3">
                For business inquiries, partnerships, or general questions.
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href="mailto:contact@lawgorithm.dev" className="text-primary-600 hover:text-primary-700 hover:underline">
                  contact@lawgorithm.dev
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                Response time: 2-3 business days
              </p>
            </div>

            <div className="p-6 bg-surface-050 rounded-xl border border-border-200">
              <h2 className="text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security
              </h2>
              <p className="text-ink-700 mb-3">
                Report security vulnerabilities or incidents.
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href="mailto:security@lawgorithm.dev" className="text-primary-600 hover:text-primary-700 hover:underline">
                  security@lawgorithm.dev
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                For responsible disclosure of security issues
              </p>
            </div>

            <div className="p-6 bg-surface-050 rounded-xl border border-border-200">
              <h2 className="text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Legal & Privacy
              </h2>
              <p className="text-ink-700 mb-3">
                For legal questions, privacy requests, or compliance inquiries.
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href="mailto:legal@lawgorithm.dev" className="text-primary-600 hover:text-primary-700 hover:underline">
                  legal@lawgorithm.dev
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                For GDPR requests, data processing agreements, etc.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-primary-50 rounded-xl border border-primary-200">
            <h2 className="text-xl font-bold text-ink-900 mb-3">Office Hours</h2>
            <p className="text-ink-700">
              Our support team is available Monday through Friday, 9:00 AM - 6:00 PM EST. 
              For urgent security issues, please use the security email above and mark your message as "URGENT".
            </p>
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
