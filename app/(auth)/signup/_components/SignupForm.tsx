"use client";

import { useState } from "react";
import { useSignUpMutation } from "../../queries";
import ValidEmail from "./ValidEmail";
import ValidPassword from "./ValidPassword";
import ValidUsername from "./ValidUsername";

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

  return (
    <form
      className="flex flex-col gap-6 p-5 max-w-[500px] w-full"
      onSubmit={handleSubmit}
    >
      <ValidEmail
        email={email}
        setEmail={setEmail}
        setEmailValid={setEmailValid}
      />
      <p
        className={`-my-5 h-5 text-[12px] ${
          emailValid === "사용 가능한 이메일입니다."
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {emailValid && emailValid}
      </p>

      <ValidPassword
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        setPasswordCheck={setPasswordCheck}
      />

      <p
        className={`-my-5 h-5 text-[12px] ${
          passwordCheck !== "비밀번호가 일치합니다."
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {passwordCheck && passwordCheck}
      </p>

      <ValidUsername
        username={username}
        setUsername={setUsername}
        setUsernameValid={setUsernameValid}
      />

      <p
        className={`-my-5 h-5 text-[12px] ${
          usernameValid === "사용 가능한 사용자명입니다."
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {usernameValid && usernameValid}
      </p>

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
