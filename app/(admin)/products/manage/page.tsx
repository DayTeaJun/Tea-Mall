"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import ProductDelBtn from "./_components/ProductDelBtn";
import { useMyProductsQuery } from "@/lib/queries/admin";
import { ImageOff, ShoppingBag } from "lucide-react";
import Image from "next/image";

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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">등록한 상품 관리</h1>

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
            <th className="border p-2">
              닉네임 / 상품번호 / 상품명 / 상품태그
            </th>
            <th className="border p-2">판매가</th>
            <th className="border p-2">처리 날짜</th>
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
                  className="border p-2 w-[15%] cursor-pointer overflow-hidden"
                >
                  <div className="w-full aspect-square">
                    {product.image_url ? (
                      <Image
                        width={200}
                        height={200}
                        src={product.image_url}
                        alt={product.name}
                        priority
                        className="object-cover w-full h-full hover:scale-105 duration-200 transition-all"
                      />
                    ) : (
                      <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-gray-100">
                        <ImageOff size={40} className="text-gray-400" />
                        <p className="text-gray-500 text-sm text-center">
                          이미지가 없습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </td>
                <td
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="w-[40%] border p-2 text-left cursor-pointer"
                >
                  <span className="text-gray-500 text-sm">
                    {user?.email?.split("@")[0]} | {product.id}
                  </span>
                  <span className="block my-2 border p-1">{product.name}</span>
                  <span className="block border p-1">{product.category}</span>
                </td>
                <td className="border p-2">
                  {product.price.toLocaleString()}원
                </td>
                <td className="border p-2">
                  <span className="block mb-1">
                    <span className="text-gray-500 mr-1">등록일 </span>
                    {product.created_at &&
                      new Date(product.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    <span className="text-gray-500 mr-1">갱신일 </span>
                    {product.updated_at &&
                      new Date(product.updated_at).toLocaleDateString()}
                  </span>
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
