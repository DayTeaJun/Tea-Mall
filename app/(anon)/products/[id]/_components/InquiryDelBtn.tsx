"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InquiryModal from "./InquiryModal";

interface Props {
  productId: string;
  myInquiryId: number | null;
}

function InquiryDelBtn({ productId, myInquiryId }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInquiryClick = async () => {
    if (!myInquiryId) {
      return toast.error(
        "문의 ID가 존재하지 않습니다. 문의 작성 후 다시 시도해주세요.",
      );
    }

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
  };

  return (
    <>
      <button
        onClick={handleInquiryClick}
        type="button"
        className="border border-gray-300 rounded px-3 text-11 text-gray-700 hover:bg-gray-100 transition"
      >
        삭제
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

export default InquiryDelBtn;
