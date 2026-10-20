"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRelatedProductsQuery } from "@/lib/queries/products";
import ProductCard from "@/components/common/productCard/ProductCard";

interface RecommendProductsCarouselProps {
  currentProductId: string;
  category: string | null;
}

export default function RecommendProductsCarousel({
  currentProductId,
  category,
}: RecommendProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data: products, isLoading } = useRelatedProductsQuery(
    currentProductId,
    category,
  );

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold">연관 추천 상품</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden px-1" ref={emblaRef}>
        <div className="flex gap-4">
          {!isLoading &&
            products &&
            products.map((product) => (
              <div
                key={product.id}
                className={`
                  flex-none min-w-0 py-2
                  basis-[calc((100%-0rem)/1)]
                  sm:basis-[calc((100%-1rem)/2)]
                  md:basis-[calc((100%-2rem)/3)]
                  lg:basis-[calc((100%-3rem)/4)]
                `}
              >
                <ProductCard
                  recommend
                  products={product}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
