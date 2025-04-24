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

  console.log(data, error);

  if (error) throw new Error(error.message);

  if (data.user) {
    const { error: insertError } = await supabase.from("userTable").insert({
      id: data.user.id,
      user_name: username,
    });

    if (insertError) throw new Error(insertError.message);
  }

  return data.user;
}
