"use client";

import { useState } from "react";

interface Witness {
  id: string;
  name: string;
  role: string;
  testimony: string;
}

interface WitnessesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WitnessesModal({
  isOpen,
  onClose,
}: WitnessesModalProps) {
  const [witnesses, setWitnesses] = useState<Witness[]>([
    {
      id: "1",
      name: "John Smith",
      role: "Eyewitness",
      testimony:
        "I saw the defendant at the scene of the incident at approximately 9:30 PM.",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Expert Witness",
      testimony:
        "Based on forensic analysis, the evidence is consistent with the prosecution's timeline.",
    },
    {
      id: "3",
      name: "Michael Brown",
      role: "Character Witness",
      testimony:
        "I have known the defendant for 10 years and can attest to their good character.",
    },
  ]);

  const [newWitness, setNewWitness] = useState<Partial<Witness>>({
    name: "",
    role: "",
    testimony: "",
  });

  const [isAddingWitness, setIsAddingWitness] = useState(false);

  const handleAddWitness = () => {
    if (newWitness.name && newWitness.role && newWitness.testimony) {
      const witness: Witness = {
        id: Date.now().toString(),
        name: newWitness.name,
        role: newWitness.role,
        testimony: newWitness.testimony,
      };
      setWitnesses([...witnesses, witness]);
      setNewWitness({ name: "", role: "", testimony: "" });
      setIsAddingWitness(false);
    }
  };

  const handleRemoveWitness = (id: string) => {
    setWitnesses(witnesses.filter((w) => w.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">👥</span>
              <div>
                <h2 className="text-2xl font-bold">
                  Key Witness & Testimony
                </h2>
                <p className="text-blue-100 text-sm">
                  Manage and review witness statements
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Add Witness Button */}
          {!isAddingWitness && (
            <button
              onClick={() => setIsAddingWitness(true)}
              className="w-full bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Add New Witness
            </button>
          )}

          {/* Add Witness Form */}
          {isAddingWitness && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">
                Add New Witness
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newWitness.name || ""}
                  onChange={(e) =>
                    setNewWitness({
                      ...newWitness,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter witness name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={newWitness.role || ""}
                  onChange={(e) =>
                    setNewWitness({
                      ...newWitness,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Eyewitness, Expert Witness"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimony
                </label>
                <textarea
                  value={newWitness.testimony || ""}
                  onChange={(e) =>
                    setNewWitness({
                      ...newWitness,
                      testimony: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter witness testimony or statement"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddWitness}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Witness
                </button>
                <button
                  onClick={() => {
                    setIsAddingWitness(false);
                    setNewWitness({
                      name: "",
                      role: "",
                      testimony: "",
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Witnesses List */}
          <div className="space-y-3">
            {witnesses.map((witness) => (
              <div
                key={witness.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {witness.name}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-1">
                      {witness.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveWitness(witness.id)}
                    className="text-red-600 hover:bg-red-50 rounded-full p-2 transition-colors"
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
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {witness.testimony}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Total Witnesses
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {witnesses.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Completion Status
                </p>
                <p className="text-2xl font-bold text-green-600">
                  60%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

