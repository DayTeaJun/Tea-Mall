"use client";

import { Mail } from "lucide-react";
import React, { useState } from "react";
import { EMAIL_REGEX } from "../../constants";

function FindPasswordForm() {
  const [email, setEmail] = useState("");

  const isFormValid = EMAIL_REGEX.test(email);

  const emailValid = "등록되지 않은 이메일입니다.";

  return (
    <form className="flex flex-col p-5 max-w-[500px] w-full">
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

      <p
        className={`h-5 text-[12px] my-3 ${
          emailValid === "등록되지 않은 이메일입니다."
            ? "text-red-500"
            : "text-transparent"
        }`}
      >
        {emailValid || "\u00A0"}
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
        비밀번호 찾기
      </button>
    </form>
  );
}

export default FindPasswordForm;
