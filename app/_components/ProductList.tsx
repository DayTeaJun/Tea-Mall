"use client";

import { useProductAllToMainQuery } from "@/lib/queries/products";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductList() {
  const { data: products, isLoading } = useProductAllToMainQuery();

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 9 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : products?.map((product) => (
            <ProductCard key={product.id} products={product} />
          ))}
    </section>
  );
}
