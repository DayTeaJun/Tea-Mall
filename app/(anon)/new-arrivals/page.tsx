"use client";

import { useProductAllToMainQuery } from "@/lib/queries/products";
import ProductCard from "@/components/common/productCard/ProductCard";
import ProductCardSkeleton from "@/components/common/productCard/ProductCardSkeleton";
import FeaturedProductCard from "@/components/common/productCard/FeaturedProductCard";

const TOTAL_COUNT = 13;
const FEATURED_COUNT = 3;

export default function NewArrivalsPage() {
  const { data: products, isLoading } = useProductAllToMainQuery(
    1,
    TOTAL_COUNT,
  );

  const featured = products?.slice(0, FEATURED_COUNT) ?? [];
  const rest = products?.slice(FEATURED_COUNT) ?? [];

  return (
    <main className="max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#2a2a2a] py-8 sm:py-26">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              새로 만나는 신상품
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mt-2">
              가장 최근에 등록된 상품들을 가장 먼저 만나보세요
            </p>
          </div>

          {!isLoading && products?.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              등록된 상품이 없습니다.
            </div>
          ) : (
            <section className="grid grid-cols-3 gap-3 sm:gap-6">
              {isLoading
                ? Array.from({ length: FEATURED_COUNT }).map((_, idx) => (
                    <div
                      key={`featured-skeleton-${idx}`}
                      className="aspect-[4/5] rounded-sm bg-gray-700 animate-pulse"
                    />
                  ))
                : featured.map((product) => (
                    <FeaturedProductCard
                      key={product.id}
                      product={product}
                      eyebrow={[product.category, product.subcategory]
                        .filter(Boolean)
                        .join(" · ")}
                    />
                  ))}
            </section>
          )}
        </div>
      </div>

      <div className="mt-20">
        <p className="text-xl font-semibold text-gray-700 mb-6">
          더 많은 신상품
        </p>
        {isLoading ? (
          <section className="grid grid-cols-2 gap-6 gap-y-20 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: TOTAL_COUNT - FEATURED_COUNT }).map(
              (_, idx) => (
                <ProductCardSkeleton key={`skeleton-${idx}`} />
              ),
            )}
          </section>
        ) : (
          rest &&
          rest.length > 0 && (
            <section className="grid grid-cols-2 gap-6 gap-y-20 md:grid-cols-4 lg:grid-cols-5">
              {rest.map((product) => (
                <ProductCard key={product.id} products={product} />
              ))}
            </section>
          )
        )}
      </div>
    </main>
  );
}
