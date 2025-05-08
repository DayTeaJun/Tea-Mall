import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 쿠키 만료시 세션 갱신을 위한 미들웨어
export async function updateSession(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 쿠키에서 현재 세션 확인
        get: (key: string) => req.cookies.get(key)?.value,
        // 세션 갱신시 쿠키 업데이트
        set: (key, value, options) => {
          res.cookies.set({
            name: key,
            value,
            ...options,
          });
        },
        remove: (key, options) => {
          res.cookies.set({
            name: key,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // 세션 가져오기 (access-token 만료시 refresh 시도)
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    // (Secure, SameSite, HttpOnly 문제 등) getSession 실패 시 getUser 시도 -> 로컬 환경에서 에러 나중에 배포 환경에서 테스트
    const { data: userData, error: userError } = await supabase.auth.getUser();

    // 최종 로그인 유무 확인
    if (userError || !userData.user) {
      return { response: res, isLoggedIn: false };
    } else {
      const { data: profile, error: profileError } = await supabase
        .from("user_table")
        .select("level")
        .eq("id", userData.user.id)
        .single();
      return {
        response: res,
        isLoggedIn: true,
        level: !profileError && profile?.level,
      };
    }
  }

  return { response: res, isLoggedIn: false };
}
