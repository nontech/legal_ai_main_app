import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { isShareToken, toSharedCaseView, type SharedCaseView } from "@/lib/caseShare";

const SHARED_CASE_COLUMNS =
  "case_type, role, jurisdiction, result, game_plan, case_details";

export async function loadSharedCase(token: string): Promise<SharedCaseView | null> {
  if (!isShareToken(token)) return null;

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("cases")
    .select(SHARED_CASE_COLUMNS)
    .eq("share_token", token)
    .maybeSingle();

  if (error || !data) return null;
  return toSharedCaseView(data);
}
