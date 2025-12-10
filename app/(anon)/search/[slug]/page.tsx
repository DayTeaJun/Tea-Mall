"use client";

import { useSearchParams, useParams } from "next/navigation";
import ProductListView from "../_components/ProductListView";

export default function SearchBySlugPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ slug: string }>();

  const category = decodeURIComponent(params.slug);

  const page = Number(searchParams.get("page") ?? 1);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center">{category} 카테고리</h1>

      <ProductListView category={category} page={safePage} />
    </div>
  );
}
