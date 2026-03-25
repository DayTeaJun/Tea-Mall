"use client";

import { Search, X } from "lucide-react";
import React, { useState } from "react";
import UserList from "./_components/UserList";

export default function UserPage() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">고객 관리</h2>

      <div className="flex items-center gap-2 relative w-full">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            // if (e.key === "Enter") handleSearch();
          }}
          placeholder="고객 이름 또는 이메일 검색 가능"
          className="w-full px-3 py-2 pr-10 border rounded-md text-sm"
        />

        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
            }}
            className="absolute right-[52px] top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}

        <button
          // onClick={handleSearch}
          className="p-2 text-black border rounded-md cursor-pointer"
        >
          <Search size={20} />
        </button>
      </div>

      <UserList />
    </div>
  );
}
