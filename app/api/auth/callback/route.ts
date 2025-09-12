import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  const supabase = await createServerSupabaseClient();

  // OAuth code ↔ session 교환 (서버에서 쿠키 설정)
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 서버 리다이렉트: 여기서 이미 쿠키가 설정된 상태
  return NextResponse.redirect(new URL(next, url.origin));
}
