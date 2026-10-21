"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserList from "./_components/UserList";
import useDebounce from "@/hooks/useDebounce"; // 방금 만든 훅 임포트
import { useAllUsersQuery } from "@/lib/queries/admin";

const LEVEL_OPTIONS = [
  { label: "전체", value: "" },
  { label: "일반 고객", value: 1 },
  { label: "판매자", value: 2 },
  { label: "관리자", value: 3 },
] as const;

export default function UserPage() {
  const [searchInput, setSearchInput] = useState("");
  const [level, setLevel] = useState("");
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchQuery, level]);

  const { data, isLoading } = useAllUsersQuery(
    debouncedSearchQuery,
    level === "" ? undefined : Number(level),
    page,
    PAGE_SIZE,
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">고객 관리</h2>

      <div className="flex items-center relative w-full gap-5">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-fit border rounded px-3 py-2 text-sm"
        >
          {LEVEL_OPTIONS.map((levelOpt) => (
            <option key={levelOpt.label} value={levelOpt.value}>
              {levelOpt.label}
            </option>
          ))}
        </select>

        <div className="relative flex-1 sm:flex-none sm:w-[60%] ">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="고객 이름 또는 이메일 검색"
            className="w-full px-3 py-2 pr-10 border rounded text-sm"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
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
