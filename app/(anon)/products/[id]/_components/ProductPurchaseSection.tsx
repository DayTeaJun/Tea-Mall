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

  // 가용 사이즈 중 기본 선택값(L 우선, 없으면 첫 가용)
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
      setQuantity(1);
    }
  }, [stockBySize, selectedSize, currentStock]);

  const validateQuantity = () => {
    if (!selectedSize) {
      toast.error("사이즈를 선택해주세요.");
      return false;
    }
    if (currentStock === 0) {
      toast.error("선택하신 사이즈는 품절입니다.");
      return false;
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      toast.error("수량은 1 이상으로 입력해주세요.");
      return false;
    }
    if (quantity > currentStock) {
      toast.error(
        `현재 선택하신 재고는 최대 ${currentStock}개입니다.\n수량을 조정해주세요.`,
      );
      return false;
    }
    return true;
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!validateQuantity()) return;

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
            setQuantity(1);
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

      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between items-end">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            수량
          </label>

          <input
            type="text" // ← number 대신 text로
            inputMode="numeric" // 모바일 키보드 숫자 모드
            value={quantity}
            onChange={(e) => {
              const raw = e.target.value;
              // 숫자만 허용 + 빈칸 허용
              if (/^\d*$/.test(raw)) {
                setQuantity(raw === "" ? 0 : Number(raw));
              }
            }}
            onBlur={() => {
              const val = Number(quantity);
              if (!Number.isFinite(val) || val < 1) {
                setQuantity(0); // 최소 보정
              } else {
                setQuantity(val);
              }
            }}
            className="border px-3 py-2 w-full sm:w-20"
            disabled={!selectedSize || currentStock === 0}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-2/3">
          <div
            className="flex-1"
            onClickCapture={(e) => {
              if (!validateQuantity()) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <CartBtn
              className="w-full text-green-600 hover:text-green-900 border-2 hover:border-green-900 cursor-pointer p-2 duration-300 transition-colors"
              productId={productId}
              quantity={quantity}
              selectedSize={selectedSize}
            />
          </div>

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
