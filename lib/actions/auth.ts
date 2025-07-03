"use server";

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from "@/lib/config/supabase/server/server";
import { SignUpFormData } from "@/types/user";

// 회원가입
export async function signUpUser(formData: SignUpFormData) {
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
      level: 1,
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

  if (error) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return data.user;
}

// 이메일 중복 체크 (rls 정책으로 인해 admin client 사용)
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

// 유저이름 중복 체크
export async function serverCheckUsernameExists(name: string) {
  const supabaseAdmin = await createServerSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from("user_table")
    .select("user_name")
    .eq("user_name", name)
    .maybeSingle();

  if (error) {
    console.error("Supabase 에러", error);
    throw new Error("이메일 중복 확인 실패");
  }

  return data !== null;
}

export async function getMyProfile(userId: string) {
  const supabaseAdmin = await createServerSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from("user_table")
    .select("id, email, user_name, level, phone, address, profile_image_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Supabase 에러", error);
    throw new Error("프로필 조회 실패");
  }

  return data;
}
