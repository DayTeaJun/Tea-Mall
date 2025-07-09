"use client";

import React, { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

function PasswordForm() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<"input" | "sent">("input");

  const isFormValid = emailValid === "중복된 이메일입니다.";

  const supabase = createBrowserSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    setIsLoading(false);
    setStep("sent");

    if (error) {
      toast.error("비밀번호 재설정 이메일 전송 실패: " + error.message);
    } else {
      toast.success("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    }
  };

  if (step === "sent") {
    return (
      <div className="text-center p-4 flex flex-col items-center gap-2 mt-10">
        <CircleCheck size={60} className="text-green-500 mb-2" />
        <p className="font-bold text-lg">
          비밀번호 재설정 이메일이 전송되었습니다.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          이메일을 확인하고 메일에 첨부된 링크를 클릭해주세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-[13px] text-gray-500">
        아래 비밀번호 재설정 링크를 눌러 비밀번호 초기화를 진행해주세요.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 max-w-[500px] w-full"
      >
        <button
          type="submit"
          className={`p-3 rounded-md font-bold transition-all duration-200 ease-in-out ${
            isFormValid
              ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              : "bg-gray-300 text-white cursor-default"
          }`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? "전송 중..." : "비밀번호 재설정"}
        </button>
        <Link
          href="/mypage/profile"
          className="text-[14px] cursor-pointer underline mx-auto"
        >
          취소하기
        </Link>
      </form>
    </>
  );
}

export default PasswordForm;
