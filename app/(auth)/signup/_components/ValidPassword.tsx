"use client";

import { Lock, LockKeyhole } from "lucide-react";

function ValidPassword({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {
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
    </>
  );
}

export default ValidPassword;
