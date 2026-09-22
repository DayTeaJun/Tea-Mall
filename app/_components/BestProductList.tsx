"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBestProductListQuery } from "@/lib/queries/products";
import ProductCard from "../../components/common/productCard/ProductCard";
import ProductCardSkeleton from "../../components/common/productCard/ProductCardSkeleton";

// 한 화면에 보이는 카드 개수 (트랙 폭 계산의 기준)
const VISIBLE = 4;
// 트랙 슬라이드 트랜지션 시간과 동일하게 맞춰야 함 (below transition-transform duration-300)
const TRANSITION_MS = 300;

export default function BestProductList() {
  const { data: products, isLoading } = useBestProductListQuery();
  // count 범위를 넘어가기도 하는 "가상" 인덱스. 끝(또는 처음)을 넘어가면
  // 복제해둔 카드 쪽으로 자연스럽게 계속 슬라이드된 뒤, 트랜지션이 끝나자마자
  // 애니메이션 없이 실제 인덱스로 조용히 되돌려서 무한 루프처럼 보이게 함
  const [index, setIndex] = useState(0);
  const [noTransition, setNoTransition] = useState(false);

  const items = products ?? [];
  const count = items.length;
  const canSlide = count > VISIBLE;

  // 양 끝에 카드를 복제해서 붙여둠 - 끝에서 다음으로/처음에서 이전으로 넘어갈 때도
  // 방향이 꺾이지 않고 같은 방향으로 계속 이어지도록 하기 위함
  const headClones = canSlide ? items.slice(count - VISIBLE) : [];
  const tailClones = canSlide ? items.slice(0, VISIBLE) : [];
  const trackItems = canSlide
    ? [...headClones, ...items, ...tailClones]
    : items;
  const headOffset = headClones.length;

  const goPrev = () => {
    setNoTransition(false);
    setIndex((i) => i - 1);
  };
  const goNext = () => {
    setNoTransition(false);
    setIndex((i) => i + 1);
  };

  // 복제본 구간까지 넘어갔다면, 트랜지션이 끝난 직후 애니메이션 없이 실제 구간의
  // 대응 위치로 되돌림 (복제본과 내용이 동일해서 사용자 눈엔 티가 안 남)
  useEffect(() => {
    if (!canSlide) return;
    if (index < 0 || index >= count) {
      const timer = setTimeout(() => {
        setNoTransition(true);
        setIndex((i) => ((i % count) + count) % count);
      }, TRANSITION_MS);
      return () => clearTimeout(timer);
    }
  }, [index, count, canSlide]);

  const isCorrecting = index < 0 || index >= count;

  const navButtonClass =
    "flex h-8 w-12 items-center justify-center rounded text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

  const slidePercent = ((headOffset + index) * 100) / VISIBLE;
  const displayIndex = (((index % count) + count) % count) + 1;

  return (
    // max-w-7xl로 좁혀진 부모 안에 있어도, 이 섹션만 뷰포트 끝까지 배경을 채우기 위한
    // full-bleed breakout: left-1/2 + -mx-[50vw]로 부모의 폭 제약을 무시하고
    // 화면 전체 너비를 차지하게 만듦. 안쪽 콘텐츠는 다시 max-w-7xl로 정렬을 맞춤.
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#2a2a2a] py-24 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            실시간 베스트
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            지금 가장 사랑받는 인기 상품
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: VISIBLE }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden -mx-3">
            <div
              className={`flex ${noTransition ? "" : "transition-transform duration-300 ease-out"}`}
              style={{ transform: `translateX(-${slidePercent}%)` }}
            >
              {trackItems.map((product, i) => (
                <div
                  key={`${product.id}-${i}`}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / VISIBLE}%` }}
                >
                  <ProductCard
                    products={product}
                    dark
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && canSlide && (
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              type="button"
              onClick={goPrev}
              disabled={isCorrecting}
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
              onClick={goNext}
              disabled={isCorrecting}
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
