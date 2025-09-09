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
        get: (key: string) => req.cookies.get(key)?.value,
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

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return { response: res, isLoggedIn: false };
  }

  const { data: profile } = await supabase
    .from("user_table")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  const level = profile?.level ?? null;
  const username = profile?.user_name ?? null;

  return {
    response: res,
    isLoggedIn: true,
    level,
    username,
  };
}
