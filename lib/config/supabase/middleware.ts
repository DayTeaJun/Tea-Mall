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

  // 🔄 세션 확인 + 갱신
  await supabase.auth.getSession();

  return res;
}
