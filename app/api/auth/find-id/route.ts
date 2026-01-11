import { createServerSupabaseAdminClient } from "@/lib/config/supabase/server/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, phone } = await req.json();

  if (!username || !phone) {
    return NextResponse.json(
      { message: "필수 값이 누락되었습니다." },
      { status: 400 },
    );
  }

  const supabaseAdmin = await createServerSupabaseAdminClient();

  const { data: profile, error } = await supabaseAdmin
    .from("user_table")
    .select("id")
    .eq("user_name", username)
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("조회 오류:", error);
    return NextResponse.json({ message: "조회 실패" }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json(
      { message: "일치하는 계정을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const { data: user, error: userError } =
    await supabaseAdmin.auth.admin.getUserById(profile.id);

  if (userError || !user?.user?.email) {
    return NextResponse.json(
      { message: "계정 정보를 불러올 수 없습니다." },
      { status: 500 },
    );
  }

  const email = user.user.email;
  const [id, domain] = email.split("@");
  const maskedEmail = `${id.slice(0, 2)}***@${domain}`;

  return NextResponse.json({ maskedEmail });
}
