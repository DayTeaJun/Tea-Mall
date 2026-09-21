"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface SizeGroup {
  label: string;
  sizes: string[];
}

interface Props {
  sort: string;
  pageSize: number;
  onSortChange: (sort: string) => void;
  onPageSizeChange: (size: number) => void;
  minInput: string;
  maxInput: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  onApplyPrice: () => void;
  sizeGroups: SizeGroup[];
  selectedSize: string;
  onToggleSize: (size: string) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

// 검색/카테고리 페이지가 공유하는 정렬 + 가격·사이즈 필터 툴바
export default function SearchToolbar({
  sort,
  pageSize,
  onSortChange,
  onPageSizeChange,
  minInput,
  maxInput,
  onMinChange,
  onMaxChange,
  onApplyPrice,
  sizeGroups,
  selectedSize,
  onToggleSize,
  hasActiveFilters,
  onClear,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showFilters) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b pb-2 mb-6 text-sm">
      <div className="hidden sm:flex items-center gap-2 text-gray-600">
        <button
          className={
            sort === "accurate"
              ? "font-semibold text-black"
              : "hover:text-black"
          }
          onClick={() => onSortChange("accurate")}
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
          onClick={() => onSortChange("price_asc")}
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
          onClick={() => onSortChange("price_desc")}
        >
          높은가격순
        </button>
        <span className="text-gray-300">|</span>

        <button
          className={
            sort === "sales" ? "font-semibold text-black" : "hover:text-black"
          }
          onClick={() => onSortChange("sales")}
        >
          판매량순
        </button>
        <span className="text-gray-300">|</span>

        <button
          className={
            sort === "latest" ? "font-semibold text-black" : "hover:text-black"
          }
          onClick={() => onSortChange("latest")}
        >
          최신순
        </button>
      </div>

      {/* 모바일: 정렬 select + (보기개수/필터)를 한 줄에. sm 이상에서는
          sm:contents로 이 래퍼가 사라지고 자식들이 위 정렬 버튼과
          나란히 justify-between(더 위의 부모)으로 배치됨 (기존 데스크톱 레이아웃 유지) */}
      <div className="flex items-center justify-between gap-2 sm:contents">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm sm:hidden block flex-1 min-w-0"
        >
          <option value={"accurate"}>정확순</option>
          <option value={"price_asc"}>낮은가격순</option>
          <option value={"price_desc"}>높은가격순</option>
          <option value={"sales"}>판매량순</option>
          <option value={"latest"}>최신순</option>
        </select>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={36}>36개씩 보기</option>
            <option value={24}>24개씩 보기</option>
            <option value={12}>12개씩 보기</option>
          </select>

          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal size={14} />
              필터
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-4 w-[calc(100vw-2.5rem)] sm:w-64 z-20">
                <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 divide-y divide-gray-100">
                  <div className="pb-4">
                    <p className="text-12 font-bold text-gray-600 mb-2">가격</p>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="최소"
                        value={minInput}
                        onChange={(e) =>
                          onMinChange(e.target.value.replace(/\D/g, ""))
                        }
                        onKeyDown={(e) => e.key === "Enter" && onApplyPrice()}
                        className="border rounded px-2 py-1 text-sm w-full min-w-0"
                      />
                      <span className="text-gray-400 shrink-0">~</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="최대"
                        value={maxInput}
                        onChange={(e) =>
                          onMaxChange(e.target.value.replace(/\D/g, ""))
                        }
                        onKeyDown={(e) => e.key === "Enter" && onApplyPrice()}
                        className="border rounded px-2 py-1 text-sm w-full min-w-0"
                      />
                    </div>
                    <button
                      onClick={onApplyPrice}
                      className="mt-2 w-full border rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      적용
                    </button>
                  </div>

                  {sizeGroups.map((group) => (
                    <div key={group.label} className="py-4">
                      <p className="text-12 font-bold text-gray-600 mb-1.5">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                        {group.sizes.map((s) => {
                          const isSelected = selectedSize === s;
                          return (
                            <button
                              key={s}
                              onClick={() => onToggleSize(s)}
                              className={`text-sm ${
                                isSelected
                                  ? "font-medium text-gray-900 underline decoration-green-400 decoration-[3px] underline-offset-2"
                                  : "text-gray-700 hover:text-black"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {hasActiveFilters && (
                    <button
                      onClick={onClear}
                      className="pt-4 text-xs text-gray-500 underline hover:text-black w-full text-end"
                    >
                      필터 초기화
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
