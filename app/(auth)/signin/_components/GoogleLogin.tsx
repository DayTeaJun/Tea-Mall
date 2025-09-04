"use client";

import useHydrate from "@/hooks/useHydrate";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React from "react";

function AuthUIForm() {
  const supabase = createBrowserSupabaseClient();

  const isMount = useHydrate();

  if (!isMount) return null;

  return (
    <div className="w-full">
      <div className="max-w-[500px] mx-auto">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          onlyThirdPartyProviders
          providers={["google", "github"]}
        ></Auth>
      </div>
    </div>
  );
}

export default AuthUIForm;
