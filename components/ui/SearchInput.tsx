"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
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
      className={`flex items-center space-x-2 relative ${
        isOpen && "border rounded-2xl"
      } p-1`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="p-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
        aria-label="검색 열기"
      >
        <Search className="w-5 h-5 text-gray-700" />
      </button>

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        type="text"
        placeholder="Search..."
        className={`
          bg-transparent text-gray-700 placeholder-gray-400
          focus:outline-none
          transition-all duration-300 ease-in-out
          ml-2
          ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}
        `}
        style={{
          minWidth: isOpen ? "150px" : "0px",
        }}
        autoFocus={isOpen}
      />
    </div>
  );
}

export default SearchInput;
