"use client";

import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserList from "./_components/UserList";
import useDebounce from "@/hooks/useDebounce"; // 방금 만든 훅 임포트
import { useAllUsersQuery } from "@/lib/queries/admin";

export default function UserPage() {
  const [searchInput, setSearchInput] = useState("");
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchQuery]);

  const { data, isLoading } = useAllUsersQuery(
    debouncedSearchQuery,
    page,
    PAGE_SIZE,
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">고객 관리</h2>

      <div className="flex items-center gap-2 relative w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="고객 이름 또는 이메일 검색"
            className="w-full px-4 py-2 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="p-2 bg-black text-white rounded-lg shadow-md">
          <Search size={20} />
        </div>
      </div>

      <UserList
        users={data?.users || []}
        totalCount={data?.totalCount || 0}
        currentPage={page}
        setPage={setPage}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
      />
    </div>
  );
}
