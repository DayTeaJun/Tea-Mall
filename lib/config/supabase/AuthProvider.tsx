"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "./client";

interface Props {
  accessToken: string | undefined;
  children: React.ReactNode;
}

// 유저 인증 상태 변경, 이름 변경, 로그인 상태, 토큰 만료 등 이벤트 구독
export default function AuthProvider({ accessToken, children }: Props) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // 기존 구독상태가 달라지면 최신화
      if (session?.access_token !== accessToken) {
        // 현재 url 유지한 상태로 서버 사이드 데이터를 다시 불러오게 함
        // 데이터만 새로 리패치함
        router.refresh();
      }
    });

    return () => {
      // 화면이 닫힐 때 구독 해제
      authListner.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
}
