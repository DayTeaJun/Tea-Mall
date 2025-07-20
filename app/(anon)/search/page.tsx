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
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl mb-4 text-center">Search Result</h1>
      <p className="text-center text-gray-500 mb-8">
        <span className="text-black font-semibold">
          &quot;
          {query}
          &quot;
        </span>{" "}
        에 대한 검색 결과입니다.
      </p>

      {isLoading ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </section>
      ) : products?.length ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
