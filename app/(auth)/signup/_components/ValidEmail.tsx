"use client";

import useDebounce from "@/lib/hooks/useDebounce";
import { Mail } from "lucide-react";
import React, { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

type ValidEmailProps = {
  email: string;
  setEmail: (email: string) => void;
  setEmailValid: (valid: string) => void;
};

// 이메일 확인
async function checkEmailExists(email: string) {
  const supabase = await createBrowserSupabaseClient();

  const { data: existEmail, error: existEmailError } = await supabase
    .from("user_table")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return { existEmail, existEmailError };
}

function ValidEmail({ email, setEmail, setEmailValid }: ValidEmailProps) {
  const debounceEmail = useDebounce<string>(email);

  useEffect(() => {
    const validateEmail = async () => {
      if (debounceEmail.length === 0) {
        setEmailValid("");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailRegex.test(debounceEmail)) {
        setEmailValid("잘못된 이메일 형식입니다.");
        return;
      }

      try {
        const { existEmail, existEmailError } = await checkEmailExists(
          debounceEmail,
        );

        console.log("이메일 중복 확인:", existEmail);

        if (existEmailError) {
          setEmailValid("이메일 확인 중 오류가 발생했습니다.");
        }

        if (existEmail) {
          setEmailValid("중복된 이메일 입니다.");
          return;
        } else {
          setEmailValid("사용 가능한 이메일입니다.");
          return;
        }
      } catch (error) {
        console.error("검증 중 오류:", error);
        setEmailValid("이메일 확인 중 문제가 발생했습니다.");
      }
    };

    validateEmail();
  }, [debounceEmail, setEmailValid]);

  return (
    <div className="flex gap-2 items-center border border-gray-100">
      <label htmlFor="email" className="bg-gray-50 p-3">
        <Mail size={20} className="text-gray-400" />
      </label>
      <input
        type="email"
        id="email"
        placeholder="이메일"
        className="border-none outline-0 px-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}

export default ValidEmail;
