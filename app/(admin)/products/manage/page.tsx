"use client";

import { useState } from "react";
import { useMyProductsQuery } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();

  const { data: products = [], isLoading } = useMyProductsQuery(
    user?.id || "",
    searchQuery,
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">등록한 상품 관리</h1>

      <div className="mb-6 flex gap-2 items-center">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={() => {}}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

      {/* 테이블 */}
      <table className="w-full border-collapse border text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">No</th>
            <th className="border p-2">이미지</th>
            <th className="border p-2">상품명</th>
            <th className="border p-2">판매가</th>
            <th className="border p-2">등록일</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="p-4">
                로딩 중...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-gray-500">
                등록된 상품이 없습니다.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  ) : (
                    "이미지 없음"
                  )}
                </td>
                <td className="border p-2 text-left">{product.name}</td>
                <td className="border p-2">
                  {product.price.toLocaleString()}원
                </td>
                <td className="border p-2">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

                <td className="border p-2 space-x-2">
                  <button className="text-blue-600">수정</button>
                  <button className="text-red-600">삭제</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
