"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check } from "lucide-react";

type Step = "input" | "success";

function FindIdForm() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>("input");

  const isFormValid = username.trim().length > 0 && phone.trim().length >= 10;

  const formatPhone = (value: string) => {
    if (value.length !== 11) return value;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);

    const formattedPhone = formatPhone(phone);

    try {
      const res = await fetch("/api/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          phone: formattedPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("입력한 정보와 일치하는 계정이 없습니다.");
        return;
      }

      setFoundId(data.maskedEmail);
      setStep("success");
    } catch {
      toast.error("요청 처리 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success" && foundId) {
    return (
      <div className="flex flex-col items-center px-4">
        <Check size={60} className="text-green-600 my-4" />

        <p className="text-12 sm:text-sm text-gray-600 text-center mb-10 leading-relaxed">
          입력하신 정보와 일치하는 회원 정보를 확인했습니다.
          <br />
          아래는 가입 시 등록된 아이디(이메일)입니다.
        </p>

        <div className="w-full text-center max-w-md border-t border-b py-8 mb-8">
          <p className="text-sm text-gray-500 mb-2">연동된 이메일</p>
          <p className="text-lg font-bold text-green-600 break-all">
            {foundId}
          </p>
        </div>

        <div className="flex gap-4 text-sm mb-10">
          <Link href="/signin" className="text-gray-700">
            로그인하기
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/find-password" className="text-gray-700">
            비밀번호를 찾으시나요?
          </Link>
        </div>

        <ul className="text-xs text-gray-500 leading-relaxed max-w-md list-disc pl-4 space-y-1">
          <li>
            아이디는 개인정보 보호를 위해 아이디의 일부는 처리되어 표시됩니다.
          </li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <p className="text-[32px] font-bold">Find your ID</p>

      <p className="text-[13px] text-gray-500">
        사용자명과 휴대폰 번호를 입력해주세요.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-5 max-w-[500px] w-full gap-4"
      >
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 rounded-md"
        />

        <input
          type="tel"
          placeholder="휴대폰 번호 (숫자만 입력)"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          className="border p-3 rounded-md"
        />

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`p-3 rounded-md font-bold ${
            isFormValid ? "bg-green-600 text-white" : "bg-gray-300 text-white"
          }`}
        >
          아이디 찾기
        </button>
      </form>

      <Link href="/signin" className="text-[14px] underline">
        Cancel
      </Link>
    </>
  );
}

export default FindIdForm;
