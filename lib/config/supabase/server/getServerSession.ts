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

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { user: null };
  }

  const { data: levelData } = await supabase
    .from("user_table")
    .select("level")
    .eq("id", userData.user.id)
    .single();

  return {
    user: {
      id: userData.user.id,
      email: userData.user.email ?? "",
      user_name: userData.user.user_metadata.user_name ?? "",
      level: levelData?.level ?? 1,
      ...userData.user.user_metadata,
    },
  };
}
