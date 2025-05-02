"use client";

import { useProductAllToMainQuery } from "@/lib/queries/products";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { data: products, isLoading } = useProductAllToMainQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((products) => (
        <ProductCard key={products.id} products={products} />
      ))}
    </section>
  );
}
