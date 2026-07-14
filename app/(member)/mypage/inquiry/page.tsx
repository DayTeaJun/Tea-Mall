"use client";

import React, { useState } from "react";
import ProductInquiriesList from "./_components/ProductInquiriesList";
import CustomerInquiriesList from "./_components/CustomerInquiriesList";

export default function MyInquiriesPage() {
  const [activeTab, setActiveTab] = useState<"product" | "customer">("product");

  return (
    <section className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-base sm:text-xl font-bold pt-4 sm:pt-0">문의 관리</h2>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("product")}
          className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 border-b-2 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "product"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          상품 문의
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 border-b-2 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "customer"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          고객센터 문의
        </button>
      </div>

      <div>
        {activeTab === "product" ? (
          <ProductInquiriesList />
        ) : (
          <CustomerInquiriesList />
        )}
      </div>
    </section>
  );
}
