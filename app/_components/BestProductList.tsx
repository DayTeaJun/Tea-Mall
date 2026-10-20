"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useBestProductListQuery } from "@/lib/queries/products";
import ProductCard from "../../components/common/productCard/ProductCard";
import ProductCardSkeleton from "../../components/common/productCard/ProductCardSkeleton";

// 카드 1개가 트랙 폭에서 차지하는 비율(%). 데스크톱은 4등분(25%)이라 옆이 안 보이고,
// 모바일은 82%로 살짝 작게 둬서 양옆 카드가 조금씩 삐져나와 보이게 함
const DESKTOP_ITEM_WIDTH_PERCENT = 25;
const MOBILE_ITEM_WIDTH_PERCENT = 82;
const AUTO_ADVANCE_MS = 4000;

export default function BestProductList() {
  const { data: products, isLoading } = useBestProductListQuery();
  // 서버 렌더링 시점엔 화면 폭을 알 수 없어서 일단 모바일 기준으로 시작하고,
  // 마운트된 뒤 실제 화면 폭에 맞춰 조정함
  const [itemWidthPercent, setItemWidthPercent] = useState(
    MOBILE_ITEM_WIDTH_PERCENT,
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () =>
      setItemWidthPercent(
        mql.matches ? DESKTOP_ITEM_WIDTH_PERCENT : MOBILE_ITEM_WIDTH_PERCENT,
      );
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const items = products ?? [];
  const count = items.length;

  // 카드가 완전히(잘리지 않고) 몇 장 들어가는지 - 그 수보다 상품이 많을 때만 슬라이드 필요
  const itemsFittingFully = Math.floor(100 / itemWidthPercent);
  const canSlide = count > itemsFittingFully;
  // 모바일 peek 모드(카드 폭 < 100/화면에 꽉 채워지는 개수)에서는 현재 카드가
  // 가운데 오도록 align: center, 데스크톱(정확히 등분)은 align: start
  const isPeekMode = itemWidthPercent * itemsFittingFully !== 100;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canSlide,
    align: isPeekMode ? "center" : "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // 가만히 두면 일정 시간마다 자동으로 다음 상품으로 넘어감. 슬라이드가 바뀔
  // 때마다(자동이든 사용자가 직접 눌렀든) 타이머가 새로 시작되므로, 방금
  // 조작했는데 곧바로 또 넘어가는 어색함이 없음
  useEffect(() => {
    if (!emblaApi || !canSlide) return;
    const timer = setTimeout(() => emblaApi.scrollNext(), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [emblaApi, selectedIndex, canSlide]);

  const navButtonClass =
    "flex h-8 w-12 items-center justify-center rounded text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

  const displayIndex = selectedIndex + 1;

  return (
    // max-w-7xl로 좁혀진 부모 안에 있어도, 이 섹션만 뷰포트 끝까지 배경을 채우기 위한
    // full-bleed breakout: left-1/2 + -mx-[50vw]로 부모의 폭 제약을 무시하고
    // 화면 전체 너비를 차지하게 만듦. 안쪽 콘텐츠는 다시 max-w-7xl로 정렬을 맞춤.
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#2a2a2a] py-24 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            실시간 베스트
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            지금 T-Mall에서 가장 많이 팔리는 상품
          </p>
        </div>

        {isLoading ? (
          <div className="overflow-hidden -mx-3">
            <div className="flex justify-center">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shrink-0 px-3"
                  style={{ width: `${itemWidthPercent}%` }}
                >
                  <ProductCardSkeleton dark />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden -mx-3" ref={emblaRef}>
            <div className="flex">
              {items.map((product, i) => {
                // peek 모드(모바일)에서 지금 가운데인 카드 딱 하나만 원래 높이,
                // 양옆에 살짝 보이는 카드들은 세로만 살짝 축소해서 덜 도드라지게 함
                const isCenter = i === selectedIndex;
                const isSidePeek = isPeekMode && !isCenter;

                return (
                  <div
                    key={product.id}
                    className={`shrink-0 min-w-0 px-3 transition-transform duration-300 ${
                      isSidePeek ? "scale-y-90" : ""
                    }`}
                    style={{ width: `${itemWidthPercent}%` }}
                  >
                    <ProductCard
                      products={product}
                      dark
                      sizes="(max-width: 768px) 80vw, 25vw"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && canSlide && (
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className={`${navButtonClass} bg-white/10 text-white hover:bg-white/20`}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-4 text-16">
              <span className="font-bold text-white">{displayIndex}</span>
              <span className="text-white/30">|</span>
              <span className="text-white/40">{count}</span>
            </div>

            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className={`${navButtonClass} bg-white/10 text-white hover:bg-white/20`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
