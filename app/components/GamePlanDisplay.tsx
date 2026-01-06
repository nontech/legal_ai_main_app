"use client";

import { useState } from "react";
import { Printer, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface GamePlanData {
    closing?: any;
    opening?: any;
    witness?: any;
    evidence?: any;
    metadata?: any;
}

type TabType = "opening" | "evidence" | "witness" | "closing";

export default function GamePlanDisplay({ gamePlan }: { gamePlan: GamePlanData }) {
    const t = useTranslations("caseAnalysis.gamePlan");
    const [activeTab, setActiveTab] = useState<TabType>("opening");

    const tabs: { id: TabType; label: string; icon: string; color: string }[] = [
        { id: "opening", label: t("tabs.opening"), icon: "🎤", color: "purple" },
        { id: "evidence", label: t("tabs.evidence"), icon: "🔍", color: "blue" },
        { id: "witness", label: t("tabs.witness"), icon: "👤", color: "green" },
        { id: "closing", label: t("tabs.closing"), icon: "🎯", color: "red" },
    ];

    const renderOpeningStatement = () => {
        const opening = gamePlan.opening?.opening_statement;
        if (!opening) return null;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("openingStatement.title")}</h2>
                    <p className="text-gray-600">{t("openingStatement.subtitle")}</p>
                </div>

                {/* Core Theme */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">{t("openingStatement.coreTheme")}</h3>
                    <p className="text-gray-800">{opening.core_theme}</p>
                </div>

                {/* Introduction */}
                {opening.detailed_structure?.introduction && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📢</span> {t("openingStatement.introduction")}
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2">{t("openingStatement.hook")}:</p>
                                <p className="text-gray-800">{opening.detailed_structure.introduction.hook}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.keyPoints")}:</p>
                                <div className="space-y-2">
                                    {opening.detailed_structure.introduction.key_points?.map(
                                        (point: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-gray-400">•</span>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">⏱️ {t("openingStatement.duration", { minutes: opening.detailed_structure.introduction.duration_minutes })}</p>
                        </div>
                    </div>
                )}

                {/* Case Overview */}
                {opening.detailed_structure?.case_overview && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📖</span> {t("openingStatement.caseOverview")}
                        </h3>
                        <div className="space-y-4">
                            <p className="text-gray-700 italic">{opening.detailed_structure.case_overview.narrative_flow}</p>
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.keyPoints")}:</p>
                                <div className="space-y-2">
                                    {opening.detailed_structure.case_overview.key_points?.map(
                                        (point: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-gray-400">•</span>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">⏱️ {t("openingStatement.duration", { minutes: opening.detailed_structure.case_overview.duration_minutes })}</p>
                        </div>
                    </div>
                )}

                {/* Legal Framework */}
                {opening.detailed_structure?.legal_framework && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>⚖️</span> {t("openingStatement.legalFramework")}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.keyPoints")}:</p>
                                <div className="space-y-2">
                                    {opening.detailed_structure.legal_framework.key_points?.map(
                                        (point: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-gray-400">•</span>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            {opening.detailed_structure.legal_framework.applicable_laws && (
                                <div>
                                    <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.applicableLaws")}:</p>
                                    <div className="space-y-1">
                                        {opening.detailed_structure.legal_framework.applicable_laws?.map(
                                            (law: string, idx: number) => (
                                                <p key={idx} className="text-gray-700 text-sm">◆ {law}</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-gray-500">⏱️ {t("openingStatement.duration", { minutes: opening.detailed_structure.legal_framework.duration_minutes })}</p>
                        </div>
                    </div>
                )}

                {/* Evidence Preview */}
                {opening.detailed_structure?.evidence_preview && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🔍</span> {t("openingStatement.evidencePreview")}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.keyPoints")}:</p>
                                <div className="space-y-2">
                                    {opening.detailed_structure.evidence_preview.key_points?.map(
                                        (point: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-gray-400">•</span>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            {opening.detailed_structure.evidence_preview.evidence_highlights && (
                                <div>
                                    <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.evidenceHighlights")}:</p>
                                    <div className="space-y-2">
                                        {opening.detailed_structure.evidence_preview.evidence_highlights?.map(
                                            (highlight: string, idx: number) => (
                                                <div key={idx} className="text-gray-700 text-sm bg-gray-50 p-2 rounded">
                                                    • {highlight}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-gray-500">⏱️ {t("openingStatement.duration", { minutes: opening.detailed_structure.evidence_preview.duration_minutes })}</p>
                        </div>
                    </div>
                )}

                {/* Conclusion */}
                {opening.detailed_structure?.conclusion && (
                    <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>✅</span> {t("openingStatement.conclusion")}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">{t("openingStatement.keyPoints")}:</p>
                                <div className="space-y-2">
                                    {opening.detailed_structure.conclusion.key_points?.map(
                                        (point: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-gray-400">•</span>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2">{t("openingStatement.callToAction")}:</p>
                                <p className="text-gray-800 text-sm">{opening.detailed_structure.conclusion.call_to_action}</p>
                            </div>
                            <p className="text-sm text-gray-500">⏱️ {t("openingStatement.duration", { minutes: opening.detailed_structure.conclusion.duration_minutes })}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderEvidenceStrategy = () => {
        const evidence = gamePlan.evidence;
        if (!evidence) return null;

        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("evidenceStrategy.title")}</h2>
                    <p className="text-gray-600">{t("evidenceStrategy.subtitle")}</p>
                </div>

                {/* Presentation Order */}
                {evidence.presentation_order && Array.isArray(evidence.presentation_order) && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📊</span> {t("evidenceStrategy.presentationOrder")}
                        </h3>
                        <div className="space-y-3">
                            {evidence.presentation_order?.map(
                                (item: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                                        <div className="flex items-start gap-3">
                                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {item.sequence}
                                            </span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{item.evidence_item}</p>
                                                <p className="text-gray-700 text-sm mt-1">{item.rationale}</p>
                                                <p className="text-gray-500 text-sm mt-2">⏱️ {t("minutes", { count: item.estimated_time_minutes })}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Documentary Evidence */}
                {evidence.documentary_evidence && Array.isArray(evidence.documentary_evidence) && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📄</span> {t("evidenceStrategy.documentaryEvidence")}
                        </h3>
                        <div className="space-y-4">
                            {evidence.documentary_evidence?.map(
                                (doc: any, idx: number) => (
                                    <div key={idx} className="border-l-4 border-gray-300 pl-4 py-2">
                                        <h4 className="font-semibold text-gray-900 mb-2">{doc.evidence_type}</h4>
                                        <div className="space-y-1">
                                            {doc.documents?.map(
                                                (d: string, didx: number) => (
                                                    <p key={didx} className="text-gray-700 text-sm">• {d}</p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderWitnessStrategy = () => {
        const witness = gamePlan.witness;
        if (!witness) return null;

        return (
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("witnessStrategy.title")}</h2>
                    <p className="text-gray-600">{t("witnessStrategy.subtitle")}</p>
                </div>

                {/* Cross Examination */}
                {witness.cross_examination && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>⚔️</span> {t("witnessStrategy.crossExamination")}
                        </h3>
                        <div className="space-y-4">
                            {witness.cross_examination.core_strategy && (
                                <div className="bg-red-50 p-4 rounded border border-red-200">
                                    <p className="font-semibold text-red-900 mb-2">{t("witnessStrategy.overallApproach")}:</p>
                                    <p className="text-gray-800 text-sm">{witness.cross_examination.core_strategy.overall_approach}</p>
                                </div>
                            )}
                            {witness.cross_examination.primary_objectives && (
                                <div>
                                    <p className="font-semibold text-gray-900 mb-2">{t("witnessStrategy.primaryObjectives")}:</p>
                                    <div className="space-y-2">
                                        {witness.cross_examination.primary_objectives?.map(
                                            (obj: string, idx: number) => (
                                                <div key={idx} className="flex gap-3">
                                                    <span className="text-gray-400">•</span>
                                                    <p className="text-gray-700">{obj}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Direct Examination */}
                {witness.direct_examination && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📝</span> {t("witnessStrategy.directExamination")}
                        </h3>
                        <div className="space-y-4">
                            {witness.direct_examination.key_techniques?.map(
                                (tech: any, idx: number) => (
                                    <div key={idx} className="bg-blue-50 p-4 rounded border border-blue-200">
                                        <p className="font-semibold text-blue-900 mb-2">{tech.technique}</p>
                                        <p className="text-gray-800 text-sm">{tech.application}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderClosingArgument = () => {
        const closing = gamePlan.closing?.closing_argument;
        if (!closing) return null;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("trialStrategy.title")}</h2>
                    <p className="text-gray-600">{t("trialStrategy.subtitle")}</p>
                </div>

                {/* Core Theme */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">{t("openingStatement.coreTheme")}</h3>
                    <p className="text-gray-800">{closing.core_theme}</p>
                </div>

                {/* Closing Argument Sections */}
                {closing.structured_flow?.final_appeal && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🎯</span> {t("trialStrategy.finalAppeal")}
                        </h3>
                        <div className="space-y-4">
                            {closing.structured_flow.final_appeal.key_points?.map(
                                (point: string, idx: number) => (
                                    <div key={idx} className="flex gap-3">
                                        <span className="text-gray-400 font-bold flex-shrink-0">•</span>
                                        <p className="text-gray-700">{point}</p>
                                    </div>
                                )
                            )}
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded">
                                <p className="font-semibold text-amber-900 mb-2">{t("openingStatement.callToAction")}:</p>
                                <p className="text-gray-800">{closing.structured_flow.final_appeal.call_to_action}</p>
                            </div>
                            <p className="text-sm text-gray-500 pt-2">
                                ⏱️ {t("openingStatement.duration", { minutes: closing.structured_flow.final_appeal.duration_minutes })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Restate Case */}
                {closing.structured_flow?.restate_case && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📋</span> {t("trialStrategy.restateCase")}
                        </h3>
                        <div className="space-y-4">
                            <p className="text-gray-700 italic">{closing.structured_flow.restate_case.narrative_summary}</p>
                            <div className="space-y-2">
                                {closing.structured_flow.restate_case.key_points?.map(
                                    (point: string, idx: number) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="text-gray-400">✓</span>
                                            <p className="text-gray-700">{point}</p>
                                        </div>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-gray-500 pt-2">
                                ⏱️ {t("openingStatement.duration", { minutes: closing.structured_flow.restate_case.duration_minutes })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Legal Argument */}
                {closing.structured_flow?.legal_argument && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>⚖️</span> {t("trialStrategy.legalArguments")}
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="font-semibold text-gray-900 mb-3">{t("openingStatement.keyPoints")}:</p>
                                <div className="space-y-2">
                                    {closing.structured_flow.legal_argument.key_points?.map(
                                        (point: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-gray-400">•</span>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2">{t("trialStrategy.burdenOfProof")}:</p>
                                <p className="text-gray-800 text-sm">{closing.structured_flow.legal_argument.burden_of_proof_analysis}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                ⏱️ {t("openingStatement.duration", { minutes: closing.structured_flow.legal_argument.duration_minutes })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Emotional Appeal */}
                {closing.structured_flow?.emotional_appeal && (
                    <div className="border border-gray-200 rounded-lg p-6 bg-red-50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>💭</span> {t("trialStrategy.emotionalAppeal")}
                        </h3>
                        <div className="space-y-4">
                            <p className="text-gray-700 italic">{closing.structured_flow.emotional_appeal.persuasion_approach}</p>
                            <div className="space-y-2">
                                {closing.structured_flow.emotional_appeal.key_points?.map(
                                    (point: string, idx: number) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="text-gray-400">◆</span>
                                            <p className="text-gray-700">{point}</p>
                                        </div>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-gray-500 pt-2">
                                ⏱️ {t("openingStatement.duration", { minutes: closing.structured_flow.emotional_appeal.duration_minutes })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Address Weaknesses */}
                {closing.structured_flow?.address_weaknesses && (
                    <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>⚠️</span> {t("trialStrategy.addressWeaknesses")}
                        </h3>
                        <div className="space-y-4">
                            <p className="text-gray-700 italic">{closing.structured_flow.address_weaknesses.rebuttal_strategy}</p>
                            <div className="space-y-2">
                                {closing.structured_flow.address_weaknesses.key_points?.map(
                                    (point: string, idx: number) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="text-yellow-600 font-bold">→</span>
                                            <p className="text-gray-700">{point}</p>
                                        </div>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-gray-500 pt-2">
                                ⏱️ {t("openingStatement.duration", { minutes: closing.structured_flow.address_weaknesses.duration_minutes })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Evidence Synthesis */}
                {closing.structured_flow?.evidence_synthesis && (
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🔗</span> {t("trialStrategy.evidenceSynthesis")}
                        </h3>
                        <div className="space-y-4">
                            <p className="text-gray-700 italic">{closing.structured_flow.evidence_synthesis.connecting_threads}</p>
                            <div className="space-y-2">
                                {closing.structured_flow.evidence_synthesis.key_points?.map(
                                    (point: string, idx: number) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="text-gray-400">◆</span>
                                            <p className="text-gray-700">{point}</p>
                                        </div>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-gray-500 pt-2">
                                ⏱️ {t("openingStatement.duration", { minutes: closing.structured_flow.evidence_synthesis.duration_minutes })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Advanced Persuasion */}
                {closing.advanced_persuasion && (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <span>🎭</span> {t("trialStrategy.advancedPersuasion")}
                        </h3>

                        {/* Ethos */}
                        {closing.advanced_persuasion.ethos && (
                            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                                <h4 className="text-lg font-bold text-green-900 mb-3">{t("trialStrategy.ethos")}</h4>
                                <p className="text-gray-700 mb-3">{closing.advanced_persuasion.ethos.application}</p>
                                <div className="space-y-2">
                                    {closing.advanced_persuasion.ethos.credibility_building?.map(
                                        (item: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <span className="text-green-600">✓</span>
                                                <p className="text-gray-700 text-sm">{item}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Logos */}
                        {closing.advanced_persuasion.logos && (
                            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                                <h4 className="text-lg font-bold text-blue-900 mb-3">{t("trialStrategy.logos")}</h4>
                                <p className="text-gray-700 mb-3">{closing.advanced_persuasion.logos.application}</p>
                                <div className="space-y-2">
                                    {closing.advanced_persuasion.logos.logical_argument?.map(
                                        (item: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <span className="text-blue-600">→</span>
                                                <p className="text-gray-700 text-sm">{item}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pathos */}
                        {closing.advanced_persuasion.pathos && (
                            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                                <h4 className="text-lg font-bold text-red-900 mb-3">{t("trialStrategy.pathos")}</h4>
                                <p className="text-gray-700 mb-3">{closing.advanced_persuasion.pathos.application}</p>
                                <div className="space-y-2">
                                    {closing.advanced_persuasion.pathos.emotional_connection?.map(
                                        (item: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <span className="text-red-600">◆</span>
                                                <p className="text-gray-700 text-sm">{item}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Critical Guidelines */}
                {closing.critical_guidelines && closing.critical_guidelines.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded">
                        <h3 className="text-lg font-bold text-red-900 mb-3">⚡ {t("trialStrategy.criticalGuidelines")}</h3>
                        <div className="space-y-2">
                            {closing.critical_guidelines.map((guideline: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="text-red-600 font-bold">!</span>
                                    <p className="text-gray-800">{guideline}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getTabContent = () => {
        switch (activeTab) {
            case "opening":
                return renderOpeningStatement();
            case "evidence":
                return renderEvidenceStrategy();
            case "witness":
                return renderWitnessStrategy();
            case "closing":
                return renderClosingArgument();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">
                            📋
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
                            <p className="text-sm text-gray-600">{t("subtitle")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Printer className="w-5 h-5" />
                            <span>{t("print")}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Share2 className="w-5 h-5" />
                            <span>{t("share")}</span>
                        </button>
                    </div>
                </div>

                {/* Horizontal Tabs */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-2 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === tab.id
                                    ? `cursor-pointer border-${tab.color}-500 text-${tab.color}-700 bg-${tab.color}-50`
                                    : "cursor-pointer border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    {getTabContent()}
                </div>
            </div>
        </div>
    );
}
