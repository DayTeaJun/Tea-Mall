"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProductListView from "../search/_components/ProductListView";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 💡 URL 주소창의 ?category=의류 값을 읽어옵니다.
  const category = searchParams.get("type") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") ?? "accurate";
  const pageSize = Number(searchParams.get("size") ?? 36);

  // 💡 주소 갱신 시 /category 경로를 유지하며 쿼리 스트링을 조합합니다.
  const updateQuery = (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      qs.set(key, String(value));
    });

    qs.set("page", "1");
    router.push(`/category?${qs.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 카테고리 타이틀 명시 */}
      <h1 className="text-2xl mb-4 text-center font-semibold text-gray-800">
        {category ? `${category} 카테고리` : "전체 카테고리"}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-2 mb-6 text-sm">
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

      {/* 💡 ProductListView 컴포넌트에 파싱한 값들을 그대로 주입 */}
      <ProductListView
        category={category}
        page={page}
        sort={sort}
        pageSize={pageSize}
      />
    </div>
  );
}
