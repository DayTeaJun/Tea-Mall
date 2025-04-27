"use server";

import { createServerSupabaseClient } from "@/lib/config/supabase/server";

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

  if (error) throw new Error(error.message);

  if (data.user) {
    const { error: insertError } = await supabase.from("user_table").insert({
      id: data.user.id,
      user_name: username,
      email: email,
    });

    if (insertError) throw new Error(insertError.message);
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
