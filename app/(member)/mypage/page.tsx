import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import React from "react";

async function page() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl mb-4 text-center">마이페이지</h1>
      <p className="text-center text-gray-500 mb-8">
        회원님의 정보를 확인하고 관리할 수 있는 페이지입니다.
      </p>
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500">준비 중인 페이지입니다.</p>
      </div>
    </div>
  );
}

export default page;
