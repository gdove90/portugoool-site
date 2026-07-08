import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Supabase clients for the NEW, dedicated GOOOL project.
// Clients are created lazily so the site builds and runs with mock
// data before any Supabase env vars exist.
// ─────────────────────────────────────────────────────────────

/** Browser-safe client (anon key). Returns null if env vars are unset. */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

/** Server-only client (service role). Never import from client components. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
