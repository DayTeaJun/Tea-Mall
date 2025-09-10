import { redirect } from "next/navigation";
import OnboardingForm from "./_components/OnboardingForm";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  return <OnboardingForm user={user} />;
}
