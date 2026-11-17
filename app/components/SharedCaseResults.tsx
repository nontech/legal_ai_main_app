"use client";

import GamePlanDisplay, { type GamePlanData } from "./GamePlanDisplay";
import ResultsStep from "./ResultsStep";
import type { SharedCaseView } from "@/lib/caseShare";

export default function SharedCaseResults({ data }: { data: SharedCaseView }) {
    return (
        <div className="space-y-10">
            {data.result ? (
                <ResultsStep readOnly initialSnapshot={data} />
            ) : (
                <p className="text-sm text-ink-600">This shared case does not include an analysis yet.</p>
            )}
            {data.game_plan ? (
                <section className="overflow-hidden rounded-2xl border border-border-200 bg-surface-000 p-4 sm:p-6">
                    <GamePlanDisplay gamePlan={data.game_plan as GamePlanData} readOnly />
                </section>
            ) : null}
        </div>
    );
}
