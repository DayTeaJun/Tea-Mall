"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductListView from "./_components/ProductListView";
import SearchToolbar from "./_components/SearchToolbar";
import { SIZE_FILTER_GROUPS } from "@/lib/constants/categories";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") ?? "accurate";
  const pageSize = Number(searchParams.get("size") ?? 36);
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";
  const productSize = searchParams.get("productSize") ?? "";

  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const [minInput, setMinInput] = useState(minPriceParam);
  const [maxInput, setMaxInput] = useState(maxPriceParam);

  const updateQuery = (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === undefined) {
        qs.delete(key);
      } else {
        qs.set(key, String(value));
      }
    });

    qs.set("page", "1");
    router.push(`/search?${qs.toString()}`);
  };

  const applyPriceFilter = () => {
    updateQuery({ minPrice: minInput, maxPrice: maxInput });
  };

  const toggleSize = (s: string) => {
    updateQuery({ productSize: productSize === s ? "" : s });
  };

  const hasActiveFilters = !!(minPriceParam || maxPriceParam || productSize);

  const clearFilters = () => {
    setMinInput("");
    setMaxInput("");
    updateQuery({ minPrice: "", maxPrice: "", productSize: "" });
  };

  const sizeGroups = SIZE_FILTER_GROUPS.map(([categoryName, sizes]) => ({
    label: `사이즈 (${categoryName})`,
    sizes,
  }));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center ">검색 결과</h1>

      {keyword && (
        <p className="text-center text-gray-500 mb-8">
          <span className="font-semibold">{`"${keyword}"`}</span> 에 대한 검색
          결과입니다.
        </p>
      )}

      <SearchToolbar
        sort={sort}
        pageSize={pageSize}
        onSortChange={(v) => updateQuery({ sort: v })}
        onPageSizeChange={(v) => updateQuery({ size: v })}
        minInput={minInput}
        maxInput={maxInput}
        onMinChange={setMinInput}
        onMaxChange={setMaxInput}
        onApplyPrice={applyPriceFilter}
        sizeGroups={sizeGroups}
        selectedSize={productSize}
        onToggleSize={toggleSize}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <ProductListView
        keyword={keyword}
        page={page}
        sort={sort}
        pageSize={pageSize}
        minPrice={minPrice}
        maxPrice={maxPrice}
        productSize={productSize}
      />
    </div>
  );
}
