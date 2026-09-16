import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// cache()로 감싸서, 같은 요청(렌더링 트리) 안에서 여러 번 호출돼도
// 실제로는 1번만 실행되도록 함 (예: app/layout.tsx + mypage/layout.tsx 중복 호출 방지)
export const getServerSession = cache(async function getServerSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
      },
    },
  );

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { user: null };
  }

  const now = new Date().toISOString();
  await supabase
    .from("user_table")
    .update({ last_login_at: now })
    .eq("id", userData.user.id);

  const { data: user_table } = await supabase
    .from("user_table")
    .select(
      `
    id, email, user_name, level, phone, profile_image_url, 
    created_at, updated_at, status, last_login_at, address
  `,
    )
    .eq("id", userData.user.id)
    .single();

  return {
    user: {
      id: userData.user.id,
      email: userData.user.email ?? "",
      user_name: user_table?.user_name ?? "",
      level: user_table?.level ?? 1,
      app_metadata: userData.user.app_metadata,
      identities: userData.user.identities,
      ...user_table,
      ...userData.user.user_metadata,
    },
  };
});
