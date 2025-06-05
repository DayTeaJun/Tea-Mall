"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import ProductDelBtn from "./_components/ProductDelBtn";
import { useMyProductsQuery } from "@/lib/queries/admin";
import { ShoppingBag } from "lucide-react";

export default function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceQuery = useDebounce<string>(searchQuery);
  const router = useRouter();

  const { user } = useAuthStore();

  const { data: products = [], isLoading } = useMyProductsQuery(
    user?.id || "",
    debounceQuery,
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">등록한 상품 관리</h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={() => router.push("/products/regist")}
          className="text-black flex gap-1 items-center cursor-pointer border p-2 px-4 hover:bg-gray-100 duration-200 transition-all rounded"
        >
          <p className="text-[14px]">상품등록</p>
          <ShoppingBag size={16} />
        </button>
      </div>

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
            products &&
            products.map((product, index) => (
              <tr key={product.id}>
                <td className="border p-2">{products.length - index}</td>
                <td
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="border p-2 w-[20%] h-[120px] cursor-pointer overflow-hidden"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover w-full h-full hover:scale-105 duration-200 transition-all"
                    />
                  ) : (
                    "이미지 없음"
                  )}
                </td>
                <td
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="border p-2 text-left cursor-pointer hover:underline"
                >
                  {product.name}
                </td>
                <td className="border p-2">
                  {product.price.toLocaleString()}원
                </td>
                <td className="border p-2">
                  {product.created_at &&
                    new Date(product.created_at).toLocaleDateString()}
                </td>

                <td className="border p-2">
                  <div className="  flex flex-col gap-2">
                    <button
                      onClick={() =>
                        router.push(`/products/${product.id}/edit`)
                      }
                      className="border p-2 cursor-pointer hover:bg-gray-100 duration-200 transition-all"
                    >
                      수정
                    </button>
                    <ProductDelBtn
                      productId={product.id}
                      imageUrl={product.image_url || ""}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
