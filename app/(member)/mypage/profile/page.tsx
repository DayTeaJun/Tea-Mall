import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  if (!userId) return notFound();

  const { data: profile, error: profileError } = await supabase
    .from("user_table")
    .select("level")
    .eq("id", userId)
    .single();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">내 정보</h2>
      <p>이름</p>
      <span>{profile?.name}</span>
      <p>전화번호</p>
      <span></span>

      <div className="flex gap-2 mt-4">
        <button className="bg-gray-300 px-2 p-1 rounded">
          비밀번호 재설정
        </button>
        <button className="bg-red-500 text-white px-2 p-1 rounded">
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
