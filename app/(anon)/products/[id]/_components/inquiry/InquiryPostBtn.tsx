"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import InquiryModal from "./InquiryModal";

interface Props {
  productId: string;
}

function InquiryPostBtn({ productId }: Props) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInquiryClick = async () => {
    if (!user) {
      toast.warning("로그인 후 문의 작성이 가능합니다.");
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleInquiryClick}
        type="button"
        className="border-2 border-gray-200 py-1 px-3 font-medium text-black hover:bg-gray-50 transition-colors text-xs sm:text-sm"
      >
        문의 작성하기
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

export default InquiryPostBtn;
