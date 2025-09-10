"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import useDebounce from "@/hooks/useDebounce";
import { serverCheckUsernameExists } from "@/lib/actions/auth";
import { USERNAME_REGEX } from "../../constants";
import { useSignUpMutation } from "@/lib/queries/auth";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

export default function OnboardingForm({ user }: Props) {
  const supabase = createBrowserSupabaseClient();
  const { mutate } = useSignUpMutation();
  const [username, setUsername] = useState("");

  const debounceUsername = useDebounce<string>(username);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hint, setHint] = useState<string>("");

  useEffect(() => {
    const validateUsername = async () => {
      if (debounceUsername.length === 0) {
        setHint("");
        return;
      }

      if (!USERNAME_REGEX.test(debounceUsername)) {
        setHint("최소 2글자 이상 20자 미만의 닉네임을 입력해주세요.");
        return;
      }

      try {
        const exists = await serverCheckUsernameExists(debounceUsername);

        if (exists) {
          setHint("중복된 사용자명입니다.");
        } else {
          setHint("사용 가능한 사용자명입니다.");
        }
      } catch (error) {
        console.error("닉네임 확인 중 오류:", error);
        setHint("이메일 확인 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
      }
    };

    validateUsername();
  }, [debounceUsername, setHint]);

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

    mutate({
      id: user.id,
      email: user.email || "",
      username,
      phone,
      address,
      profile_image_url: avatarUrl,
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">계정 설정 마무리</h1>
      <p className="text-sm text-gray-600 mb-6">
        처음 오셨네요. 사용자 정보를 입력해주세요.
      </p>

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-50"
            value={user.email}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">사용자명 *</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="영문/숫자/-/_ 1~16자"
            maxLength={16}
          />
          <p
            className={`text-xs mt-1 ${
              hint === "중복된 사용자명입니다."
                ? "text-red-600"
                : hint === "사용 가능한 사용자명입니다."
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {hint ? hint : "영문/숫자/-/_ 만 허용됩니다."}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            프로필 이미지
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border bg-gray-50">
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

        <div>
          <label className="block text-sm font-medium mb-1">휴대폰</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            inputMode="numeric"
            placeholder="- 없이 숫자만 입력"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">주소</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-24"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력해주세요"
          />
        </div>

        <div className="pt-2 ml-auto">
          <button
            type="submit"
            disabled={!username}
            className="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-60"
          >
            저장하고 시작하기
          </button>
        </div>
      </form>
    </div>
  );
}
