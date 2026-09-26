"use client";

import { ChevronUp } from "lucide-react";
import React from "react";

function TopBtn({ compact = false }: { compact?: boolean }) {
  return (
    <button
      onClick={() => window.scrollTo(0, 0)}
      type="button"
      className={`bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center ${
        compact ? "p-1.5" : "p-3 shadow-md"
      }`}
    >
      <ChevronUp size={compact ? 16 : 22} strokeWidth="2.5px" />
    </button>
  );
}

export default TopBtn;
