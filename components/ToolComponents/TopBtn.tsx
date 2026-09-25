"use client";

import { ChevronUp } from "lucide-react";
import React from "react";

function TopBtn() {
  return (
    <button
      onClick={() => window.scrollTo(0, 0)}
      type="button"
      className="p-1.5 bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
    >
      <ChevronUp size={16} strokeWidth="2.5px" />
    </button>
  );
}

export default TopBtn;
