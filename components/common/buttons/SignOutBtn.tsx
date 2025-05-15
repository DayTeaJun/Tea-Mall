"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const protectedRoutes = ["/productRegist", "/admin"];

function SignOutBtn() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("로그아웃 되었습니다.");
    if (protectedRoutes.includes(pathname)) {
      window.location.href = "/";
    } else {
      router.refresh();
    }
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
