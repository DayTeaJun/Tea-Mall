"use client";

import useDebounce from "@/lib/hooks/useDebounce";
import { Mail } from "lucide-react";
import React, { useEffect } from "react";
import { serverCheckEmailExists } from "../../actions";

type ValidEmailProps = {
  email: string;
  setEmail: (email: string) => void;
  setEmailValid: (valid: string) => void;
};

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
        const exists = await serverCheckEmailExists(debounceEmail); // 서버 액션 호출

        if (exists) {
          setEmailValid("중복된 이메일입니다.");
        } else {
          setEmailValid("사용 가능한 이메일입니다.");
        }
      } catch (error) {
        console.error("이메일 확인 중 오류:", error);
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
