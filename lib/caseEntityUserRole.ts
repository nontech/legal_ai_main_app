/**
 * Match extracted entity `role_in_case` to the case record `role` (user's position).
 */

export function normalizeRole(value: string | undefined | null): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function entityRoleMatchesCase(
  entityRoleInCase: string | undefined,
  caseRole: string | null | undefined
): boolean {
  if (!caseRole?.trim() || !entityRoleInCase?.trim()) return false;
  return normalizeRole(entityRoleInCase) === normalizeRole(caseRole);
}
