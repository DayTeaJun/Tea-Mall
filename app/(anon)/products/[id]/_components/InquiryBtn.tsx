"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import InquiryModal from "./InquiryModal";

function InquiryBtn({ productId }: { productId: string }) {
  const { user } = useAuthStore();
  const [hasInquiry, setHasInquiry] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkInquiryAndEligibility = async () => {
      if (!user?.id) return;

      const supabase = createBrowserSupabaseClient();

      const productInquiry = supabase
        .from("product_inquiry")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("product_id", productId);

      const { count: inquiryCount, error: inquiryErr } = await productInquiry;

      setHasInquiry(!inquiryErr && (inquiryCount ?? 0) > 0);
    };

    checkInquiryAndEligibility();
  }, [user?.id, productId]);

  const label = hasInquiry ? "문의 삭제하기" : "문의 작성하기";

  const handleInquiryClick = async () => {
    if (!user) {
      toast.warning("로그인 후 문의 작성이 가능합니다.");
      return;
    }

    if (!hasInquiry) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInquiryClick}
        type="button"
        className="border-2 border-gray-200 py-1 px-3 font-medium text-black hover:bg-gray-50 transition-colors"
      >
        {label}
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
