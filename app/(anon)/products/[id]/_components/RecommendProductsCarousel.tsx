"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductAllToMainQuery } from "@/lib/queries/products";
import ProductCard from "@/app/_components/ProductCard";

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

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-[20px] font-semibold">추천 상품</h2>
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
        className="flex overflow-hidden gap-4 scroll-smooth"
      >
        {!isLoading &&
          products &&
          products.map((product) => (
            <div
              key={product.id}
              className="w-[calc(100%/2-16px)]  md:w-[calc(100%/3-16px)] lg:w-[calc(100%/4-16px)] flex-shrink-0 py-2"
            >
              <ProductCard recommend={true} products={product} />
            </div>
          ))}
      </div>
    </div>
  );
}
