"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import { Lock, LockKeyhole } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserSupabaseClient();

  //   useEffect(() => {
  //     const code = new URL(window.location.href).searchParams.get("code");

  //     if (!code) {
  //       toast.error("잘못된 접근입니다.");
  //       router.replace("/");
  //       return;
  //     }

  //     supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
  //       if (error) {
  //         toast.error("링크가 만료되었거나 이미 사용되었습니다.");
  //         router.replace("/find-password");
  //       }
  //     });
  //   }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setIsLoading(false);

    if (error) {
      toast.error("비밀번호 변경 실패: " + error.message);
    } else {
      toast.success("비밀번호가 변경되었습니다.");
      router.replace("/signin");
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col p-5 max-w-[500px] w-full gap-6"
    >
      <div className="flex gap-2 items-center border border-gray-100">
        <label htmlFor="password" className="bg-gray-50 p-3">
          <Lock size={20} className="text-gray-400" />
        </label>
        <input
          id="password"
          placeholder="비밀번호"
          className="border-none outline-0 px-2 w-full"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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

      <button
        type="submit"
        disabled={isLoading}
        className={`p-3 rounded-md font-bold transition-all ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isLoading ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}
