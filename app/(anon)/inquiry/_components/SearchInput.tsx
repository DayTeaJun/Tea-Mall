"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function SearchInput() {
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
    <div className="flex items-center gap-2 w-full sm:max-w-md">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="border border-gray-200 px-3 py-2 text-sm rounded-sm bg-white text-[#111111] focus:outline-none focus:border-black h-[38px] shrink-0 min-w-[85px]"
      >
        <option value="all">전체</option>
        <option value="title">제목</option>
        <option value="author">작성자</option>
      </select>

      <div className="relative flex items-center flex-1">
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
          className="w-full px-3 py-2 pr-10 border border-gray-200 text-sm rounded-sm placeholder-gray-300 focus:outline-none focus:border-black h-[38px] text-black"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
