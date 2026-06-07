"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useInquiryStore } from "@/lib/store/useInquiryStore";

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
  userLevel: number | string | null | undefined;
  currentUserId: string | null;
}

export default function InquiryRow({
  inquiry,
  displayIndex,
  inquiryTypeLabel,
  userLevel,
  currentUserId,
}: InquiryRowProps) {
  const { addVerifiedId } = useInquiryStore();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const isMaster = Number(userLevel) === 3;
  const isOwnPost = !!(currentUserId && currentUserId === inquiry.user_id);
  const isSecret = inquiry.is_public === false;

  const maskName = (name: string | null) => {
    if (!name) return "";
    const trimmed = name.trim();
    if (trimmed.length <= 1) return trimmed;
    if (trimmed.length === 2) return `${trimmed[0]}*`;

    return `${trimmed[0]}${"*".repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
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

    if (!passwordInput.trim()) {
      toast.warning("비밀번호를 입력해주세요.");
      return;
    }

    if (inquiry.password === passwordInput.trim()) {
      addVerifiedId(inquiry.id);
      setIsModalOpen(false);
      setPasswordInput("");
      router.push(`/inquiry/${inquiry.id}`);
    } else {
      toast.warning("비밀번호가 일치하지 않습니다.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPasswordInput("");
  };

  return (
    <tr
      onClick={handleRowClick}
      className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group cursor-pointer"
    >
      <td className="py-4 px-2 font-semibold text-center text-gray-400 text-xs sm:text-sm">
        {displayIndex}
      </td>
      <td className="py-4 px-2 text-center text-gray-600 font-medium">
        <span className="bg-gray-100 px-2 py-1 rounded-sm text-[11px] sm:text-xs text-gray-700 whitespace-nowrap">
          {inquiryTypeLabel}
        </span>
      </td>
      <td className="py-4 px-2 font-medium text-gray-900 max-w-[180px] sm:max-w-none">
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate group-hover:text-black transition-colors">
            {inquiry.title}
          </span>
          {isSecret && <Lock size={13} className="text-gray-400 shrink-0" />}
        </div>
      </td>
      <td className="py-4 px-2 text-gray-600 text-center truncate text-xs sm:text-sm">
        {maskName(inquiry.guest_name)}
      </td>
      <td className="py-4 px-2 text-center whitespace-nowrap relative">
        {inquiry.status === "ANSWERED" ? (
          <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-sm text-[11px] sm:text-xs">
            답변완료
          </span>
        ) : (
          <span className="text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded-sm text-[11px] sm:text-xs">
            답변대기
          </span>
        )}

        {isModalOpen && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 cursor-default"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-sm shadow-xl w-[calc(100%-2rem)] max-w-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-150 text-left"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Lock size={18} className="text-gray-700" />
                비밀인증
              </h3>
              <p className="text-xs text-gray-400 mb-5 leading-normal whitespace-pre-wrap">
                {
                  "이 글은 비공개 문의입니다.\n작성 시 설정한 비밀번호 4자리를 입력해주세요."
                }
              </p>

              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-4"
              >
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-4]*"
                  placeholder="비밀번호 입력"
                  value={passwordInput}
                  onChange={(e) =>
                    setPasswordInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full border border-gray-200 p-2.5 text-sm outline-none focus:border-black rounded-sm text-black text-center tracking-widest font-mono"
                  autoFocus
                />
                <div className="flex gap-2 justify-end text-sm font-medium pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-sm hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    확인
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
