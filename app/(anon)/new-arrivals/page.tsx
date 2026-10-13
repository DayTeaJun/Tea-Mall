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
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          새로 만나는 신상품
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          가장 최근에 등록된 상품들을 가장 먼저 만나보세요
        </p>
      </div>

      {!isLoading && products?.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          등록된 상품이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#2a2a2a] py-8 sm:py-24">
            <section className="max-w-7xl mx-auto grid grid-cols-3 gap-3 px-4 sm:gap-6">
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
          </div>

          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-20">
            {isLoading
              ? Array.from({ length: TOTAL_COUNT - FEATURED_COUNT }).map(
                  (_, idx) => <ProductCardSkeleton key={`skeleton-${idx}`} />,
                )
              : rest.map((product) => (
                  <ProductCard key={product.id} products={product} />
                ))}
          </section>
        </div>
      )}
    </main>
  );
}
