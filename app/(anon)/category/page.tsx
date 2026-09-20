"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductListView from "../search/_components/ProductListView";
import SearchToolbar from "../search/_components/SearchToolbar";
import { SIZE_OPTIONS_MAP } from "@/lib/constants/categories";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("type") ?? "";
  const subCategory = searchParams.get("sub") ?? "";
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

  // 카테고리마다 사이즈 체계가 다름 (의류: XS~XXXL, 신발: 230~280, 가방/액세서리: 없음)
  const currentSizeOptions = SIZE_OPTIONS_MAP[category] ?? [];

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
    router.push(`/category?${qs.toString()}`);
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

  const sizeGroups =
    currentSizeOptions.length > 0
      ? [{ label: "사이즈", sizes: currentSizeOptions }]
      : [];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-[26px] mb-4 text-center font-semibold text-gray-800">
        {category ? (
          <span className="flex items-center justify-center gap-2">
            <span className={`${subCategory && "text-gray-500"}`}>
              {category} {`${subCategory ? "" : "카테고리"}`}
            </span>
            {subCategory && (
              <>
                <span className="text-gray-300 text-lg">|</span>
                <span>{subCategory}</span>
              </>
            )}
          </span>
        ) : (
          "전체 카테고리"
        )}
      </h1>

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
        category={category}
        subCategory={subCategory}
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
