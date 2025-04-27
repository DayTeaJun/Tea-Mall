"use client";

import { signUpUser } from "@/app/actions/auth";
import { Lock, LockKeyhole, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signUpUser({ email, password, username });
      alert("회원가입 성공!");
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        alert("회원가입 실패: " + err.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.");
      }
    }
  };

  return (
    <section className="w-full h-full flex flex-col items-center ">
      <form
        className="flex flex-col gap-5 p-5 max-w-[500px] w-full"
        onSubmit={handleSubmit}
      >
        <p className="text-[12px]">회원정보를 입력해주세요.</p>
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
        <div className="flex gap-2 items-center border border-gray-100">
          <label htmlFor="password" className="bg-gray-50 p-3">
            <Lock size={20} className="text-gray-400" />
          </label>
          <input
            id="password"
            placeholder="비밀번호"
            className="border-none outline-0 px-2 w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center border border-gray-100">
          <label htmlFor="password" className="bg-gray-50 p-3">
            <LockKeyhole size={20} className="text-gray-400" />
          </label>
          <input
            id="password"
            placeholder="비밀번호 확인"
            className="border-none outline-0 px-2 w-full"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center border border-gray-100">
          <label htmlFor="username" className="bg-gray-50 p-3">
            <User size={20} className="text-gray-400" />
          </label>
          <input
            id="username"
            placeholder="사용자명"
            className="border-none outline-0 px-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-all duration-200 ease-in-out font-bold cursor-pointer"
          type="submit"
        >
          회원가입
        </button>
      </form>
    </section>
  );
}
