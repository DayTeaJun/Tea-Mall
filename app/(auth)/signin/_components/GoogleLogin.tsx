"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import React from "react";

function AuthUIForm() {
  const supabase = createBrowserSupabaseClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  };

  return (
    <div className="relative w-full mt-6">
      <p className="absolute left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-4">
        or
      </p>
      <div className="max-w-[500px] mx-auto px-5 flex flex-col gap-4 border-t pt-6">
        <button
          onClick={() => handleGoogleLogin()}
          className="w-full py-2 rounded text-gray-500 border border-gray-300 hover:text-black hover:border-black transition-all duration-300"
        >
          구글 로그인
        </button>

        <button
          onClick={() => handleGithubLogin()}
          className="w-full py-2 rounded text-gray-500 border border-gray-300 hover:text-black hover:border-black transition-all duration-300"
        >
          깃허브 로그인
        </button>
      </div>
    </div>
  );
}

export default AuthUIForm;
