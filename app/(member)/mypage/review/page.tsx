"use client";

import React, { useState } from "react";
import MyReviewsList from "./_components/MyReviewsList";
import AvailableReviewsList from "./_components/AvailableReviewsList";

export default function MyReviewsPage() {
  const [activeTab, setActiveTab] = useState<"written" | "available">(
    "written",
  );

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-bold text-gray-900">리뷰 관리</h1>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("written")}
          className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors ${
            activeTab === "written"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          작성한 리뷰
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors ${
            activeTab === "available"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          작성 가능한 리뷰
        </button>
      </div>

      <div>
        {activeTab === "written" ? <MyReviewsList /> : <AvailableReviewsList />}
      </div>
    </section>
  );
}
