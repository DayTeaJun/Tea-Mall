"use client";

import { Eye, EyeOff, Lock, Mail, HelpCircle, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { EMAIL_REGEX } from "../../constants";
import { useSignInMutation } from "@/lib/queries/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function SigninForm() {
  const searchParams = useSearchParams();
  const loginErrorMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showTestInfo, setShowTestInfo] = useState(false);

  const { mutate, errorMessage } = useSignInMutation();
  const [rememberEmail, setRememberEmail] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
    if (loginErrorMessage) {
      toast.error(`${loginErrorMessage}`);
    }
  }, []);

  const handleFillTestAccount = () => {
    setEmail("testuser@tmall.com");
    setPassword("test1234");
    setShowTestInfo(false);
    toast.success("테스트 계정이 입력되었습니다.");
  };

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
      <div className="relative flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setShowTestInfo((prev) => !prev)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors cursor-pointer bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200"
        >
          <HelpCircle size={14} className="text-green-500" />
          <span>테스트 계정 사용</span>
        </button>

        {showTestInfo && (
          <div className="absolute right-0 bottom-8 mb-2 z-60 w-full sm:w-[320px] bg-white p-4 text-xs sm:text-sm text-gray-700 animate-in fade-in duration-150 border border-gray-300 rounded-md">
            <div className="absolute -bottom-[7px] right-6 w-3 h-3 bg-white border-b border-r border-gray-300 rotate-45" />

            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles size={14} className="text-green-500" />
                <span>체험용 테스트 계정</span>
              </div>
              <button
                type="button"
                onClick={handleFillTestAccount}
                className="text-[11px] font-semibold bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors cursor-pointer duration-500"
              >
                계정 자동입력
              </button>
            </div>
            <div className="space-y-1.5 text-gray-600">
              <p className="font-bold">
                · 아이디(이메일) :{" "}
                <span className="font-mono text-[11px] sm:text-[14px] tracking-wider">
                  testuser@tmall.com
                </span>
              </p>
              <p className="font-bold">
                · 비밀번호 :{" "}
                <span className="font-mono text-[11px] sm:text-[14px] tracking-wider">
                  test1234
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center border border-gray-100 rounded-sm">
        <label htmlFor="email" className="bg-gray-50 p-3">
          <Mail size={20} className="text-gray-400" />
        </label>
        <input
          type="email"
          id="email"
          placeholder="이메일"
          className="border-none outline-0 px-2 w-full text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-2 items-center border border-gray-100 rounded-sm mt-5">
        <label htmlFor="password" className="bg-gray-50 p-3">
          <Lock size={20} className="text-gray-400" />
        </label>
        <input
          id="password"
          placeholder="비밀번호"
          className="border-none outline-0 px-2 w-full text-sm"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="p-3 cursor-pointer"
        >
          {showPassword ? (
            <Eye size={20} className="text-gray-400" />
          ) : (
            <EyeOff size={20} className="text-gray-400" />
          )}
        </button>
      </div>

      <p className={`h-5 text-[12px] my-1 ${errorMessage && "text-red-500"}`}>
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
            className="cursor-pointer accent-green-600"
          />
          <label
            htmlFor="rememberEmail"
            className="cursor-pointer select-none text-xs sm:text-sm"
          >
            아이디 저장
          </label>
        </div>

        <div className="flex gap-2 items-center text-xs sm:text-sm text-gray-500">
          <Link className="hover:text-black" href={"/find-id"}>
            아이디 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link className="hover:text-black" href={"/find-password"}>
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </form>
  );
}

export default SigninForm;
