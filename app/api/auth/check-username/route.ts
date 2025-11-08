import { createServerSupabaseAdminClient } from "@/lib/config/supabase/server/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get("name");
  const name = rawName?.trim();

  if (!name) {
    return NextResponse.json(
      { message: "닉네임이 필요합니다." },
      { status: 400 },
    );
  }

  const supabaseAdmin = await createServerSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from("public_usernames")
    .select("user_name")
    .eq("user_name", name)
    .maybeSingle();

  if (error) {
    console.error("Supabase 에러:", error);
    return NextResponse.json({ message: "조회 실패" }, { status: 500 });
  }

  return NextResponse.json({ exists: !!data });
}
