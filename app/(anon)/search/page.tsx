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

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-t p-2 mb-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <button className="font-semibold text-black">정확순</button>
          <span className="text-gray-300">|</span>

          <button className="hover:text-black">낮은가격순</button>
          <span className="text-gray-300">|</span>

          <button className="hover:text-black">높은가격순</button>
          <span className="text-gray-300">|</span>

          <button className="hover:text-black">판매량순</button>
          <span className="text-gray-300">|</span>

          <button className="hover:text-black">최신순</button>
        </div>

        <select className="border rounded px-2 py-1 text-sm">
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

      <ProductListView keyword={keyword} page={page} />
    </div>
  );
}
