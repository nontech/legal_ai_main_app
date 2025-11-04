"use client";

import { useState } from "react";

interface CaseType {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  typicalCases: string[];
  standardOfProof: string;
}

interface CompactCaseTypeProps {
  onUpdate?: (caseType: CaseType) => void;
}

export default function CompactCaseType({
  onUpdate,
}: CompactCaseTypeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>({
    id: "civil",
    title: "Civil Law",
    subtitle: "Legal disputes between parties",
    icon: "⚖️",
    typicalCases: [
      "Personal Injury & Negligence Claims",
      "Contract Disputes & Breach of Agreement",
      "Property Disputes & Real Estate Issues",
      "Employment Law & Discrimination",
      "Tort Claims & Damages",
    ],
    standardOfProof: "Preponderance of evidence (51% likelihood)",
  });

  const caseTypes: CaseType[] = [
    {
      id: "tax",
      title: "Tax Law",
      subtitle: "Federal and state tax disputes",
      icon: "💰",
      typicalCases: [
        "IRS Audits & Appeals",
        "Tax Evasion & Fraud Cases",
        "Business Tax Deductions",
        "Estate & Gift Tax Disputes",
        "Tax Court Proceedings",
      ],
      standardOfProof: "Clear and convincing evidence",
    },
    {
      id: "civil",
      title: "Civil Law",
      subtitle: "Legal disputes between parties",
      icon: "⚖️",
      typicalCases: [
        "Personal Injury & Negligence Claims",
        "Contract Disputes & Breach of Agreement",
        "Property Disputes & Real Estate Issues",
        "Employment Law & Discrimination",
        "Tort Claims & Damages",
      ],
      standardOfProof: "Preponderance of evidence (51% likelihood)",
    },
    {
      id: "criminal",
      title: "Criminal Law",
      subtitle: "State/federal prosecution of crimes",
      icon: "🚔",
      typicalCases: [
        "Felonies (Murder, Rape, Robbery)",
        "Misdemeanors (Theft, Assault, DUI)",
        "White Collar Crimes (Fraud, Embezzlement)",
        "Drug Offenses & Trafficking",
        "Domestic Violence & Sexual Assault",
      ],
      standardOfProof: "Beyond reasonable doubt (95%+ certainty)",
    },
    {
      id: "labor",
      title: "Labor Law",
      subtitle: "Workplace rights and employment disputes",
      icon: "👷",
      typicalCases: [
        "Employment Discrimination",
        "Wage & Hour Violations",
        "Union Organizing & Collective Bargaining",
        "Wrongful Termination",
        "Workplace Safety (OSHA) Violations",
      ],
      standardOfProof: "Preponderance of evidence",
    },
    {
      id: "family",
      title: "Family Law",
      subtitle: "Domestic relations and family matters",
      icon: "👨‍👩‍👧‍👦",
      typicalCases: [
        "Divorce & Legal Separation",
        "Child Custody & Visitation Rights",
        "Adoption & Guardianship",
        "Child & Spousal Support",
        "Domestic Violence Protection",
      ],
      standardOfProof:
        "Preponderance of evidence (best interests standard)",
    },
    {
      id: "maritime",
      title: "Maritime Law",
      subtitle: "Nautical and maritime legal matters",
      icon: "⚓",
      typicalCases: [
        "Shipping & Maritime Commerce",
        "Marine Accidents & Collisions",
        "Salvage & Maritime Liens",
        "Crew Injuries & Jones Act Claims",
        "Maritime Insurance Disputes",
      ],
      standardOfProof: "Preponderance of evidence",
    },
    {
      id: "property",
      title: "Property Law",
      subtitle: "Real estate and property rights",
      icon: "🏠",
      typicalCases: [
        "Real Estate Transactions",
        "Landlord-Tenant Disputes",
        "Zoning & Land Use Issues",
        "Property Ownership Disputes",
        "Easements & Property Rights",
      ],
      standardOfProof: "Preponderance of evidence",
    },
    {
      id: "corporate",
      title: "Corporate Law",
      subtitle: "Business operations and commercial disputes",
      icon: "🏢",
      typicalCases: [
        "Mergers & Acquisitions",
        "Securities Fraud & Violations",
        "Corporate Governance Disputes",
        "Shareholder Rights & Litigation",
        "Commercial Contract Disputes",
      ],
      standardOfProof: "Preponderance of evidence",
    },
    {
      id: "immigration",
      title: "Immigration Law",
      subtitle: "Immigration and naturalization matters",
      icon: "🌍",
      typicalCases: [
        "Deportation & Removal Proceedings",
        "Asylum & Refugee Claims",
        "Visa Applications & Denials",
        "Citizenship & Naturalization",
        "Family-Based Immigration",
      ],
      standardOfProof: "Clear and convincing evidence",
    },
    {
      id: "human-rights",
      title: "Human Rights Law",
      subtitle: "Fundamental human rights and freedoms",
      icon: "✊",
      typicalCases: [
        "Civil Rights Violations",
        "Freedom of Speech & Expression",
        "Religious Freedom Cases",
        "Equality & Anti-Discrimination",
        "International Human Rights Violations",
      ],
      standardOfProof: "Preponderance to clear and convincing",
    },
    {
      id: "environmental",
      title: "Environmental Law",
      subtitle: "Environmental protection and regulations",
      icon: "🌱",
      typicalCases: [
        "Pollution & Contamination Claims",
        "Environmental Impact Assessments",
        "Clean Air & Water Act Violations",
        "Hazardous Waste Disposal",
        "Wildlife Protection & Conservation",
      ],
      standardOfProof: "Preponderance of evidence",
    },
    {
      id: "international",
      title: "International Law",
      subtitle: "Cross-border and international disputes",
      icon: "🌐",
      typicalCases: [
        "International Trade Disputes",
        "Treaty Interpretation & Enforcement",
        "Diplomatic Immunity Cases",
        "International Commercial Arbitration",
        "Cross-Border Criminal Matters",
      ],
      standardOfProof: "Varies by jurisdiction and treaty",
    },
  ];

  const handleSelectCaseType = (caseType: CaseType) => {
    setSelectedCaseType(caseType);
    setIsModalOpen(false);
    if (onUpdate) {
      onUpdate(caseType);
    }
  };

  return (
    <>
      <div className="bg-surface-000 rounded-lg border border-border-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3">
              <span className="text-2xl text-primary-600">
                {selectedCaseType.icon}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900">
                Step 2: Case Type{" "}
                <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-ink-600">
                {selectedCaseType.subtitle}
              </p>
            </div>
          </div>

          {/* Centered Case Type Name */}
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-semibold text-ink-900">
              {selectedCaseType.title}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm whitespace-nowrap shadow-sm"
          >
            Change Type
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-primary-950/80 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface-050 shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Select Case Type
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">
                      Choose the fundamental nature of your legal case
                      to ensure accurate analysis and applicable legal
                      standards.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-surface-200 transition-colors ml-4"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseTypes.map((caseType) => (
                    <button
                      key={caseType.id}
                      onClick={() => handleSelectCaseType(caseType)}
                      className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${selectedCaseType.id === caseType.id
                          ? "border-primary-500 bg-primary-100"
                          : "border-border-200 hover:border-primary-300"
                        }`}
                    >
                      <div className="flex items-start mb-2">
                        <div className="text-3xl mr-3 text-primary-600">
                          {caseType.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-ink-900 text-sm mb-1">
                            {caseType.title}
                          </h3>
                          <p className="text-xs text-ink-600 mb-2">
                            {caseType.subtitle}
                          </p>
                        </div>
                        {selectedCaseType.id === caseType.id && (
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-primary-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-ink-600 space-y-1 mb-2">
                        {caseType.typicalCases
                          .slice(0, 3)
                          .map((case_, index) => (
                            <div
                              key={index}
                              className="flex items-start"
                            >
                              <span className="text-primary-500 mr-1">
                                •
                              </span>
                              <span className="line-clamp-1">
                                {case_}
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="text-xs text-ink-500 pt-2 border-t border-border-200">
                        <span className="font-medium">Proof:</span>{" "}
                        {caseType.standardOfProof}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-surface-100 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-surface-200 text-ink-600 rounded-lg hover:bg-surface-200/80 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
