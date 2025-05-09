"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "../../lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserType } from "../../types/user";

interface Props {
  user: UserType | null;

  children: React.ReactNode;
}

// 유저 인증 상태 변경, 이름 변경, 로그인 상태, 토큰 만료 등 이벤트 구독
export default function AuthProvider({ user, children }: Props) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const { setUser } = useAuthStore();

  useEffect(() => {
    setUser(user ?? null);

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [supabase, router, setUser, user]);

  return children;
}
