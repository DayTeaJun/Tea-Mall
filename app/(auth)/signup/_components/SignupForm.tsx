"use client";

import { Lock, LockKeyhole, User } from "lucide-react";
import { useState } from "react";
import { useSignUpMutation } from "../../queries";
import ValidEmail from "./ValidEmail";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [username, setUsername] = useState("");

  const { mutate } = useSignUpMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ email, password, username });
  };

  return (
    <form
      className="flex flex-col gap-5 p-5 max-w-[500px] w-full"
      onSubmit={handleSubmit}
    >
      <ValidEmail
        email={email}
        setEmail={setEmail}
        setEmailValid={setEmailValid}
      />
      <p>{emailValid && emailValid}</p>

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
  );
}

export default SignupForm;
