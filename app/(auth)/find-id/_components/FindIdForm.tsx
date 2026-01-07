"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

function FindIdForm() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = username.trim().length > 0 && phone.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);

    const res = await fetch("/api/auth/find-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        phone,
      }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      toast.error(data.message ?? "일치하는 계정을 찾을 수 없습니다.");
      return;
    }

    setFoundId(data.maskedEmail);
  };

  if (foundId) {
    return (
      <div className="text-center p-4 flex flex-col items-center gap-2 mt-10">
        <CircleCheck size={60} className="text-green-500 mb-2" />
        <p className="font-bold text-lg">아이디를 찾았습니다.</p>

        <p className="mt-2 text-gray-700">가입된 아이디(이메일)</p>

        <p className="font-bold text-lg text-green-600">{foundId}</p>

        <Link
          href="/signin"
          className="mt-6 p-3 rounded-md font-bold bg-green-600 text-white hover:bg-green-700"
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
          className={`p-3 rounded-md font-bold transition-all ${
            isFormValid
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-white"
          }`}
        >
          {isLoading ? "확인 중..." : "아이디 찾기"}
        </button>
      </form>

      <Link href="/signin" className="text-[14px] underline">
        Cancel
      </Link>
    </>
  );
}

export default FindIdForm;
