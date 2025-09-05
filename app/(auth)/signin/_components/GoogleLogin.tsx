"use client";

import useHydrate from "@/hooks/useHydrate";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import React from "react";

function AuthUIForm() {
  const supabase = createBrowserSupabaseClient();

  const isMount = useHydrate();

  if (!isMount) return null;

  return (
    <div className="w-full">
      <div className="max-w-[500px] mx-auto px-5">
        <Auth
          redirectTo={process.env.NEXT_PUBLIC_SITE_URL}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          supabaseClient={supabase as unknown as SupabaseClient<any, "public">}
          appearance={{ theme: ThemeSupa }}
          onlyThirdPartyProviders
          providers={["google", "github"]}
        ></Auth>
      </div>
    </div>
  );
}

export default AuthUIForm;
