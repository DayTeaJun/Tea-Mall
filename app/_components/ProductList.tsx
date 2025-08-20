"use client";

import { useProductAllToMainQuery } from "@/lib/queries/products";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductList() {
  const { data: products, isLoading } = useProductAllToMainQuery();

  return (
    <section className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {isLoading
        ? Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : products?.map((product) => (
            <ProductCard key={product.id} products={product} />
          ))}
    </section>
  );
}
