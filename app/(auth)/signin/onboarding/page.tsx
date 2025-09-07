import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import OnboardingForm from "./_components/OnboardingForm";

export default async function OnboardingPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 프로필 선조회
  const { data: profile } = await supabase
    .from("user_table")
    .select("email, user_name, profile_image_url, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  // 이미 온보딩 완료면 홈(또는 intended URL)로
  if (profile?.user_name) redirect("/");

  return (
    <OnboardingForm
      initial={{
        email: user.email ?? profile?.email ?? "",
        user_name: profile?.user_name ?? "",
        profile_image_url: profile?.profile_image_url ?? "",
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
      }}
    />
  );
}
