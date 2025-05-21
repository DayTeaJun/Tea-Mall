"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/useCartStore";
import { ProductType } from "@/types/product";
import { toast } from "sonner";

export default function CartButtons({ product }: { product: ProductType }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url || "",
    });

    toast.success("장바구니에 추가되었습니다.");
  };

  return (
    <div className="flex gap-2">
      <Button
        className="flex-1 bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
        onClick={() => handleAddToCart()}
      >
        장바구니 추가
      </Button>
    </div>
  );
}
