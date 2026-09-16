import { cache } from "react";
import { createServerSupabaseClient } from "./server";

// 상품 상세 페이지 트리(page.tsx, CommentsSection, ProductInquiry)에서
// 각자 auth.getSession()을 따로 호출하던 걸 하나로 합치기 위한 헬퍼.
// cache()로 감싸서 같은 요청(렌더링 트리) 안에서는 1번만 실행되고 재사용됨.
export const getCachedUserId = cache(async (): Promise<string | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id ?? null;
});
