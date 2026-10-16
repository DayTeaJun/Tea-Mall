import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// 미들웨어에서 확인한 세션 정보를 이 헤더에 실어서 서버 컴포넌트(getServerSession)로 넘긴다.
// 레이아웃에서 auth.getUser()/user_table select를 다시 하지 않도록 하기 위함.
const SESSION_HEADER = "x-user-session";

export async function updateSession(req: NextRequest) {
  const cookiesToSet: {
    name: string;
    value: string;
    options?: CookieOptions;
  }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          cookiesToSet.push({ name: key, value, options });
        },
        remove: (key, options) => {
          cookiesToSet.push({ name: key, value: "", options });
        },
      },
    },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();

  const buildResponse = (sessionPayload: { user: unknown }) => {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set(
      SESSION_HEADER,
      encodeURIComponent(JSON.stringify(sessionPayload)),
    );
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    cookiesToSet.forEach(({ name, value, options }) => {
      res.cookies.set({ name, value, ...options });
    });
    return res;
  };

  if (userError || !userData?.user) {
    return {
      response: buildResponse({ user: null }),
      isLoggedIn: false as const,
      level: null,
      username: null,
      status: null,
    };
  }

  const { data: profile } = await supabase
    .from("user_table")
    .select(
      `
    id, email, user_name, level, phone, profile_image_url,
    created_at, updated_at, status, last_login_at, address
  `,
    )
    .eq("id", userData.user.id)
    .maybeSingle();

  const sessionUser = {
    id: userData.user.id,
    email: userData.user.email ?? "",
    user_name: profile?.user_name ?? "",
    level: profile?.level ?? 1,
    app_metadata: userData.user.app_metadata,
    identities: userData.user.identities,
    ...profile,
    ...userData.user.user_metadata,
  };

  return {
    response: buildResponse({ user: sessionUser }),
    isLoggedIn: true as const,
    level: profile?.level ?? null,
    username: profile?.user_name ?? null,
    status: profile?.status ?? null,
  };
}
