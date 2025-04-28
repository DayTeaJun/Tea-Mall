"use server";

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from "@/lib/config/supabase/server";

// 회원가입
export async function signUpUser(formData: {
  email: string;
  password: string;
  username: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { email, password, username } = formData;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const { error: insertError } = await supabase.from("user_table").insert({
      id: data.user.id,
      user_name: username,
      email: email,
    });

    if (insertError) throw insertError;
  }

  return data.user;
}

// 로그인
export async function signInUser(formData: {
  email: string;
  password: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { email, password } = formData;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
}

// 이메일 체크 (rls 정책으로 인해 admin client 사용)
export async function serverCheckEmailExists(email: string) {
  const supabaseAdmin = await createServerSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from("user_table")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Supabase 에러", error);
    throw new Error("이메일 중복 확인 실패");
  }

  return data !== null;
}
