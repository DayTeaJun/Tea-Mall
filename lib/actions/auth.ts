"use server";

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from "@/lib/config/supabase/server/server";
import { SignUpFormData, UserProfileType } from "@/types/user";
import { extractFilePathFromUrl } from "../utils/supabaseStorageUtils";
import { Database } from "../config/supabase/types_db";

// 회원가입
export async function signUpUser(formData: SignUpFormData) {
  const supabase = await createServerSupabaseClient();

  const { email, password, username } = formData;

  if (!email || !password || !username) {
    throw new Error("필수 입력값이 누락되었습니다.");
  }

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

// 소셜 로그인 (회원가입)
export async function signUpOAuth(formData: SignUpFormData) {
  const supabase = await createServerSupabaseClient();
  type UserInsert = Database["public"]["Tables"]["user_table"]["Insert"];

  if (!formData.id) {
    throw new Error("OAuth 회원가입에는 ID가 필요합니다.");
  }

  const { id, email, username, phone, address, profile_image_url } = formData;

  const payload: UserInsert = {
    id,
    email: email ?? null,
    user_name: username ?? null,
    phone: phone ?? "",
    address: address ?? "",
    profile_image_url: profile_image_url ?? null,
  };

  const { data, error } = await supabase
    .from("user_table")
    .upsert([payload], { onConflict: "id" });

  if (error) throw error;
  return data;
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

  return data;
}

// 내 프로필 조회
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

// 내 프로필 수정
export async function updateMyProfile({
  id,
  user_name,
  phone,
  address,
  profile_image_url,
}: UserProfileType) {
  const bucket = process.env.NEXT_PUBLIC_STORAGE_USER_BUCKET;
  const supabase = await createServerSupabaseClient();

  // 현재 저장된 프로필 이미지 URL 조회
  const { data: currentData, error } = await supabase
    .from("user_table")
    .select("profile_image_url")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase 에러", error);
    throw new Error("프로필 조회 실패");
  }

  const currentImageUrl = currentData?.profile_image_url;

  // 기존 이미지와 다를 경우에만 삭제
  if (currentImageUrl && currentImageUrl !== profile_image_url && bucket) {
    const oldImagePath = extractFilePathFromUrl(currentImageUrl, bucket);
    if (oldImagePath) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([oldImagePath]);

      if (removeError) {
        console.warn("기존 프로필 이미지 삭제 실패:", removeError.message);
      }
    }
  }

  // 유저 정보 업데이트
  const { data: updatedData, error: updateError } = await supabase
    .from("user_table")
    .update({
      user_name,
      phone,
      address,
      profile_image_url,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("프로필 업데이트 실패:", updateError.message);
    throw new Error("프로필 업데이트 실패");
  }

  return updatedData;
}

// 회원 탈퇴
export const withdrawalUser = async () => {
  const supabase = await createServerSupabaseClient();
  const adminClient = await createServerSupabaseAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인된 사용자가 없습니다.");
  }

  await supabase.from("user_table").delete().eq("id", user.id);

  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) {
    throw new Error(`회원 탈퇴 실패: ${error.message}`);
  }

  return { success: true };
};
