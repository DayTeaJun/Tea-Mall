"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function SignOutBtn() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("로그아웃 되었습니다.");
    router.refresh();
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
