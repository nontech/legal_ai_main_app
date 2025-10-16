"use client";

import { useState } from "react";

interface Charge {
  id: string;
  statuteNumber: string;
  chargeDescription: string;
  essentialFacts: string;
  defendantPlea: string;
}

export default function ChargesSection() {
  const [selectedCourt, setSelectedCourt] = useState("federal");
  const [selectedCaseType, setSelectedCaseType] =
    useState("indictment");
  const [charges, setCharges] = useState<Charge[]>([
    {
      id: "1",
      statuteNumber: "",
      chargeDescription: "",
      essentialFacts: "",
      defendantPlea: "not-guilty",
    },
  ]);
  const [expandedCharge, setExpandedCharge] = useState<string>("1");

  // Court Details
  const [jurisdiction, setJurisdiction] = useState("");
  const [caseNumber, setCaseNumber] = useState("");

  // Defendant Details
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  // Signatures
  const [officerName, setOfficerName] = useState("");
  const [prosecutorName, setProsecutorName] = useState("");
  const [signatureDate, setSignatureDate] = useState("");

  const courtTypes = {
    federal: {
      title: "Federal Courts",
      description:
        "Handle cases involving federal law, U.S. Constitution, disputes between states, and cases where the U.S. government is a party.",
      icon: (
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
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
    },
    state: {
      title: "State Courts",
      description:
        "Handle the majority of legal matters including criminal cases, contract disputes, family law, and personal injury cases.",
      icon: (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    tribal: {
      title: "Tribal Courts",
      description:
        "Established by Native American tribes to govern internal affairs and legal matters within reservations.",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    military: {
      title: "Military Courts",
      description:
        "Part of military justice system handling offenses by service members and military property matters.",
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  };

  const caseTypes = {
    indictment: {
      title: "Indictment",
      description: "Felonies returned by grand jury after review",
    },
    felony: {
      title: "Felony Cases",
      description:
        "Serious crimes punishable by more than one year in prison",
    },
    misdemeanor: {
      title: "Misdemeanor",
      description: "Less serious crimes with lighter penalties",
    },
    complaint: {
      title: "Criminal Complaint",
      description:
        "Filed by law enforcement or prosecutors in early stages",
    },
  };

  const addCharge = () => {
    const newId = (charges.length + 1).toString();
    setCharges([
      ...charges,
      {
        id: newId,
        statuteNumber: "",
        chargeDescription: "",
        essentialFacts: "",
        defendantPlea: "not-guilty",
      },
    ]);
    setExpandedCharge(newId);
  };

  const removeCharge = (id: string) => {
    if (charges.length > 1) {
      setCharges(charges.filter((charge) => charge.id !== id));
    }
  };

  const updateCharge = (
    id: string,
    field: keyof Charge,
    value: string
  ) => {
    setCharges(
      charges.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const toggleCharge = (id: string) => {
    setExpandedCharge(expandedCharge === id ? "" : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mr-3">
            <svg
              className="w-6 h-6 text-amber-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Charges
            </h2>
            <p className="text-sm text-gray-600">
              Charge Sheet & Court Type
            </p>
          </div>
        </div>
      </div>

      {/* Responsible Court */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-700 mr-2"
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
          <h3 className="text-lg font-semibold text-gray-900">
            Responsible Court
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(courtTypes).map(([key, court]) => (
            <button
              key={key}
              onClick={() => setSelectedCourt(key)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedCourt === key
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedCourt === key
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {court.icon}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">
                    {court.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {court.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Case Type */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-700 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">
            Case Type
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(caseTypes).map(([key, caseType]) => (
            <button
              key={key}
              onClick={() => setSelectedCaseType(key)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedCaseType === key
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <h4 className="font-semibold text-gray-900">
                {caseType.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {caseType.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Charge Sheet */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-700 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">
            Charge Sheet
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Fill out the formal charge sheet structure based on the
          selected court type
        </p>

        {/* Court Details */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Court Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jurisdiction
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g., District Court, Eastern District"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Number
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="e.g., CR-2024-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Defendant Details */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            Defendant Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Defendant's full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Defendant's address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Charges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Charges</h4>
            <button
              onClick={addCharge}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Charge
            </button>
          </div>

          <div className="space-y-3">
            {charges.map((charge, index) => (
              <div
                key={charge.id}
                className="border-l-4 border-gray-900 bg-gray-50 rounded-r-lg overflow-hidden"
              >
                {/* Charge Header - Collapsible */}
                <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer">
                  <div
                    className="flex items-center flex-1"
                    onClick={() => toggleCharge(charge.id)}
                  >
                    <span className="font-semibold text-gray-900">
                      Count {index + 1}
                    </span>
                    {charge.chargeDescription && (
                      <span className="ml-3 text-sm text-gray-600">
                        - {charge.chargeDescription}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {charges.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCharge(charge.id);
                        }}
                        className="mr-2 p-1 text-red-600 hover:bg-red-50 rounded"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        expandedCharge === charge.id
                          ? "rotate-180"
                          : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => toggleCharge(charge.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Charge Details - Expandable */}
                {expandedCharge === charge.id && (
                  <div className="px-4 pb-4 space-y-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statute Number
                        </label>
                        <input
                          type="text"
                          value={charge.statuteNumber}
                          onChange={(e) =>
                            updateCharge(
                              charge.id,
                              "statuteNumber",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 18 U.S.C. § 1341"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Charge Description
                        </label>
                        <input
                          type="text"
                          value={charge.chargeDescription}
                          onChange={(e) =>
                            updateCharge(
                              charge.id,
                              "chargeDescription",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Mail Fraud"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Essential Facts{" "}
                        <span className="text-amber-600">ℹ️</span>
                      </label>
                      <textarea
                        value={charge.essentialFacts}
                        onChange={(e) =>
                          updateCharge(
                            charge.id,
                            "essentialFacts",
                            e.target.value
                          )
                        }
                        placeholder="Brief factual allegations supporting this charge..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Defendant's Plea
                      </label>
                      <select
                        value={charge.defendantPlea}
                        onChange={(e) =>
                          updateCharge(
                            charge.id,
                            "defendantPlea",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white"
                      >
                        <option value="not-guilty">Not Guilty</option>
                        <option value="guilty">Guilty</option>
                        <option value="no-contest">No Contest</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            Signatures
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Officer Signature
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Officer name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prosecutor Signature
              </label>
              <input
                type="text"
                value={prosecutorName}
                onChange={(e) => setProsecutorName(e.target.value)}
                placeholder="Prosecutor name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
