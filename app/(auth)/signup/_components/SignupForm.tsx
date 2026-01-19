"use client";

import { useState } from "react";
import ValidEmail from "./ValidEmail";
import ValidPassword from "./ValidPassword";
import ValidUsername from "./ValidUsername";
import { useSignUpMutation } from "@/lib/queries/auth";
import PolicyForm from "./PolicyForm";
import { Phone } from "lucide-react";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState("");

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  const { mutate } = useSignUpMutation();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(value);

    if (!value) {
      setPhoneValid("");
      return;
    }

    if (!/^010\d{7,8}$/.test(value)) {
      setPhoneValid("휴대폰 번호 형식이 올바르지 않습니다.");
      return;
    }

    setPhoneValid("사용 가능한 휴대폰 번호입니다.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      email,
      password,
      username: username.trim().toLowerCase(),
      phone,
    });
  };

  const isFormValid =
    emailValid === "사용 가능한 이메일입니다." &&
    passwordCheck === "비밀번호가 일치합니다." &&
    usernameValid === "사용 가능한 사용자명입니다." &&
    phoneValid === "사용 가능한 휴대폰 번호입니다." &&
    agreements.terms &&
    agreements.privacy;

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

      <div className="flex gap-2 items-center border border-gray-100">
        <label htmlFor="username" className="bg-gray-50 p-3">
          <Phone size={18} className="text-gray-400" />
        </label>

        <input
          type="tel"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={handlePhoneChange}
          className="border-none outline-0 px-2 w-full"
        />
      </div>

      <p
        className={`h-5 text-[12px] my-2 ${
          phoneValid === "사용 가능한 휴대폰 번호입니다."
            ? "text-green-500"
            : phoneValid
              ? "text-red-500"
              : "text-transparent"
        }`}
      >
        {phoneValid || "\u00A0"}
      </p>

      <PolicyForm agreements={agreements} setAgreements={setAgreements} />

      <button
        className={`p-3 rounded-md font-bold transition-all duration-200 ${
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
