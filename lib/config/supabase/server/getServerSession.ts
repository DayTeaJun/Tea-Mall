import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getServerSession() {
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

  const { data: sessionData } = await supabase.auth.getSession();
  const { data: userData } = await supabase.auth.getUser();

  let profile = null;

  if (userData?.user?.id) {
    const { data: levelData } = await supabase
      .from("user_table")
      .select("level")
      .eq("id", userData.user.id)
      .single();

    profile = levelData;
  }

  return {
    accessToken: sessionData?.session?.access_token ?? null,
    user: userData?.user
      ? {
          id: userData.user.id,
          email: userData.user.email ?? "",
          user_name: userData.user.user_metadata.user_name ?? "",
          level: profile?.level ?? 1,
          ...userData.user.user_metadata,
        }
      : null,
  };
}
