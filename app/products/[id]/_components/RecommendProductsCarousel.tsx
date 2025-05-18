"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductAllToMainQuery } from "@/lib/queries/products";

export default function RecommendProductsCarousel() {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const { data: products, isLoading } = useProductAllToMainQuery();

  const scroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // ✨ 제품 목록을 강제로 늘림 (3배 반복)
  const extendedProducts =
    !isLoading && products
      ? Array.from({ length: 10 }).flatMap(() =>
          products.map((p, i) => ({ ...p, id: `${p.id}-${i}` })),
        )
      : [];

  return (
    <div className="w-full mt-16">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">추천 상품</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar whitespace-nowrap"
      >
        {!isLoading &&
          extendedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id.split("-")[0]}`} // 원래 ID로 이동
              className="inline-block align-top w-[200px]"
            >
              <Card className="hover:shadow-md transition duration-200">
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.price.toLocaleString()}원
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
