import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SharedCaseResults from "@/app/components/SharedCaseResults";
import { loadSharedCase } from "@/lib/loadSharedCase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Shared case analysis",
    robots: { index: false, follow: false },
};

export default async function SharedCasePage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const shared = await loadSharedCase(token);
    if (!shared) notFound();

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                Read-only
            </p>
            <h1 className="mb-6 font-display text-3xl font-bold text-ink-900">{shared.title}</h1>
            <SharedCaseResults data={shared} />
        </main>
    );
}
