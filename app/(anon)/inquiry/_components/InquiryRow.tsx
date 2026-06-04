"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

interface InquiryType {
  id: number;
  inquiry_type: string;
  title: string;
  guest_name: string | null;
  status: string | null;
  is_public: boolean | null;
  password: string | null;
  user_id: string | null;
}

interface InquiryRowProps {
  inquiry: InquiryType;
  displayIndex: number;
  inquiryTypeLabel: string;
  userLevel: number;
  currentUserId: string | null;
}

export default function InquiryRow({
  inquiry,
  displayIndex,
  inquiryTypeLabel,
  userLevel,
  currentUserId,
}: InquiryRowProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const isMaster = Number(userLevel) === 3;
  const isOwnPost = currentUserId && currentUserId === inquiry.user_id;
  const isSecret = inquiry.is_public === false;

  const maskName = (name: string | null) => {
    if (!name) return "";
    const trimmed = name.trim();
    if (trimmed.length <= 1) return trimmed;
    if (trimmed.length === 2) return trimmed[0] + "*";
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    const maskLength = trimmed.length - 2;
    const middle = "*".repeat(maskLength);
    return `${first}${middle}${last}`;
  };

  const handleRowClick = () => {
    if (isSecret && !isMaster && !isOwnPost) {
      setIsModalOpen(true);
    } else {
      router.push(`/inquiry/${inquiry.id}`);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiry.password === passwordInput.trim()) {
      setIsModalOpen(false);
      setPasswordInput("");
      router.push(`/inquiry/${inquiry.id}`);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <>
      <tr
        onClick={handleRowClick}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer"
      >
        <td className="py-4 px-2 font-semibold text-center text-gray-400">
          {displayIndex}
        </td>
        <td className="py-4 px-2 text-center text-gray-600 font-medium">
          <span className="bg-gray-100 px-2 py-1 rounded-sm text-xs text-gray-700">
            {inquiryTypeLabel}
          </span>
        </td>
        <td className="py-4 px-2 font-medium text-gray-900">
          <div className="flex items-center gap-1.5 truncate">
            {inquiry.title}
            {isSecret && <Lock size={13} className="text-gray-400 shrink-0" />}
          </div>
        </td>
        <td className="py-4 px-2 text-gray-600 text-center truncate">
          {maskName(inquiry.guest_name)}
        </td>
        <td className="py-4 px-2 text-center">
          {inquiry.status === "ANSWERED" ? (
            <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-sm text-xs">
              답변완료
            </span>
          ) : (
            <span className="text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded-sm text-xs">
              답변대기
            </span>
          )}
        </td>
      </tr>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-sm shadow-lg w-full max-w-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Lock size={18} className="text-gray-500" />
              비밀인증
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              이 글은 비밀글입니다. 작성 시 설정한 비밀번호를 입력해주세요.
            </p>

            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-gray-900 rounded-sm"
                autoFocus
              />
              <div className="flex gap-2 justify-end text-sm font-medium mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPasswordInput("");
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-sm hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000] text-white rounded-sm hover:bg-[#800000]/90 transition-colors"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
