"use client";

import { useState } from "react";
import CartBtn from "./CartBtn";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

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

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

  const handleBuyNow = () => {
    toast.info("바로 구매 기능은 현재 구현되지 않았습니다.");
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
          <SelectTrigger className="w-1/4">
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
                  {size}
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
            max={stockBySize[selectedSize] || 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border px-3 py-2 w-20"
          />
        </div>
        <div className="flex gap-2 w-2/3">
          <CartBtn productId={productId} quantity={quantity} />
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center cursor-pointer duration-300 transition-colors p-2"
          >
            <span>바로 구매</span>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
