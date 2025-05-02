"use client";

import { useState } from "react";
import ValidEmail from "./ValidEmail";
import ValidPassword from "./ValidPassword";
import ValidUsername from "./ValidUsername";
import { useSignUpMutation } from "@/lib/queries/auth/queries";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState("");

  const { mutate } = useSignUpMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ email, password, username });
  };

  const isFormValid =
    emailValid === "사용 가능한 이메일입니다." &&
    passwordCheck === "비밀번호가 일치합니다." &&
    usernameValid === "사용 가능한 사용자명입니다.";

  return (
    <form
      className="flex flex-col p-5 max-w-[500px] w-full"
      onSubmit={handleSubmit}
    >
      <ValidEmail
        email={email}
        setEmail={setEmail}
        setEmailValid={setEmailValid}
      />
      <p
        className={`h-5 text-[12px] my-2 ${
          emailValid === "사용 가능한 이메일입니다."
            ? "text-green-500"
            : emailValid
            ? "text-red-500"
            : "text-transparent"
        }`}
      >
        {emailValid || "\u00A0"}
      </p>

      <ValidPassword
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        setPasswordCheck={setPasswordCheck}
      />

      <p
        className={`h-5 text-[12px] my-2 ${
          passwordCheck === "비밀번호가 일치합니다."
            ? "text-green-500"
            : passwordCheck
            ? "text-red-500"
            : "text-transparent"
        }`}
      >
        {passwordCheck || "\u00A0"}
      </p>

      <ValidUsername
        username={username}
        setUsername={setUsername}
        setUsernameValid={setUsernameValid}
      />

      <p
        className={`h-5 text-[12px] my-2 ${
          usernameValid === "사용 가능한 사용자명입니다."
            ? "text-green-500"
            : usernameValid
            ? "text-red-500"
            : "text-transparent"
        }`}
      >
        {usernameValid || "\u00A0"}
      </p>

      <button
        className={`p-3 rounded-md font-bold transition-all duration-200 ease-in-out ${
          isFormValid
            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            : "bg-gray-300 text-white cursor-default"
        }`}
        type="submit"
        disabled={!isFormValid}
      >
        회원가입
      </button>
    </form>
  );
}

export default SignupForm;
