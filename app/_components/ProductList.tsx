"use client";

import { useEffect, useState } from "react";
import { useProductAllToMainQuery } from "@/lib/queries/products";
import ProductCard from "../../components/common/productCard/ProductCard";
import ProductCardSkeleton from "../../components/common/productCard/ProductCardSkeleton";
import { ProductType } from "@/types/product";

const PAGE_SIZE = 10;

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ProductType[]>([]);

  const { data: products, totalCount, isLoading } = useProductAllToMainQuery(
    page,
    PAGE_SIZE,
  );

  // 페이지가 바뀌어 새 데이터가 도착하면 기존 목록 뒤에 이어붙임 (1페이지는 새로 시작)
  useEffect(() => {
    if (!products) return;
    setItems((prev) => (page === 1 ? products : [...prev, ...products]));
  }, [products, page]);

  const hasMore = items.length < totalCount;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} products={product} />
        ))}
        {isLoading &&
          Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <ProductCardSkeleton key={`skeleton-${idx}`} />
          ))}
      </section>

      {!isLoading && hasMore && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="mx-auto px-6 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          더보기
        </button>
      )}
    </div>
  );
}
