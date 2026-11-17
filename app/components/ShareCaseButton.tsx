"use client";

import { useState } from "react";

export default function ShareCaseButton({
    caseId,
    isAuthenticated,
    isOwner,
    shareToken,
    onShareTokenChange,
    onRequireAuth,
    className,
    label = "Share",
}: {
    caseId?: string;
    isAuthenticated: boolean;
    isOwner: boolean;
    shareToken?: string | null;
    onShareTokenChange?: (token: string | null) => void;
    onRequireAuth?: () => void;
    className?: string;
    label?: string;
}) {
    const [busy, setBusy] = useState(false);
    const buttonClass =
        className ??
        "inline-flex items-center gap-1.5 rounded-lg border border-border-200 bg-surface-050 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-surface-100 sm:text-sm";

    const copy = async (value: string) => {
        await navigator.clipboard.writeText(value);
        alert("Link copied to clipboard");
    };

    const share = async () => {
        if (!isAuthenticated) {
            onRequireAuth?.();
            return;
        }
        if (!isOwner || !caseId) {
            await copy(window.location.href);
            return;
        }

        setBusy(true);
        try {
            const response = await fetch(`/api/cases/${caseId}/share`, { method: "POST" });
            const body = await response.json().catch(() => ({}));
            if (!response.ok || !body.url) {
                alert(body.error || "Could not create a share link");
                return;
            }
            const url = new URL(body.url, window.location.origin).toString();
            onShareTokenChange?.(body.url.split("/").pop() ?? null);
            await copy(url);
        } catch {
            alert("Could not create a share link");
        } finally {
            setBusy(false);
        }
    };

    const stopSharing = async () => {
        if (!isOwner || !caseId) return;
        setBusy(true);
        try {
            const response = await fetch(`/api/cases/${caseId}/share`, { method: "DELETE" });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(body.error || "Could not stop sharing");
                return;
            }
            onShareTokenChange?.(null);
            alert("Sharing stopped");
        } catch {
            alert("Could not stop sharing");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <button type="button" onClick={share} disabled={busy} className={buttonClass} title="Share">
                <span aria-hidden>🔗</span>
                <span className="hidden sm:inline">{busy ? "…" : label}</span>
            </button>
            {isOwner && shareToken ? (
                <button
                    type="button"
                    onClick={stopSharing}
                    disabled={busy}
                    className={buttonClass}
                    title="Stop sharing"
                >
                    <span className="hidden sm:inline">Stop sharing</span>
                    <span className="sm:hidden">Stop</span>
                </button>
            ) : null}
        </>
    );
}
