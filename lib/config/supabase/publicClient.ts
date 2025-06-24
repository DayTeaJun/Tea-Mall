import { createClient } from "@supabase/supabase-js";
import { Database } from "./types_db";

// 공개 요청 전용 (build 시점, metadata 등에서 사용)
export const publicSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
