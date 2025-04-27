"use client";
import { useLoginMutation } from "@/app/queries/auth";
import { Lock, Mail } from "lucide-react";
import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate } = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ email, password });
  };

  return (
    <section className="w-full h-full flex flex-col items-center ">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-5 p-5 max-w-[500px] w-full"
      >
        <p className="text-[12px]">로그인 정보를 입력해주세요.</p>
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
        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-all duration-200 ease-in-out font-bold cursor-pointer"
        >
          로그인
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
