"use client";

import { Lock, LockKeyhole } from "lucide-react";
import { useEffect } from "react";
import { PASSWORD_REGEX } from "../../constants";

interface Props {
  password: string;
  confirmPassword: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  setPasswordCheck: React.Dispatch<React.SetStateAction<string>>;
}

function ValidPassword({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  setPasswordCheck,
}: Props) {
  useEffect(() => {
    if (password === "" || confirmPassword === "") {
      setPasswordCheck("");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordCheck("비밀번호를 최소 6자 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordCheck("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password === confirmPassword) {
      setPasswordCheck("비밀번호가 일치합니다.");
      return;
    }
  }, [confirmPassword, password, setPasswordCheck]);

  return (
    <>
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
      <div className="flex gap-2 items-center border border-gray-100 mt-7">
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
    </>
  );
}

export default ValidPassword;
