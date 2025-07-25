"use client";

import { usePostMutation } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

export default function CartBtn({
  productId,
  quantity,
  selectedSize,
  className,
}: {
  productId: string;
  quantity: number;
  selectedSize: string;
  className?: string;
}) {
  const { user } = useAuthStore();
  const userId = user?.id;

  const { mutate } = usePostMutation(userId || "");

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

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
      <button className={`flex-1 ${className} `} onClick={handleAddToCart}>
        장바구니 담기
      </button>
    </div>
  );
}
