"use client";

import { useBestProductListQuery } from "@/lib/queries/products";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/common/ProductCard/ProductCardSkeleton";

export default function BestProductList() {
  const { data: products, isLoading } = useBestProductListQuery();

  const bestProducts = products?.slice(0, 4) || [];

  return (
    <section className="w-full mb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">실시간 베스트</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            지금 가장 사랑받는 인기 상품
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))
          : bestProducts.map((product) => (
              <div key={product.id}>
                <ProductCard products={product} />
              </div>
            ))}
      </div>
    </section>
  );
}
