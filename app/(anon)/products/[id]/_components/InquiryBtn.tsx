"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InquiryModal from "./InquiryModal";

interface Props {
  productId: string;
  initialHasInquiry: boolean;
  myInquiryId: number | null;
}

function InquiryBtn({ productId, initialHasInquiry, myInquiryId }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInquiryClick = async () => {
    if (!user) {
      toast.warning("로그인 후 문의 작성이 가능합니다.");
      return;
    }

    if (initialHasInquiry && myInquiryId) {
      if (!confirm("작성하신 상품 문의를 삭제하시겠습니까?")) return;

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from("product_inquiry")
        .delete()
        .eq("id", myInquiryId);

      if (error) {
        toast.error("문의 삭제에 실패했습니다.");
      } else {
        toast.success("문의가 삭제되었습니다.");
        router.refresh();
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInquiryClick}
        type="button"
        className="border-2 border-gray-200 py-1 px-3 font-medium text-black hover:bg-gray-50 transition-colors text-xs sm:text-sm"
      >
        {initialHasInquiry ? "문의 삭제하기" : "문의 작성하기"}
      </button>

      {user && isModalOpen && (
        <InquiryModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={productId}
        />
      )}
    </>
  );
}

export default InquiryBtn;
