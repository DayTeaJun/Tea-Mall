"use client";

import React, { useState } from "react";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
      <div className="mt-14 flex flex-col items-center gap-6 px-4">
        <p className="text-xl font-medium">아이디를 찾았습니다!</p>

        <div className="relative w-full max-w-md border rounded-lg px-6 py-8 text-center">
          {/* 라벨 */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-sm font-bold text-gray-700">
            가입된 아이디
          </span>

          {/* 아이디 */}
          <p className="text-2xl font-extrabold text-green-600 break-all">
            {foundId}
          </p>
        </div>

        <Link
          href="/signin"
          className="mt-6 w-full max-w-md px-6 py-3 rounded-md bg-green-600 text-white font-bold text-center hover:bg-green-700 transition"
        >
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  return (
    <>
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
