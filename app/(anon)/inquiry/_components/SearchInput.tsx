"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "all";
  const currentQuery = searchParams.get("query") ?? "";

  const [searchType, setSearchType] = useState(currentType);
  const [searchInput, setSearchInput] = useState(currentQuery);

  useEffect(() => {
    setSearchType(searchParams.get("type") ?? "all");
    setSearchInput(searchParams.get("query") ?? "");
  }, [searchParams]);

  const handleSearch = () => {
    router.push(
      `/inquiry?type=${searchType}&query=${searchInput.trim()}&page=1`,
    );
  };

  return (
    <div className="flex justify-between items-center gap-2 relative w-full">
      <div className="flex items-center gap-2 sm:w-auto w-[calc(100%-100px)]">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-200 px-3 py-2 text-sm rounded-sm bg-white text-[#111111] focus:outline-none focus:border-black focus:ring-0 transition-all cursor-pointer h-[38px]"
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="author">작성자</option>
        </select>

        <div className="relative flex items-center w-full max-w-[280px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={
              searchType === "title"
                ? "제목을 검색하세요."
                : searchType === "author"
                  ? "작성자를 검색하세요."
                  : "검색어를 입력하세요."
            }
            className="w-full px-3 py-2 pr-10 border border-gray-200 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-all h-[38px]"
          />

          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
            aria-label="검색"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/inquiry/create")}
        className="bg-[#111111] text-white rounded-sm px-4 py-2 text-sm font-medium hover:bg-[#222222] transition-colors shrink-0 h-[38px] shadow-sm"
      >
        문의하기
      </button>
    </div>
  );
}

export default SearchInput;
