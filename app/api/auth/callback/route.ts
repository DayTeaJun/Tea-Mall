import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/signin?message=${encodeURIComponent(errorDescription || "인증 세션이 만료되었습니다.")}`,
        url.origin,
      ),
    );
  }

  const supabase = await createServerSupabaseClient();

  if (code) {
    try {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        return NextResponse.redirect(
          new URL(
            `/signin?message=${encodeURIComponent("로그인 처리 중 오류가 발생했습니다.")}`,
            url.origin,
          ),
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL("/signin", url.origin));
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
