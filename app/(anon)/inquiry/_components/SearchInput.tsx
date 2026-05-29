"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

function SearchInput() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") ?? "";
  const [searchInput, setSearchInput] = useState(keyword);

  const handleSearch = () => {
    router.push(`/inquiry?query=${searchInput}&page=1`);
  };

  return (
    <div className="flex justify-between items-center gap-2 relative w-full">
      <div className="flex items-center gap-2">
        <select className="border px-3 py-2 rounded">
          <option value="content">전체</option>
          <option value="title">제목</option>
          <option value="author">작성자</option>
        </select>

        <div className="relative flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="제목을 검색하세요."
            className="w-full px-3 py-2 pr-10 border text-sm"
          />

          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            aria-label="검색"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <button className="bg-black text-white rounded px-4 py-2 text-sm">
        문의하기
      </button>
    </div>
  );
}

export default SearchInput;
