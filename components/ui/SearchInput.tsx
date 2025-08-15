"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      toast.info("검색어를 입력해주세요.");
      return;
    }
    router.push(`/search?query=${encodeURIComponent(searchQuery)}&page=1`);
  };

  return (
    <div
      className={`flex items-center relative ${
        isOpen ? "border rounded-2xl" : ""
      } p-1 gap-2`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="p-1 rounded-full hover:bg-gray-200 transition cursor-pointer shrink-0"
        aria-label="검색 열기"
      >
        <Search className="w-5 h-5 text-gray-700" />
      </button>

      <div className="relative">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          type="text"
          placeholder="Search..."
          className={`
        bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none
        transition-[width,opacity] duration-300 ease-in-out
        ${isOpen ? "opacity-100 w-40 md:w-64" : "opacity-0 w-0"}
        pr-7
      `}
          autoFocus={isOpen}
        />

        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setIsOpen(false);
          }}
          className={`
        absolute right-1 top-1/2 -translate-y-1/2
        text-gray-400 hover:text-gray-600
        transition-opacity
        ${
          searchQuery && isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
          aria-label="검색어 지우기"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default SearchInput;
