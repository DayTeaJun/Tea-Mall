"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import CommentSection from "./CommentSection";

interface InquiryDetailClientProps {
  inquiryId: number;
}

const INQUIRY_TYPE_MAP: Record<string, string> = {
  DELIVERY: "배송",
  PRODUCT: "상품",
  CANCEL: "취소/반품",
  ORDER: "주문/결제",
  OTHER: "기타",
  AUTH: "계정",
};

export default function InquiryDetailComponent({
  inquiryId,
}: InquiryDetailClientProps) {
  const supabase = createBrowserSupabaseClient();
  const { user } = useAuthStore();
  const isAdmin = user?.level === 3;

  const [inputPassword, setInputPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const {
    data: inquiry,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inquiry", inquiryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("id", inquiryId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="py-10 text-center text-gray-400 text-sm">로딩 중...</div>
    );
  if (error || !inquiry)
    return (
      <div className="py-10 text-center text-gray-400 text-sm">
        존재하지 않거나 삭제된 문의입니다.
      </div>
    );

  const isOwner = user?.id && inquiry.user_id === user.id;
  const isSecret = !inquiry.is_public;

  if (isSecret && !isAdmin && !isOwner && !isVerified) {
    const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputPassword === inquiry.password) {
        setIsVerified(true);
        toast.success("인증되었습니다.");
      } else {
        toast.error("비밀번호가 일치하지 않습니다.");
      }
    };

    return (
      <div className="max-w-md mx-auto my-20 p-6 border border-gray-100 rounded-sm bg-white shadow-sm flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">비밀글 열람</h3>
        <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
          이 글은 비공개로 문의된 글입니다.
          <br />
          설정하신 비회원 비밀번호 4자리를 입력해주세요.
        </p>
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full flex flex-col gap-3"
        >
          <input
            type="password"
            maxLength={4}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="비밀번호 4자리 입력"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm text-center tracking-widest focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-sm"
          >
            확인
          </button>
        </form>
      </div>
    );
  }

  const maskName = (name: string | null) => {
    if (!name) return "";
    const trimmed = name.trim();
    if (trimmed.length <= 1) return trimmed;
    if (trimmed.length === 2) return trimmed[0] + "*";
    return `${trimmed[0]}${"*".repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
  };

  const inquiryTypeLabel =
    INQUIRY_TYPE_MAP[inquiry.inquiry_type] || inquiry.inquiry_type;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="w-full flex flex-col border-b-2 border-solid border-gray-200 py-2 gap-3">
        <h2 className="flex gap-2 text-2xl font-bold items-center">
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-sm font-medium">
            {inquiryTypeLabel}
          </span>
          {inquiry.title}
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <p className="text-sm text-gray-400">
              {maskName(inquiry.guest_name)}
            </p>
            <p className="text-sm text-gray-400">
              {inquiry.created_at
                ? new Date(inquiry.created_at).toLocaleDateString()
                : ""}
            </p>
          </div>
          <Link
            href="/inquiry"
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 transition-colors font-medium rounded-sm"
          >
            목록보기
          </Link>
        </div>
      </div>

      <div className="border-solid border-gray-100 min-h-[150px] py-4">
        <p className="text-lg whitespace-pre-wrap leading-8 text-gray-800">
          {inquiry.content}
        </p>
      </div>

      <CommentSection inquiry={inquiry} />
    </div>
  );
}
