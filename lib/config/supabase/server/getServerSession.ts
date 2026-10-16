import { cache } from "react";
import { headers } from "next/headers";

// 미들웨어(updateSession)가 이미 auth.getUser()/user_table select를 끝내고
// 그 결과를 x-user-session 요청 헤더에 실어서 넘겨준다. 여기서 Supabase를
// 다시 호출하지 않고 그 헤더만 읽어서 쓴다 (페이지마다 중복 조회 방지).
// cache()는 같은 요청(렌더링 트리) 안에서 여러 번 호출돼도 1번만 파싱하도록 함.
export const getServerSession = cache(async function getServerSession() {
  const headerStore = await headers();
  const raw = headerStore.get("x-user-session");

  if (!raw) {
    return { user: null };
  }

  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return { user: null };
  }
});
