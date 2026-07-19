"use client";

import { UserType } from "@/types/user";
import { useState } from "react";
import { X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InquiryModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export default function InquiryModal({
  user,
  isOpen,
  onClose,
  productId,
}: InquiryModalProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("문의 내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createBrowserSupabaseClient();

    try {
      const { error } = await supabase.from("product_inquiry").insert({
        user_id: user.id,
        user_name: user.user_name || "고객",
        product_id: productId,
        content: content,
      });

      if (error) throw error;

      toast.success("문의가 정상적으로 등록되었습니다.");
      setContent("");
      onClose();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("문의 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-sm shadow-xl flex flex-col overflow-hidden max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-4 py-3 sm:px-5 sm:py-4 bg-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            상품 문의하기
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-4 border-b pb-4 items-center">
            <span className="font-semibold text-gray-700 text-xs sm:text-sm">
              판매자
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              티몰 공식 판매처
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-4 items-start">
            <span className="font-semibold text-gray-700 text-xs sm:text-sm sm:mt-2">
              문의내용
            </span>
            <div className="relative w-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={200}
                placeholder="문의하실 내용을 입력해 주세요. (최대 200자)"
                className="w-full min-h-[140px] sm:min-h-[160px] border border-gray-200 p-3 pb-7 text-xs sm:text-sm focus:outline-none focus:border-gray-400 resize-none rounded-xs"
              />
              <div className="absolute bottom-2 right-3 text-[10px] sm:text-xs text-gray-400 font-medium">
                <span
                  className={
                    content.length >= 200 ? "text-amber-600 font-semibold" : ""
                  }
                >
                  {content.length}
                </span>
                <span> / 200자</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] sm:text-[11px] text-gray-400 leading-normal">
            * 개인정보(주민번호, 연락처, 주소, 계좌번호, 카드번호 등)가 포함되지
            않도록 유의해 주세요.
          </p>

          <div className="flex justify-center gap-2 mt-2 sm:mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial bg-[#007bff] text-white px-7 py-2 text-xs sm:text-sm font-medium hover:bg-[#0069d9] disabled:bg-gray-400 transition-colors"
            >
              확인
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial border border-gray-300 bg-white text-gray-700 px-7 py-2 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
