"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types_db";

// 생성된 Supabase 클라이언트 인스턴스를 저장할 메모리 변수
let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export const createBrowserSupabaseClient = () => {
  // 이미 기존에 만들어둔 클라이언트가 있다면 새로 만들지 않고 재사용
  if (client) return client;

  // 최초 1회 호출 시에만 새로 생성하여 client 변수에 저장
  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
};
