"use client";

import ProductCard from "@/app/_components/ProductCard";
import ProductCardSkeleton from "@/app/_components/ProductCardSkeleton";
import { useSearchProductsQuery } from "@/lib/queries/products";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const { data: products, isLoading } = useSearchProductsQuery(query);

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl mb-4 text-center">Search Result</h1>

      {isLoading ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </section>
      ) : products?.length ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} products={product} />
          ))}
        </section>
      ) : (
        <p className="text-gray-500 mt-8">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
