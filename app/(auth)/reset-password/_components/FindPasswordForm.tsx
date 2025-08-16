"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import { Lock, LockKeyhole } from "lucide-react";

function parseHashParams(hash: string) {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(h);
  return {
    access_token: params.get("access_token") ?? undefined,
    refresh_token: params.get("refresh_token") ?? undefined,
    type: params.get("type") ?? undefined,
    error_code: params.get("error_code") ?? undefined,
  };
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isRecovery, setIsRecovery] = useState(false);
  const [expired, setExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [autoResent, setAutoResent] = useState(false);

  // 해시/쿼리 에러 감지
  const urlHash = useMemo(
    () => (typeof window !== "undefined" ? window.location.hash : ""),
    [],
  );
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const h = parseHashParams(urlHash || "");
    const err = q.get("error_code") || h.error_code;
    if (err === "otp_expired") setExpired(true);
  }, [urlHash]);

  // PASSWORD_RECOVERY / SIGNED_IN 이벤트
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")
        setIsRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // PKCE: ?code=...
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        setIsRecovery(true);
        if (typeof window !== "undefined")
          window.history.replaceState(
            {},
            "",
            window.location.pathname + window.location.search,
          );
      }
    })();
  }, [searchParams, supabase]);

  // Implicit: #access_token=...&type=recovery
  useEffect(() => {
    if (!urlHash) return;
    const { access_token, refresh_token, type } = parseHashParams(urlHash);
    if (type === "recovery" && access_token && refresh_token) {
      (async () => {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) {
          setIsRecovery(true);
          if (typeof window !== "undefined")
            window.history.replaceState(
              {},
              "",
              window.location.pathname + window.location.search,
            );
        }
      })();
    }
  }, [supabase, urlHash]);

  // 안전망: 세션 존재 시 허용
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setIsRecovery(true);
    })();
  }, [supabase]);

  // 만료 시 자동 재전송 1회 (email 쿼리가 있을 때만)
  useEffect(() => {
    if (!expired || autoResent) return;
    const email = searchParams.get("email") || "";
    if (!email) return; // 이메일 없으면 수동 재전송 유도
    (async () => {
      setResending(true);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/reset-password?email=${encodeURIComponent(
        email,
      )}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      setResending(false);
      setAutoResent(true);
      if (!error)
        toast.success(
          "만료되어 새 링크를 다시 보냈습니다. 받은 편지함을 확인하세요.",
        );
    })();
  }, [expired, autoResent, searchParams, supabase]);

  const handleResend = async () => {
    const email = searchParams.get("email") || "";
    if (!email) {
      toast.info("이메일 정보가 없어 재전송 페이지로 이동합니다.");
      router.replace("/find-password");
      return;
    }
    setResending(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/reset-password?email=${encodeURIComponent(
      email,
    )}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setResending(false);
    if (error) toast.error(`재전송 실패: ${error.message}`);
    else
      toast.success("재설정 링크를 다시 보냈습니다. 받은 편지함을 확인하세요.");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRecovery) {
      toast.error(
        "유효하지 않은 접근입니다. 이메일의 복구 링크로 다시 접속해주세요.",
      );
      return;
    }
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
      {expired && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          링크가 만료되었습니다. 아래 버튼으로 재설정 이메일을 다시 받으세요.
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className={`ml-3 inline-flex items-center rounded-md px-3 py-1.5 text-white ${
              resending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {resending ? "재전송 중..." : "재전송"}
          </button>
        </div>
      )}

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
        <label htmlFor="passwordConfirm" className="bg-gray-50 p-3">
          <LockKeyhole size={20} className="text-gray-400" />
        </label>
        <input
          id="passwordConfirm"
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
