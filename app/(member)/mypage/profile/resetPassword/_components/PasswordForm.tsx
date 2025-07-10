"use client";

import React, { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

function PasswordForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserSupabaseClient();

  const disabled =
    !currentPassword ||
    !newPassword ||
    !newPasswordConfirm ||
    newPassword !== newPasswordConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      toast.warning("모든 항목을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setIsLoading(false);

    if (updateError) {
      if (
        updateError.message ===
        "New password should be different from the old password."
      ) {
        toast.error("이전 비밀번호와 일치합니다.");
      } else if (
        updateError.message === "Password should be at least 6 characters."
      ) {
        toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      } else {
        toast.error(updateError.message);
      }
    } else {
      toast.success("비밀번호가 성공적으로 변경되었습니다.");

      router.push("/mypage");
    }
  };

  return (
    <>
      <p className="text-[13px] text-gray-500 mb-2">
        현재 비밀번호를 입력한 후 새 비밀번호로 변경할 수 있습니다.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-[500px] w-full"
      >
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="p-3 border rounded-md text-sm"
        />

        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-3 border rounded-md text-sm"
        />

        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          className="p-3 border rounded-md text-sm"
        />

        <span
          className={`${
            newPassword === newPasswordConfirm
              ? "text-green-500"
              : "text-red-500"
          } text-[12px] h-[18px]`}
        >
          {newPasswordConfirm.length > 0 &&
            (newPassword === newPasswordConfirm
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다.")}
        </span>
        <button
          type="submit"
          disabled={disabled}
          className={`p-3 rounded-md font-bold transition-all duration-200 ease-in-out text-white ${
            disabled
              ? "bg-gray-400 !cursor-default"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "변경 중..." : "비밀번호 변경"}
        </button>
        <Link
          href="/mypage/profile"
          className="text-[14px] cursor-pointer underline mx-auto"
        >
          취소하기
        </Link>
      </form>
    </>
  );
}

export default PasswordForm;
