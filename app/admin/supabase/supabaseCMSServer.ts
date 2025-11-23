import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "./types";

let cmsClient: SupabaseClient<Database> | null = null;

export function getSupabaseCMSClient(): SupabaseClient<Database> {
  if (cmsClient) return cmsClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CMS_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_CMS_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_CMS_URL or NEXT_PUBLIC_SUPABASE_CMS_PUBLISHABLE_KEY environment variables."
    );
  }

  cmsClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return cmsClient;
}

