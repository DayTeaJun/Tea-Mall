"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

const STORAGE_KEY = "profile_edit_verified_until";
const REAUTH_TTL_MIN = 10;

export function hasValidProfileEditVerification(): boolean {
  const until = Number(sessionStorage.getItem(STORAGE_KEY) ?? 0);
  return Date.now() < until;
}

export default function PasswordGate({
  onVerified,
}: {
  onVerified: () => void;
}) {
  const supabase = createBrowserSupabaseClient();
  const { user } = useAuthStore();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  const handleVerify = async () => {
    setPending(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });
    setPending(false);

    if (error) {
      toast.error("비밀번호가 올바르지 않습니다.");
      return;
    }
    if (data.user?.id !== user.id) {
      toast.error("계정 불일치가 감지되었습니다.");
      return;
    }
    sessionStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + REAUTH_TTL_MIN * 60 * 1000),
    );
    onVerified();
  };

  return (
    <div className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-2">본인 확인</h3>
      <p className="text-sm text-gray-600 mb-4">
        개인정보 보호를 위해 프로필 수정 전 비밀번호 확인이 필요합니다.
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        className="w-full border rounded px-3 py-2 mb-3"
        onKeyDown={(e) => e.key === "Enter" && handleVerify()}
      />
      <button
        onClick={handleVerify}
        disabled={pending || password.length === 0}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {pending ? "확인 중..." : "비밀번호 확인"}
      </button>
    </div>
  );
}
