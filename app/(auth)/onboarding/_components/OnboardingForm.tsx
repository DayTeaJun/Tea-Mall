"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

type Props = {
  initial: {
    email: string;
    user_name: string;
    profile_image_url: string;
    phone: string;
    address: string;
  };
};

export default function OnboardingForm({ initial }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const supabase = createBrowserSupabaseClient();

  const returnTo = useMemo(() => sp.get("returnTo") || "/", [sp]);

  const [email] = useState(initial.email);
  const [userName, setUserName] = useState(initial.user_name || "");
  const [avatarUrl, setAvatarUrl] = useState(initial.profile_image_url || "");
  const [phone, setPhone] = useState(initial.phone || "");
  const [address, setAddress] = useState(initial.address || "");
  const [checking, setChecking] = useState(false);
  const [okUserName, setOkUserName] = useState<boolean | null>(null);
  const [hint, setHint] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const normalizeUserName = (v: string) =>
    v
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(1 - 1, 16); // 1~16자

  const onChangeUserName = async (v: string) => {
    const u = normalizeUserName(v);
    setUserName(u);

    if (!u) {
      setHint("영문/숫자/-/_ 1~16자");
      setOkUserName(false);
      return;
    }

    setChecking(true);
    const { data: cur } = await supabase.auth.getUser();
    const { data: exists } = await supabase
      .from("user_table")
      .select("id")
      .eq("user_name", u)
      .maybeSingle();

    if (exists && exists.id !== cur.user?.id) {
      setHint("이미 사용 중인 사용자명입니다.");
      setOkUserName(false);
    } else {
      setHint("사용 가능한 사용자명입니다.");
      setOkUserName(true);
    }
    setChecking(false);
  };

  const onChangePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length >= 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
        7,
      )}`;
    }
    setPhone(formatted);
  };

  const onAvatarChange = async (file?: File) => {
    if (!file) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `user/${user.id}/profile.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("user")
      .upload(path, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type,
      });

    if (upErr) {
      alert(`이미지 업로드 실패: ${upErr.message}`);
      return;
    }
    const { data: pub } = supabase.storage.from("user").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const uname = normalizeUserName(userName);
    if (!uname) {
      alert("사용자명을 입력해주세요.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    // 최종 중복 확인
    const { data: exists } = await supabase
      .from("user_table")
      .select("id")
      .eq("user_name", uname)
      .maybeSingle();
    if (exists && exists.id !== user.id) {
      setSaving(false);
      alert("이미 사용 중인 사용자명입니다.");
      return;
    }

    // 업서트(본인 row만)
    const { error: upErr } = await supabase
      .from("user_table")
      .upsert(
        {
          id: user.id,
          email: email || user.email,
          user_name: uname,
          profile_image_url: avatarUrl || null,
          phone: phone || null,
          address: address || null,
        },
        { onConflict: "id" },
      )
      .eq("id", user.id);

    if (upErr) {
      setSaving(false);
      alert(`저장 실패: ${upErr.message}`);
      return;
    }

    // (선택) auth user metadata 동기화
    await supabase.auth.updateUser({
      data: {
        user_name: uname,
        avatar_url: avatarUrl || null,
        phone: phone || null,
      },
    });

    router.replace(returnTo);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">계정 설정 마무리</h1>
      <p className="text-sm text-gray-600 mb-6">
        처음 오셨네요. 사용자 정보를 입력해주세요.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* 이메일(읽기전용) */}
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-50"
            value={email}
            readOnly
          />
        </div>

        {/* 사용자명 */}
        <div>
          <label className="block text-sm font-medium mb-1">사용자명 *</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={userName}
            onChange={(e) => onChangeUserName(e.target.value)}
            placeholder="영문/숫자/-/_ 1~16자"
            maxLength={16}
          />
          <p
            className={`text-xs mt-1 ${
              okUserName ? "text-green-600" : "text-gray-500"
            }`}
          >
            {checking
              ? "중복 검사 중…"
              : hint || "영문/숫자/-/_ 만 허용됩니다."}
          </p>
        </div>

        {/* 프로필 이미지 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            프로필 이미지
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="avatar"
                src={avatarUrl || "/placeholder.png"}
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onAvatarChange(e.target.files?.[0])}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            정사각형 이미지를 권장합니다.
          </p>
        </div>

        {/* 휴대폰 */}
        <div>
          <label className="block text-sm font-medium mb-1">휴대폰</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            inputMode="numeric"
            placeholder="010-1234-5678"
          />
        </div>

        {/* 주소(단일 컬럼) */}
        <div>
          <label className="block text-sm font-medium mb-1">주소</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-24"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력해주세요"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving || !userName}
            className="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장하고 시작하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
