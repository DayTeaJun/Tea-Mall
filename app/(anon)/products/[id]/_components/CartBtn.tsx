"use client";

import { usePostMutation } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

export default function CartBtn({
  productId,
  quantity,
  selectedSize,
}: {
  productId: string;
  quantity: number;
  selectedSize: string;
}) {
  const { user } = useAuthStore();
  const userId = user?.id;

  const { mutate } = usePostMutation(userId || "");

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      toast.error("수량은 1개 이상이어야 합니다.");
      return;
    }

    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!selectedSize) {
      toast.error("사이즈를 선택해주세요.");
      return;
    }

    mutate({ userId, productId, quantity, selectedSize });
  };

  return (
    <div className="flex gap-2">
      <button
        className="flex-1 text-green-600 hover:text-green-900 border-2 border-green-600 hover:border-green-900 cursor-pointer p-2 duration-300 transition-colors"
        onClick={handleAddToCart}
      >
        장바구니 추가
      </button>
    </div>
  );
}
