"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CartBtn from "./CartBtn";
import { toast } from "sonner";

export default function ProductPurchaseSection({
  productId,
  stockBySize = {},
}: {
  productId: string;
  stockBySize: Record<string, number>;
}) {
  const sizes = Object.keys(stockBySize);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [quantity, setQuantity] = useState<number>(1);

  const handleBuyNow = () => {
    toast.info("바로 구매 기능은 현재 구현되지 않았습니다.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          사이즈 선택
        </label>
        <select
          value={selectedSize}
          onChange={(e) => {
            setSelectedSize(e.target.value);
            setQuantity(1);
          }}
          className="border rounded px-3 py-2"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size} ({stockBySize[size]}개 남음)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          수량
        </label>
        <input
          type="number"
          min={1}
          max={stockBySize[selectedSize] || 1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-3 py-2 w-20"
        />
      </div>

      <div className="flex gap-2">
        <CartBtn productId={productId} quantity={quantity} />
        <Button
          onClick={handleBuyNow}
          className="flex-1 bg-red-600 text-white hover:bg-red-700"
        >
          바로 구매
        </Button>
      </div>
    </div>
  );
}
