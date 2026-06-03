import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/db";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — uses anon key, safe to call from client components
export const supabase = createClient<Database>(url, anon);

// Server-only admin client — uses service role key, never import in client components
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, serviceKey);
}
