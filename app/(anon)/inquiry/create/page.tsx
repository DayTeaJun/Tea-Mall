"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import PrivacyModal from "../../policy/_components/PrivacyModal";
import {
  Lock,
  FileText,
  User,
  Phone,
  KeyRound,
  HelpCircle,
} from "lucide-react";
import { usePostInquiryMutation } from "@/lib/queries/auth";
import { toast } from "sonner";

interface InquiryType {
  content: string;
  email: string | null;
  guest_name: string | null;
  is_privacy_agreed: boolean | null;
  is_public: boolean | null;
  password: string | null;
  phone_number: string | null;
  title: string;
  user_id: string | null;
  inquiry_type: string;
}

const INQUIRY_OPTIONS = [
  { value: "DELIVERY", label: "배송 문의" },
  { value: "PRODUCT", label: "상품 문의" },
  { value: "CANCEL", label: "취소/반품/교환 문의" },
  { value: "ORDER", label: "주문/결제 문의" },
  { value: "AUTH", label: "계정 복구 문의" },
  { value: "OTHER", label: "기타 문의" },
];

export default function DeliveryRegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: postInquiryMutate } = usePostInquiryMutation();

  const [formData, setFormData] = useState<InquiryType>({
    title: "",
    content: "",
    email: user?.email || "",
    guest_name: user?.user_name || "",
    is_privacy_agreed: false,
    is_public: false,
    password: "",
    phone_number: user?.phone || "",
    user_id: user?.id || "",
    inquiry_type: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.inquiry_type) {
      toast.warning("문의 유형을 선택해주세요.");
      return;
    }

    if (!formData.title.trim()) {
      toast.warning("문의 제목을 입력해주세요.");
      return;
    }

    if (!formData.guest_name?.trim()) {
      toast.warning("문의자 이름을 입력해주세요.");
      return;
    }

    if (!formData.phone_number?.trim()) {
      toast.warning("휴대전화 번호를 입력해주세요.");
      return;
    }

    if (!formData.user_id && !formData.password?.trim()) {
      toast.warning("비회원 비밀번호 4자리를 입력해주세요.");
      return;
    }

    if (!formData.user_id && formData.password?.trim().length !== 4) {
      toast.warning("비밀번호는 숫자 4자리로 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      toast.warning("문의 내용을 입력해주세요.");
      return;
    }

    if (!formData.is_privacy_agreed) {
      toast.warning("개인정보 수집 및 이용 방침에 동의하셔야 합니다.");
      return;
    }

    postInquiryMutate(
      {
        title: formData.title,
        content: formData.content,
        guest_name: formData.guest_name,
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.user_id ? null : formData.password,
        is_public: !!formData.is_public,
        is_privacy_agreed: !!formData.is_privacy_agreed,
        user_id: formData.user_id || null,
        status: "PENDING",
        inquiry_type: formData.inquiry_type,
      },
      {
        onSuccess: () => {
          router.push("/cs/inquiry");
        },
      },
    );
  };

  return (
    <section className="w-full bg-white">
      <div className="border-b border-gray-900 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111111]">
          1:1 문의 등록
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
          구매하신 상품이나 서비스에 대해 문의 주시면 신속하게 답변드리겠습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#111111] flex items-center gap-1.5">
            <HelpCircle size={14} className="text-gray-400" />
            문의 유형 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.inquiry_type}
              onChange={(e) =>
                setFormData({ ...formData, inquiry_type: e.target.value })
              }
              className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm bg-white focus:outline-none focus:border-black focus:ring-0 transition-all text-[#111111] appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundPosition: "right 12px center",
                backgroundSize: "16px",
                backgroundRepeat: "no-repeat",
              }}
            >
              <option value="" disabled className="text-gray-300">
                문의 유형을 선택해주세요.
              </option>
              {INQUIRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#111111] flex items-center gap-1.5">
            <FileText size={14} className="text-gray-400" />
            문의 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-all"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#111111] flex items-center gap-1.5">
            <User size={14} className="text-gray-400" />
            문의자 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="이름을 입력해주세요."
            className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-all"
            value={formData.guest_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, guest_name: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#111111] flex items-center gap-1.5">
            <Phone size={14} className="text-gray-400" />
            휴대전화 번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="숫자만 입력해주세요."
            className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-all"
            value={formData.phone_number || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
        </div>

        {!formData.user_id && (
          <div className="flex flex-col gap-2 w-full sm:w-1/2">
            <label className="text-[13px] font-semibold text-[#111111] flex items-center gap-1.5">
              <KeyRound size={14} className="text-gray-400" />
              비회원 비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="비밀번호 숫자 4자리를 입력해주세요."
              className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-all"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#111111]">
            문의 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-200 p-3 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-all h-44 resize-none leading-relaxed"
            placeholder="문의하실 내용을 상세히 적어주세요. 개인정보가 포함되지 않도록 유의해주세요."
            value={formData.content || ""}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-4 pt-2 px-0.5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 border-gray-300 rounded-sm focus:ring-0 cursor-pointer accent-black shrink-0"
              checked={!!formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
            />
            <div className="flex flex-col select-none">
              <span className="text-[13px] font-medium text-[#111111] flex items-center gap-1">
                <Lock size={13} className="text-gray-400" /> 비밀글로 문의
                저장하기
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5 leading-normal">
                {formData.user_id
                  ? "체크 시 관리자와 작성자 본인만 내용을 확인할 수 있습니다."
                  : "체크 시 타인에게 노출되지 않으며, 비회원 조회 시 설정한 비밀번호가 한 번 더 필요합니다."}
              </span>
            </div>
          </label>

          <div className="flex items-center gap-3 w-full">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded-sm focus:ring-0 cursor-pointer accent-black shrink-0"
                checked={!!formData.is_privacy_agreed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_privacy_agreed: e.target.checked,
                  })
                }
              />
              <span className="text-[13px] text-[#111111] font-medium">
                [필수] 개인정보 수집 및 이용 방침 동의
              </span>
            </label>
            <PrivacyModal />
          </div>
        </div>

        <div className="flex items-center ml-auto gap-2.5 pt-6 mt-2 w-full sm:border-0 border-t border-gray-200 sm:w-1/2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-1/2 py-3 border border-gray-200 bg-white text-[#555555] text-sm font-medium rounded-sm hover:bg-gray-50 hover:text-black transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="w-1/2 py-3 bg-[#111111] text-white text-sm font-medium rounded-sm hover:bg-[#222222] transition-colors shadow-sm"
          >
            등록하기
          </button>
        </div>
      </form>
    </section>
  );
}
