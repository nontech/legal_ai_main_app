"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import {
    Shield,
    FileText,
    MessageSquare,
    Scale,
    CheckCircle2,
    Upload,
    HelpCircle,
    FileCheck,
    Briefcase,
    Home,
    AlertTriangle,
    ArrowRight,
    Clock,
    Lock,
    Cpu
} from "lucide-react";

export default function IndividualsPage() {
    return (
        <div className="min-h-screen bg-surface-100 text-ink-900 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-900 mb-8 leading-tight tracking-tight">
                        Know Your Rights Before You Spend on a Lawyer
                    </h1>
                    <p className="text-2xl text-ink-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        Upload your documents, answer a few questions, and get a clear, plain‑language view of your legal situation – in minutes, not weeks. Know whether you have a case, what to do next, and when it’s worth speaking to a lawyer.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/case-analysis"
                            className="bg-primary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors w-full sm:w-auto"
                        >
                            Check Your Case Strength Now
                        </Link>
                    </div>
                    <p className="text-sm text-ink-500 mt-6 max-w-2xl mx-auto font-medium">
                        No legal jargon. No commitment. Just structured, unbiased guidance so you don’t miss important deadlines or make decisions in the dark.
                    </p>
                </div>
            </section>

            {/* Who Lawgorithm Helps */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Who Lawgorithm Helps
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Lawgorithm is built for people suddenly thrown into stressful legal situations – especially in Germany and the EU.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Employees */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-200">
                            <div className="w-12 h-12 bg-surface-200 rounded-lg flex items-center justify-center mb-6 text-primary-700">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-3">Employees</h3>
                            <p className="text-ink-600 text-base leading-relaxed">
                                Dealing with termination, warning letters, unfair treatment, unpaid salary, or severance disputes.
                            </p>
                        </div>

                        {/* Tenants */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-200">
                            <div className="w-12 h-12 bg-surface-200 rounded-lg flex items-center justify-center mb-6 text-primary-700">
                                <Home className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-3">Tenants</h3>
                            <p className="text-ink-600 text-base leading-relaxed">
                                Facing eviction threats, deposit conflicts, rent increases, or habitability issues.
                            </p>
                        </div>

                        {/* Consumers */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-200">
                            <div className="w-12 h-12 bg-surface-200 rounded-lg flex items-center justify-center mb-6 text-primary-700">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-3">Consumers</h3>
                            <p className="text-ink-600 text-base leading-relaxed">
                                Who receive debt collection letters or find themselves in contract disputes.
                            </p>
                        </div>

                        {/* Small Claims */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-200">
                            <div className="w-12 h-12 bg-surface-200 rounded-lg flex items-center justify-center mb-6 text-primary-700">
                                <Scale className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-3">Small Claims</h3>
                            <p className="text-ink-600 text-base leading-relaxed">
                                Contractor conflicts, minor property damage, and similar everyday disputes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why People Use Lawgorithm (Before vs After) */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Why People Use Lawgorithm
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Lawgorithm turns uncertainty into a concrete plan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm">
                            <div className="mb-4">
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Before</span>
                            </div>
                            <p className="text-ink-500 italic mb-6">"I have no idea if I even have a chance."</p>
                            <div className="h-px bg-border-200 mb-6"></div>
                            <div className="mb-4">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">After</span>
                            </div>
                            <p className="text-primary-900 font-medium">A clear "yes / no / maybe" assessment with reasons in plain language.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm">
                            <div className="mb-4">
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Before</span>
                            </div>
                            <p className="text-ink-500 italic mb-6">"I’m scared I’ll miss a deadline."</p>
                            <div className="h-px bg-border-200 mb-6"></div>
                            <div className="mb-4">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">After</span>
                            </div>
                            <p className="text-primary-900 font-medium">Automatic alerts for key time limits and suggested next steps.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm">
                            <div className="mb-4">
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Before</span>
                            </div>
                            <p className="text-ink-500 italic mb-6">"Is this worth spending hundreds of euros on a lawyer?"</p>
                            <div className="h-px bg-border-200 mb-6"></div>
                            <div className="mb-4">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">After</span>
                            </div>
                            <p className="text-primary-900 font-medium">A preliminary view of case strength, likely outcomes, and whether legal fees make sense.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            What You Get
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-700">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-primary-900 mb-3">1. Clear Case Strength Assessment</h3>
                                <p className="text-ink-600 mb-2">Upload your documents and describe what happened. Lawgorithm analyzes your situation and gives you:</p>
                                <ul className="space-y-2 text-ink-600">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> A straightforward case strength indicator: strong, uncertain, or weak</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Key arguments in your favor – and potential problems</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Context from similar situations</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-700">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-primary-900 mb-3">2. Step‑By‑Step Next Actions</h3>
                                <p className="text-ink-600 mb-2">Instead of generic advice, you receive:</p>
                                <ul className="space-y-2 text-ink-600">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> A personalized checklist tailored to your case type</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Guidance on preserving and gathering documents</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Overview of relevant options: negotiation, mediation, or court</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-700">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-primary-900 mb-3">3. Likely Outcomes – Before You Spend Money</h3>
                                <p className="text-ink-600 mb-2">Get a realistic sense of:</p>
                                <ul className="space-y-2 text-ink-600">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Possible outcomes (win, settlement, dismissal) in ranges</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Typical settlement ranges for similar situations</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Cost‑benefit view: likely recovery vs. expected legal costs</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-700">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-primary-900 mb-3">4. Document & Evidence Checklist</h3>
                                <p className="text-ink-600 mb-2">Lawgorithm helps you get organized:</p>
                                <ul className="space-y-2 text-ink-600">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Checklist of documents you should collect</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Gap analysis: what’s missing and why it matters</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" /> Basic “strategy preview” – what to emphasize</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Persona Routing */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Start From Your Situation
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Pick the scenario that fits you best.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm hover:border-primary-300 transition-colors cursor-pointer group">
                            <div className="w-14 h-14 bg-surface-200 rounded-full flex items-center justify-center mb-6 text-primary-700 group-hover:bg-primary-100 transition-colors">
                                <Briefcase className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">For Employees</h3>
                            <p className="text-ink-600 mb-4 italic">"I was fired, warned, or treated unfairly at work."</p>
                            <p className="text-ink-600 text-sm">Understand if protections like the German Employment Protection Act (KSchG) may apply and what the usual steps look like.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm hover:border-primary-300 transition-colors cursor-pointer group">
                            <div className="w-14 h-14 bg-surface-200 rounded-full flex items-center justify-center mb-6 text-primary-700 group-hover:bg-primary-100 transition-colors">
                                <Home className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">For Tenants</h3>
                            <p className="text-ink-600 mb-4 italic">"My landlord keeps part of my deposit, raises rent, or threatens eviction."</p>
                            <p className="text-ink-600 text-sm">See what tenant rights under German rental law (Mietrecht) typically look like and what you can realistically demand.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm hover:border-primary-300 transition-colors cursor-pointer group">
                            <div className="w-14 h-14 bg-surface-200 rounded-full flex items-center justify-center mb-6 text-primary-700 group-hover:bg-primary-100 transition-colors">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">For Other Disputes</h3>
                            <p className="text-ink-600 mb-4 italic">"I received a payment demand, contract penalty, or had an issue with a contractor."</p>
                            <p className="text-ink-600 text-sm">Learn how similar small-claims disputes are usually resolved, and how to prepare.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-0.5 bg-border-300 -z-10"></div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 border-4 border-surface-100 shadow-sm">
                                <Upload className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">1. Upload Documents</h3>
                            <p className="text-ink-600 text-base leading-relaxed max-w-xs mx-auto font-medium">
                                Securely upload letters, emails, contracts, dismissal notices, rental agreements, and other relevant files. No formatting needed.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 border-4 border-surface-100 shadow-sm">
                                <Cpu className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">2. AI Analyzes</h3>
                            <p className="text-ink-600 text-base leading-relaxed max-w-xs mx-auto font-medium">
                                System matches your case against 500k+ similar cases, judges historical patterns, and settlement data.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-700 border-4 border-surface-100 shadow-sm">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">3. Get Assessment</h3>
                            <p className="text-ink-600 text-base leading-relaxed max-w-xs mx-auto font-medium">
                                Clear summary of where you stand legally, key deadlines, and recommended next steps.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Outcomes & Stories */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Real Scenarios
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm">
                            <h3 className="text-xl font-bold text-primary-900 mb-4">"I was fired without warning."</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-ink-500 uppercase tracking-wide mb-1">Before</p>
                                    <p className="text-ink-600 text-sm">No idea if the termination was legal, scared to confront employer.</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-1">After</p>
                                    <p className="text-primary-900 font-medium text-sm">Understood the 3‑week deadline, got a realistic settlement expectation, and went into a lawyer meeting prepared.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm">
                            <h3 className="text-xl font-bold text-primary-900 mb-4">"My landlord kept most of my deposit."</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-ink-500 uppercase tracking-wide mb-1">Before</p>
                                    <p className="text-ink-600 text-sm">Hours of Googling, conflicting advice, and fear of high legal costs.</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-1">After</p>
                                    <p className="text-primary-900 font-medium text-sm">Clear assessment of which damages were valid vs unfair, plus a step‑by‑step plan for negotiation.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-border-200 shadow-sm">
                            <h3 className="text-xl font-bold text-primary-900 mb-4">"I received a debt collection letter."</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-ink-500 uppercase tracking-wide mb-1">Before</p>
                                    <p className="text-ink-600 text-sm">Anxiety, fear of court, and pressure to pay immediately.</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-1">After</p>
                                    <p className="text-primary-900 font-medium text-sm">Understood what the letter meant, what the collector could (and couldn’t) do, and how to respond.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proof & Safety */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl border border-border-200 shadow-sm">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-primary-900 mb-4">
                            Designed for Sensitive Legal Situations
                        </h2>
                        <p className="text-ink-600">
                            You stay in control: you choose what to upload, what to keep, and whether to share the output with a lawyer.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-700">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-primary-900 mb-2">German/EU Focus</h3>
                            <p className="text-sm text-ink-600">Built with a focus on local legal procedures and deadlines.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-700">
                                <Scale className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-primary-900 mb-2">Neutral Assistant</h3>
                            <p className="text-sm text-ink-600">Information-focused assistant that helps you prepare for a lawyer.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-700">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-primary-900 mb-2">Data Protection</h3>
                            <p className="text-sm text-ink-600">Privacy by design, aligned with EU expectations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-primary-900 mb-6">
                            Know Before You Pay
                        </h2>
                        <p className="text-xl text-ink-600 max-w-3xl mx-auto font-medium">
                            Lawgorithm is designed to reduce the risk of spending money blindly on legal fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Basic Assessment */}
                        <div className="bg-white p-10 rounded-xl border border-border-200 text-center shadow-sm">
                            <h3 className="text-2xl font-bold text-primary-900 mb-3">Free Basic Assessment</h3>
                            <p className="text-base text-ink-500 mb-8 font-medium">Quick viability signal: does this look worth exploring further? High‑level summary & key deadlines</p>
                            <div className="text-5xl font-extrabold text-primary-900 mb-3">Free</div>
                            <p className="text-base text-ink-500 mb-10 font-medium">3 cases per month</p>
                            <Link
                                href="/upload"
                                className="block w-full bg-primary-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition-colors"
                            >
                                Start Free Assessment
                            </Link>
                        </div>

                        {/* Detailed Paid Assessment */}
                        <div className="bg-surface-050 p-10 rounded-xl border border-border-200 text-center shadow-sm">
                            <h3 className="text-2xl font-bold text-primary-900 mb-3">Detailed Assessment</h3>
                            <p className="text-base text-ink-500 mb-8 font-medium">In‑depth analysis, action plan, and evidence checklist.</p>
                            <div className="text-5xl font-extrabold text-accent-600 mb-3">€1.99</div>
                            <p className="text-base text-ink-500 mb-10 font-medium">per case</p>
                            <Link
                                href="/signup"
                                className="block w-full bg-white border border-border-300 text-ink-900 py-4 rounded-lg font-bold text-lg hover:bg-surface-50 transition-colors"
                            >
                                Get Detailed Report
                            </Link>
                        </div>
                    </div>
                    <p className="text-center text-ink-500 mt-8 max-w-2xl mx-auto text-sm">
                        For more complex cases, we can connect you to partner law firms that receive your structured assessment as a starting point.
                    </p>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-050">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-8">
                        Know Where You Stand – Before the Clock Runs Out
                    </h2>
                    <p className="text-2xl text-ink-600 mb-12 font-medium">
                        Turn anxiety and confusion into a clear plan. Understand your legal options, prepare better for lawyer meetings, and avoid missing important deadlines.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/case-analysis"
                            className="bg-primary-900 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition-colors w-full sm:w-auto"
                        >
                            Check Your Case Strength Now
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
