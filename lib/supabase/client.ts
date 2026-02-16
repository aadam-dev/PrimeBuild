import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Returns Supabase browser client when env is set; null otherwise (build without DB). */
export function createClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey) as unknown as SupabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
