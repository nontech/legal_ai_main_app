const SHARE_TOKEN_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const JURISDICTION_KEYS = [
  "city",
  "state",
  "country",
  "court",
  "court_name",
  "jurisdiction",
] as const;

export type SharedJurisdiction = Record<(typeof JURISDICTION_KEYS)[number], string | null>;

/** Fields a public share page may render. Nothing else leaves the server. */
export type SharedCaseView = {
  title: string;
  case_type: string | null;
  role: string | null;
  jurisdiction: SharedJurisdiction | null;
  result: unknown;
  game_plan: unknown;
};

export function isShareToken(value: string): boolean {
  return SHARE_TOKEN_RE.test(value);
}

export function sharePath(token: string): string {
  return `/share/${encodeURIComponent(token)}`;
}

function textOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sharedJurisdiction(value: unknown): SharedJurisdiction | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const jurisdiction = {} as SharedJurisdiction;
  let any = false;
  for (const key of JURISDICTION_KEYS) {
    const text = textOrNull(source[key]);
    jurisdiction[key] = text;
    if (text) any = true;
  }
  return any ? jurisdiction : null;
}

function caseTitle(caseDetails: unknown): string {
  if (!caseDetails || typeof caseDetails !== "object") return "Shared case";
  const information = (caseDetails as { case_information?: { caseName?: unknown } })
    .case_information;
  return textOrNull(information?.caseName) ?? "Shared case";
}

/**
 * Project a case row down to the results and game-plan display fields.
 * Drops owner id, the share token, file addresses, and the rest of case_details.
 */
export function toSharedCaseView(row: {
  case_type?: unknown;
  role?: unknown;
  jurisdiction?: unknown;
  result?: unknown;
  game_plan?: unknown;
  case_details?: unknown;
}): SharedCaseView {
  return {
    title: caseTitle(row.case_details),
    case_type: textOrNull(row.case_type),
    role: textOrNull(row.role),
    jurisdiction: sharedJurisdiction(row.jurisdiction),
    result: row.result ?? null,
    game_plan: row.game_plan ?? null,
  };
}
