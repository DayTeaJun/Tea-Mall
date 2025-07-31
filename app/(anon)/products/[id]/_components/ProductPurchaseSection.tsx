"use client";

import { useEffect, useState } from "react";
import CartBtn from "../../../../../components/common/buttons/CartBtn";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function ProductPurchaseSection({
  productId,
  stockBySize = {},
}: {
  productId: string;
  stockBySize: Record<string, number>;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // 가용 사이즈 중 기본 선택값을 계산 (우선 L, 없으면 첫 가용 사이즈)
  const pickFirstAvailable = (stock: Record<string, number>) => {
    if ((stock["L"] ?? 0) > 0) return "L";
    const first = sizeOptions.find((s) => (stock[s] ?? 0) > 0);
    return first ?? "";
  };

  const [selectedSize, setSelectedSize] = useState<string>(() =>
    pickFirstAvailable(stockBySize),
  );
  const [quantity, setQuantity] = useState<number>(1);

  const currentStock = stockBySize[selectedSize] ?? 0;

  useEffect(() => {
    // 현재 선택이 없거나 품절이면 재선택
    if (!selectedSize || currentStock === 0) {
      const next = pickFirstAvailable(stockBySize);
      setSelectedSize(next);
      // 선택이 가능하면 수량 1, 전부 품절이면 0 유지(아래 입력에서 min=1이므로 1로 둬도 무방)
      setQuantity(next ? 1 : 1);
    }
    // 수량이 재고를 초과하면 클램프
    if (currentStock > 0 && quantity > currentStock) {
      setQuantity(currentStock);
    }
  }, [stockBySize, selectedSize, currentStock, quantity]);

  const handleBuyNow = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!selectedSize || currentStock === 0) {
      toast.error("사이즈를 선택해주세요.");
      return;
    }

    router.push(
      `/directCheckout?productId=${productId}&size=${selectedSize}&quantity=${quantity}`,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          사이즈 선택
        </label>
        <Select
          value={selectedSize}
          onValueChange={(value) => {
            setSelectedSize(value);
            setQuantity(1); // 사이즈 변경 시 수량 초기화
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="사이즈 선택" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((size) => {
              const stock = stockBySize[size] ?? 0;
              const isDisabled = stock === 0;

              return (
                <SelectItem
                  key={size}
                  value={size}
                  disabled={isDisabled}
                  className={
                    isDisabled ? "text-gray-400 cursor-not-allowed" : ""
                  }
                >
                  {size + ` (${stock}개 남음)`}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-end">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            수량
          </label>
          <input
            type="number"
            min={1}
            max={Math.max(1, currentStock || 1)}
            value={quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              const max = Math.max(1, currentStock || 1);
              const clamped = Math.min(Math.max(1, val), max);
              setQuantity(clamped);
            }}
            className="border px-3 py-2 w-20"
            disabled={!selectedSize || currentStock === 0}
          />
        </div>
        <div className="flex gap-2 w-2/3">
          <CartBtn
            className="text-green-600 hover:text-green-900 border-2 hover:border-green-900 cursor-pointer p-2 duration-300 transition-colors"
            productId={productId}
            quantity={quantity}
            selectedSize={selectedSize}
          />
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center cursor-pointer duration-300 transition-colors p-2"
            disabled={!selectedSize || currentStock === 0}
          >
            <span>바로 구매</span>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
