"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProductListView from "./_components/ProductListView";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") ?? "accurate";
  const pageSize = Number(searchParams.get("size") ?? 36);

  const updateQuery = (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      qs.set(key, String(value));
    });

    qs.set("page", "1");
    router.push(`/search?${qs.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center">Search Result</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-t p-2 mb-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
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
              sort === "sales" ? "font-semibold text-black" : "hover:text-black"
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

      {keyword && (
        <p className="text-center text-gray-500 mb-8">
          <span className="font-semibold">{`"${keyword}"`}</span> 에 대한 검색
          결과입니다.
        </p>
      )}

      <ProductListView
        keyword={keyword}
        page={page}
        sort={sort}
        pageSize={pageSize}
      />
    </div>
  );
}
