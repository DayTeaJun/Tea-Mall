"use client";

import { useSearchParams } from "next/navigation";
import ProductListView from "../../search/_components/ProductListView";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const category = decodeURIComponent(params.slug);
  const page = Number(searchParams.get("page") ?? 1);

  return (
    <div className="mt-8 py-8 max-w-7xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center">{category}</h1>

      <ProductListView category={category} page={page} />
    </div>
  );
}
