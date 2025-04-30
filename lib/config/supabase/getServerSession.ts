import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { logGetSession, logGetUser } from "@/lib/utils/supabaseLogger";

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
  logGetSession("layout.tsx");
  logGetUser("layout.tsx");

  const { data: userData } = await supabase.auth.getUser();

  return {
    user: userData?.user
      ? {
          id: userData.user.id,
          email: userData.user.email ?? "",
          user_name: userData.user.user_metadata.user_name ?? "",
          ...userData.user.user_metadata,
        }
      : null,
  };
}
