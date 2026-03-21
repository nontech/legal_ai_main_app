/**
 * Classify extracted `role_in_case` text as plaintiff or defendant for UI highlights.
 * Uses word-boundary matching on the original string (not normalized equality).
 */

export type LitigationSide = "plaintiff" | "defendant";

const PLAINTIFF_RE =
  /\b(plaintiff|petitioner|claimant|complainant|appellant|pursuer|applicant)\b/i;

const DEFENDANT_RE =
  /\b(defendant|respondent|accused|appellee|defender)\b/i;

/**
 * Returns which litigation side the entity appears to represent, or null if unknown/ambiguous.
 */
export function litigationSideFromRole(
  roleInCase: string | undefined | null
): LitigationSide | null {
  const s = (roleInCase ?? "").trim();
  if (!s) return null;
  const hasPlaintiff = PLAINTIFF_RE.test(s);
  const hasDefendant = DEFENDANT_RE.test(s);
  if (hasPlaintiff && !hasDefendant) return "plaintiff";
  if (hasDefendant && !hasPlaintiff) return "defendant";
  return null;
}
