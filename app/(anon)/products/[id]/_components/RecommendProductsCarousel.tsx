"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRelatedProductsQuery } from "@/lib/queries/products"; // 💡 새로 만든 훅 임포트
import ProductCard from "@/app/_components/ProductCard";

interface RecommendProductsCarouselProps {
  currentProductId: string;
  category: string | null;
}

export default function RecommendProductsCarousel({
  currentProductId,
  category,
}: RecommendProductsCarouselProps) {
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useRelatedProductsQuery(
    currentProductId,
    category,
  );

  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const delta = el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -delta : delta,
      behavior: "smooth",
    });
  };

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold">연관 추천 상품</h2>
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
        className={`
          flex gap-4
          overflow-hidden
          scroll-smooth
          snap-x snap-mandatory
          px-1
        `}
      >
        {!isLoading &&
          products &&
          products.map((product) => (
            <div
              key={product.id}
              data-card
              className={`
                flex-none snap-start py-2
                basis-[calc((100%-0rem)/1)]
                sm:basis-[calc((100%-1rem)/2)]
                md:basis-[calc((100%-2rem)/3)]
                lg:basis-[calc((100%-3rem)/4)]
              `}
            >
              <ProductCard recommend products={product} />
            </div>
          ))}
      </div>
    </div>
  );
}
