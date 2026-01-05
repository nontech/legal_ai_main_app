import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Security - TheLawThing",
  description: "Security information for TheLawThing legal AI platform",
};

export default async function Security({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;

  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-primary-900 text-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Security</h1>
          <p className="text-primary-100 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border-200">
          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Our Commitment</h2>
              <p>
                TheLawThing is built with defense-in-depth security principles. We implement multiple layers of security controls to protect your data and ensure the integrity of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Security Measures</h2>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Encryption</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>In Transit:</strong> All data transmitted to and from the Service uses TLS 1.2+ encryption</li>
                <li><strong>At Rest:</strong> Customer data is encrypted using industry-standard encryption algorithms</li>
                <li><strong>Backups:</strong> All backups are encrypted and stored securely</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Access Controls</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Multi-factor authentication (MFA) for administrative access</li>
                <li>Single Sign-On (SSO) integration support</li>
                <li>Role-based access controls (RBAC)</li>
                <li>Short-lived credentials and session management</li>
                <li>Least-privilege access principles</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Network Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Strict network segmentation</li>
                <li>Firewall rules and intrusion detection systems</li>
                <li>DDoS protection and mitigation</li>
                <li>Regular security monitoring and logging</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Application Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure Software Development Lifecycle (SDLC) practices</li>
                <li>Code review and automated security scanning</li>
                <li>Dependency vulnerability scanning</li>
                <li>Static Application Security Testing (SAST)</li>
                <li>Dynamic Application Security Testing (DAST)</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Data Isolation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Logical data isolation between customer tenants</li>
                <li>Customer data is not used to train public AI models</li>
                <li>Configurable data retention policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Compliance & Certifications</h2>
              <p>
                We align our security practices with industry standards including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SOC 2 Type II controls (in progress)</li>
                <li>ISO 27001 security management practices</li>
                <li>GDPR and CCPA compliance</li>
                <li>Regular third-party security assessments</li>
                <li>Annual penetration testing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Vendor Risk Management</h2>
              <p>
                We carefully vet all third-party service providers and require appropriate security controls and contractual protections. Subprocessors are listed and updated regularly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Incident Response</h2>
              <p>
                We maintain an incident response plan and will notify affected customers without undue delay in the event of a security incident involving their data, in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Vulnerability Reporting</h2>
              <p>
                We welcome responsible disclosure of security vulnerabilities. If you discover a security issue, please report it to <a href="mailto:security@TheLawThing.dev" className="text-primary-600 hover:underline">security@TheLawThing.dev</a>.
              </p>
              <p className="mt-4">
                Please include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Steps to reproduce the issue</li>
                <li>Potential impact assessment</li>
                <li>Affected endpoints or components</li>
              </ul>
              <p className="mt-4">
                We will acknowledge receipt within 72 hours and work with you to resolve the issue. We do not pursue legal action against security researchers acting in good faith.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Data Processing Agreements</h2>
              <p>
                For customers requiring Data Processing Agreements (DPAs), we provide standard agreements that comply with GDPR and other applicable data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Contact</h2>
              <p>
                For security-related inquiries, please contact <a href="mailto:security@TheLawThing.dev" className="text-primary-600 hover:underline">security@TheLawThing.dev</a>.
              </p>
            </section>
          </div>

            <div className="mt-12 pt-8 border-t border-border-200">
              <Link href={`/${country}/${locale}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group">
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Home
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
