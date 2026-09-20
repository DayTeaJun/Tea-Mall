"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductListView from "../search/_components/ProductListView";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

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

  const hasActiveFilters = minPriceParam || maxPriceParam || productSize;

  const clearFilters = () => {
    setMinInput("");
    setMaxInput("");
    updateQuery({ minPrice: "", maxPrice: "", productSize: "" });
  };

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

      <div className="flex flex-col gap-3 border-b p-2 mb-6 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-gray-600">
            <button
              className={
                sort === "accurate"
                  ? "font-semibold text-black"
                  : "hover:text-black"
              }
              onClick={() => updateQuery({ sort: "accurate" })}
            >
              정확순
            </button>
            <span className="text-gray-300">|</span>

            <button
              className={
                sort === "price_asc"
                  ? "font-semibold text-black"
                  : "hover:text-black"
              }
              onClick={() => updateQuery({ sort: "price_asc" })}
            >
              낮은가격순
            </button>
            <span className="text-gray-300">|</span>

            <button
              className={
                sort === "price_desc"
                  ? "font-semibold text-black"
                  : "hover:text-black"
              }
              onClick={() => updateQuery({ sort: "price_desc" })}
            >
              높은가격순
            </button>
            <span className="text-gray-300">|</span>

            <button
              className={
                sort === "sales"
                  ? "font-semibold text-black"
                  : "hover:text-black"
              }
              onClick={() => updateQuery({ sort: "sales" })}
            >
              판매량순
            </button>
            <span className="text-gray-300">|</span>

            <button
              className={
                sort === "latest"
                  ? "font-semibold text-black"
                  : "hover:text-black"
              }
              onClick={() => updateQuery({ sort: "latest" })}
            >
              최신순
            </button>
          </div>

          {/* 모바일 화면용 필터 */}
          <select
            value={sort}
            onChange={(e) => updateQuery({ sort: e.target.value })}
            className="border rounded px-2 py-1 text-sm sm:hidden block"
          >
            <option value={"accurate"}>정확순</option>
            <option value={"price_asc"}>낮은가격순</option>
            <option value={"price_desc"}>높은가격순</option>
            <option value={"sales"}>판매량순</option>
            <option value={"latest"}>최신순</option>
          </select>

          {/* 보기 개수 선택 필터 */}
          <select
            value={pageSize}
            onChange={(e) => updateQuery({ size: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={36}>36개씩 보기</option>
            <option value={24}>24개씩 보기</option>
            <option value={12}>12개씩 보기</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              inputMode="numeric"
              placeholder="최소가격"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
              className="border rounded px-2 py-1 text-sm w-24"
            />
            <span className="text-gray-400">~</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="최대가격"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
              className="border rounded px-2 py-1 text-sm w-24"
            />
            <button
              onClick={applyPriceFilter}
              className="border rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              적용
            </button>
          </div>

          <select
            value={productSize}
            onChange={(e) => updateQuery({ productSize: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">사이즈 전체</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 underline hover:text-black"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

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
