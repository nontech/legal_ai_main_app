"use client";

import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import {
    Shield,
    TrendingUp,
    Search,
    CheckCircle2,
    Upload,
    Cpu,
    Lightbulb,
    ArrowRight
} from "lucide-react";

export default function LegalProfessionalsPage() {
    return (
        <div className="min-h-screen bg-surface-100 text-ink-900 font-sans">
            <Suspense fallback={<div className="h-20" />}>
                <Navbar />
            </Suspense>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-900 mb-8 leading-tight tracking-tight">
                        AI Case Intelligence for Lawyers that Delivers Winning Strategies
                    </h1>
                    <p className="text-2xl text-ink-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        Transform your case analysis from a manual chore to a strategic advantage. Get actionable insights in minutes, not days.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/case-analysis"
                            className="bg-primary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors w-full sm:w-auto"
                        >
                            Analyze Your Case Now
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white border border-border-300 text-ink-900 px-8 py-3 rounded-lg font-semibold hover:bg-surface-50 transition-colors w-full sm:w-auto"
                        >
                            Book a Demo
                        </Link>
                    </div>
                    <p className="text-sm text-ink-500 mt-6 flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Trusted by 10,000+ Legal Teams
                    </p>
                </div>
            </section>

            {/* Strategic Advantage Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Your Strategic Advantage
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Legal Case Analysis is designed to deliver tangible benefits that directly impact your practice and outcomes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-10 rounded-xl shadow-sm border border-border-200">
                            <div className="w-14 h-14 bg-surface-200 rounded-lg flex items-center justify-center mb-8 text-primary-700">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">Reduce Risk</h3>
                            <p className="text-ink-600 text-base leading-relaxed font-medium">
                                Stop guessing on case outcomes. Accurately estimate win probability and avoid taking on losing cases.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-10 rounded-xl shadow-sm border border-border-200">
                            <div className="w-14 h-14 bg-surface-200 rounded-lg flex items-center justify-center mb-8 text-primary-700">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">Boost Client Confidence</h3>
                            <p className="text-ink-600 text-base leading-relaxed font-medium">
                                Impress clients with data-backed insights and a strategic game plan for court or negotiation.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-10 rounded-xl shadow-sm border border-border-200">
                            <div className="w-14 h-14 bg-surface-200 rounded-lg flex items-center justify-center mb-8 text-primary-700">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">Find What's Missing</h3>
                            <p className="text-ink-600 text-base leading-relaxed font-medium">
                                Help hours of digging, get a focused checklist of gaps, risks, and alternatives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust/Stats Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Trained on Real Cases. Trusted by Real Lawyers.
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Our model analyzes 500K+ public court decisions spanning 50+ years across all practice areas, judge patterns, and settlement outcomes.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Stats Grid */}
                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm flex flex-col justify-center">
                                <div className="text-5xl font-extrabold text-accent-600 mb-3">3 mins</div>
                                <div className="text-base font-medium text-ink-500">Average Case Analysis Time</div>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm flex flex-col justify-center">
                                <div className="text-5xl font-extrabold text-accent-600 mb-3">500K+</div>
                                <div className="text-base font-medium text-ink-500">Real Court Cases</div>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm flex flex-col justify-center">
                                <div className="text-5xl font-extrabold text-accent-600 mb-3">50+ yrs</div>
                                <div className="text-base font-medium text-ink-500">Historical Data</div>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm flex flex-col justify-center">
                                <div className="text-5xl font-extrabold text-accent-600 mb-3">SOC 2</div>
                                <div className="text-base font-medium text-ink-500">Certified & GDPR Ready</div>
                            </div>
                        </div>

                        {/* Right Column: Trust Block */}
                        <div className="lg:col-span-1 bg-white p-10 rounded-xl border border-border-200 shadow-sm flex flex-col justify-center h-full">
                            <h3 className="text-2xl font-bold text-primary-900 mb-6">Your Data Is Safe</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-base font-medium text-ink-600">
                                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0" />
                                    Never shared between cases or firms
                                </li>
                                <li className="flex items-center gap-3 text-base font-medium text-ink-600">
                                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0" />
                                    Encrypted in transit & at rest
                                </li>
                                <li className="flex items-center gap-3 text-base font-medium text-ink-600">
                                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0" />
                                    Deleted on request
                                </li>
                                <li className="flex items-center gap-3 text-base font-medium text-ink-600">
                                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0" />
                                    EU data centers only
                                </li>
                                <li className="flex items-center gap-3 text-base font-medium text-ink-600">
                                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0" />
                                    SOC 2 Type II compliant
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-ink-600 font-medium">
                            Onboard in minutes, see results immediately.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop only) */}
                        <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-0.5 bg-border-300 -z-10"></div>

                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 border-4 border-surface-100 shadow-sm">
                                <Upload className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">1. Upload Case Details</h3>
                            <p className="text-ink-600 text-base leading-relaxed max-w-xs mx-auto font-medium">
                                Securely upload documents, discovery files, and transcripts. Our platform ingests and organizes everything for you.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 border-4 border-surface-100 shadow-sm">
                                <Cpu className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">2. AI Analyzes</h3>
                            <p className="text-ink-600 text-base leading-relaxed max-w-xs mx-auto font-medium">
                                System matches your case against 500k+ similar cases, judges historical patterns, and settlement data.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 border-4 border-surface-100 shadow-sm">
                                <Lightbulb className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">3. Get Strategic Insights</h3>
                            <p className="text-ink-600 text-base leading-relaxed max-w-xs mx-auto font-medium">
                                View probability, settlement ranges, risk factors, and strategic recommendations. All done in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Pricing That Scales With You
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Whether you're a solo practitioner or a large firm, we have a plan that fits your needs. No hidden fees, just transparent value.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Solo Practices */}
                        <div className="bg-white p-10 rounded-xl border border-border-200 text-center shadow-sm">
                            <h3 className="text-2xl font-bold text-primary-900 mb-3">Solo Practices</h3>
                            <p className="text-base text-ink-500 mb-8 font-medium">Get started with all the essential features to analyze your cases.</p>
                            <div className="text-5xl font-extrabold text-primary-900 mb-3">Free</div>
                            <p className="text-base text-ink-500 mb-10 font-medium">3 cases per month</p>
                            <Link
                                href="/signup"
                                className="block w-full bg-primary-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition-colors"
                            >
                                Try Now
                            </Link>
                        </div>

                        {/* Firms & Teams */}
                        <div className="bg-surface-050 p-10 rounded-xl border border-border-200 text-center shadow-sm">
                            <h3 className="text-2xl font-bold text-primary-900 mb-3">Firms & Teams</h3>
                            <p className="text-base text-ink-500 mb-8 font-medium">Advanced collaboration, custom integrations, and dedicated support.</p>
                            <div className="text-2xl font-bold text-accent-600 mb-10 py-4">Talk to Us</div>
                            <Link
                                href="/contact"
                                className="block w-full bg-white border border-border-300 text-ink-900 py-4 rounded-lg font-bold text-lg hover:bg-surface-50 transition-colors"
                            >
                                Book a Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-8">
                        Stop Researching. Start Winning.
                    </h2>
                    <p className="text-2xl text-ink-600 mb-12 font-medium">
                        Gain an unbeatable strategic advantage. Join thousands of lawyers who are building stronger cases with Legal Case Analysis.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block bg-primary-900 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition-colors"
                    >
                        Get Your Edge Today
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
