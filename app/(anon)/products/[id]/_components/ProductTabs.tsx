"use client";

import { useState } from "react";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<"detail" | "comments" | "qa">(
    "detail",
  );

  const handleTabClick = (
    tab: "detail" | "comments" | "qa",
    targetId: string,
  ) => {
    setActiveTab(tab);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ block: "start" });
    }
  };

  const tabClass = (tab: "detail" | "comments" | "qa") => `
    w-1/3 border box-border p-3 text-center text-16 font-medium transition-colors
    ${
      activeTab === tab
        ? "border-b-transparent font-bold"
        : "border-gray-200 text-gray-500 hover:text-gray-800 bg-gray-50"
    }
  `;

  return (
    <div className="w-full flex justify-between sticky top-[96px] bg-white z-30 border-t border-gray-300 mt-10">
      <button
        type="button"
        className={tabClass("detail")}
        onClick={() => handleTabClick("detail", "product-detail-section")}
      >
        상품상세
      </button>
      <button
        type="button"
        className={tabClass("comments")}
        onClick={() => handleTabClick("comments", "product-comments-section")}
      >
        상품 리뷰
      </button>
      <button
        type="button"
        className={tabClass("qa")}
        onClick={() => handleTabClick("qa", "product-qa-section")}
      >
        상품문의
      </button>
    </div>
  );
}
