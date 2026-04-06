import { createClient } from "@supabase/supabase-js";

/**
 * 서비스 롤 전용 — API 라우트에서만 사용 (RLS 우회).
 * SUPABASE_SERVICE_ROLE_KEY는 클라이언트에 포함되지 않도록 할 것.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
