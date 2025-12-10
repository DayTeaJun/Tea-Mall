"use client";

import { useSearchParams } from "next/navigation";
import ProductListView from "./_components/ProductListView";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center">Search Result</h1>

      {keyword && (
        <p className="text-center text-gray-500 mb-8">
          <span className="font-semibold">{`"${keyword}"`}</span> 에 대한 검색
          결과입니다.
        </p>
      )}

      <ProductListView keyword={keyword} page={page} />
    </div>
  );
}
