"use client";

import { Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { EMAIL_REGEX } from "../../constants";
import { useSignInMutation } from "@/lib/queries/auth";
import Link from "next/link";

function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, errorMessage } = useSignInMutation();

  const [rememberEmail, setRememberEmail] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rememberEmail) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    mutate({ email, password });
  };

  const isFormValid = EMAIL_REGEX.test(email) && password.length >= 6;

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col p-5 max-w-[500px] w-full"
    >
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

      <div className="flex gap-2 items-center border border-gray-100 mt-9">
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

      <p className={`h-5 text-[12px] my-2 ${errorMessage && "text-red-500"}`}>
        {errorMessage || "\u00A0"}
      </p>

      <button
        type="submit"
        className={`p-3 rounded-md font-bold transition-all duration-200 ease-in-out ${
          isFormValid
            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            : "bg-gray-300 text-white cursor-default"
        }`}
        disabled={!isFormValid}
      >
        로그인
      </button>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            id="rememberEmail"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
            className="cursor-pointer"
          />
          <label htmlFor="rememberEmail" className="cursor-pointer select-none">
            아이디 저장
          </label>
        </div>

        <div className="flex gap-2 items-center">
          <Link
            className="text-12 sm:text-[14px] text-gray-500 hover:text-black"
            href={"/find-id"}
          >
            아이디 찾기
          </Link>
          <span>|</span>
          <Link
            className="text-12 sm:text-[14px] text-gray-500 hover:text-black"
            href={"/find-password"}
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </form>
  );
}

export default SigninForm;
