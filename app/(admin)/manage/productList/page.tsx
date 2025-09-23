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

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full sm:w-64"
        />

        <button
          onClick={() => router.push("/manage/regist")}
          className="text-black flex gap-1 items-center cursor-pointer border p-2 px-4 hover:bg-gray-100 duration-200 transition-all rounded self-stretch sm:self-auto justify-center"
        >
          <p className="text-[14px]">상품등록</p>
          <ShoppingBag size={16} />
        </button>
      </div>

      <div className="hidden sm:block">
        <div className="overflow-x-auto rounded border">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border p-2 w-[60px]">No</th>
                <th className="border p-2 w-[140px]">이미지</th>
                <th className="border p-2">
                  닉네임 / 상품번호 / 상품명 / 상품태그
                </th>
                <th className="border p-2 w-[120px]">판매가</th>
                <th className="border p-2 w-[200px]">처리 날짜</th>
                <th className="border p-2 w-[120px]">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4">
                    로딩 중...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-gray-500">
                    등록된 상품이 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border p-2">{products.length - index}</td>
                    <td
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="border p-2 cursor-pointer align-middle"
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
                            <ImageOff size={28} className="text-gray-400" />
                            <p className="text-gray-500 text-xs">
                              이미지가 없습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="border p-2 text-left cursor-pointer"
                    >
                      <span className="text-gray-500 text-xs block">
                        {user?.email?.split("@")[0]} | {product.id}
                      </span>
                      <span className="block my-2 border p-1">
                        {product.name}
                      </span>
                      <span className="block border p-1 text-xs text-gray-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="border p-2">
                      {new Intl.NumberFormat("ko-KR").format(product.price)}원
                    </td>
                    <td className="border p-2 text-left leading-6">
                      <span className="block">
                        <span className="text-gray-500 mr-1">등록일</span>
                        {product.created_at &&
                          new Date(product.created_at).toLocaleDateString()}
                      </span>
                      <span className="block">
                        <span className="text-gray-500 mr-1">갱신일</span>
                        {product.updated_at &&
                          new Date(product.updated_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="border p-2">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            router.push(`/manage/edit/${product.id}`)
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
      </div>

      <div className="sm:hidden">
        {isLoading ? (
          <div className="p-4 text-center">로딩 중...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-500 border rounded">
            등록된 상품이 없습니다.
          </div>
        ) : (
          <ul className="space-y-3">
            {products.map((product, index) => (
              <li
                key={product.id}
                className="border rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="flex gap-3">
                  <div
                    className="w-24 min-w-24 aspect-square overflow-hidden rounded-md border cursor-pointer"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                        <ImageOff size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        No. {products.length - index}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Intl.NumberFormat("ko-KR").format(product.price)}원
                      </span>
                    </div>

                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="text-left mt-1 w-full flex-col flex gap-2"
                    >
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email?.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        ID: {product.id}
                      </p>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-600 px-2 p-1 border rounded w-fit">
                        {product.category}
                      </p>
                    </button>

                    <div className="mt-2 flex flex-col text-[11px] text-gray-500">
                      <span>
                        등록{" "}
                        {product.created_at &&
                          new Date(product.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        갱신{" "}
                        {product.updated_at &&
                          new Date(product.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          router.push(`/manage/edit/${product.id}`)
                        }
                        className="border rounded p-2 text-sm hover:bg-gray-100 active:scale-[0.99] transition"
                      >
                        수정
                      </button>
                      <ProductDelBtn
                        productId={product.id}
                        imageUrl={product.image_url || ""}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
