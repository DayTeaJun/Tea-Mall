"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function CouponPage() {
  const [activeTab, setActiveTab] = useState<"written" | "available">(
    "written",
  );

  return (
    <section className="max-w-7xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-xl font-bold pt-4 sm:pt-0">쿠폰함</h2>

        <button
          className="flex items-center gap-1.5 border-2 p-1.5 px-2 border-green-400 text-14 hover:bg-green-100 transition-colors rounded"
          type="button"
        >
          <Plus size={18} />
          쿠폰등록
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("written")}
          className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 border-b-4 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "written"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          사용 가능 쿠폰
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 border-b-4 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "available"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          사용한 쿠폰
        </button>
      </div>

      <div>
        {/* {activeTab === "written" ? <MyReviewsList /> : <AvailableReviewsList />} */}
      </div>
    </section>
  );
}
