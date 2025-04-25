"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { LogOut } from "lucide-react";

function SignOutBtn() {
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("로그아웃 되었습니다.");
  };

  return (
    <button
      onClick={() => handleLogout()}
      type="button"
      className="text-black flex gap-2 items-center cursor-pointer"
    >
      <p className="text-[14px] ">로그아웃</p>
      <LogOut size={20} />
    </button>
  );
}

export default SignOutBtn;
