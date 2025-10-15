"use client";

import { useFavoritesAll } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderCircle, PackageX, ShoppingCart } from "lucide-react";

export default function BookmarkPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const {
    data: favorites,
    isLoading,
    isError,
  } = useFavoritesAll(user?.id ?? "");

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">찜 목록 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (isError || !favorites) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <PackageX size={48} className="mb-4" />
        <p className="text-sm">찜 목록을 불러오는 중 문제가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">찜 리스트</h1>
      {favorites && favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <PackageX size={48} className="mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            찜 목록이 비어 있습니다
          </h3>
          <p className="text-sm mb-6">
            마음에 드는 상품을 찜 목록에 담아보세요.
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart size={16} />
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {favorites.map((fav, i) => {
            const p = fav.products;
            return (
              <li
                key={i}
                className={`py-3 sm:p-4 px-0 bg-white ${
                  favorites.length - i !== 1 ? "border-b" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3 sm:gap-4">
                  <div
                    className="flex flex-col gap-2 cursor-pointer sm:flex-1"
                    onClick={() => router.push(`/products/${p.id}`)}
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <Image
                          src={p.image_url ?? ""}
                          alt={p.name}
                          width={80}
                          height={80}
                          className="rounded border object-cover w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div className="flex flex-col gap-1 justify-center">
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {p.price.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:flex sm:flex-col sm:items-end sm:justify-center sm:gap-2 sm:border-l sm:pl-4">
                    <button
                      onClick={() => router.push(`/products/${p.id}`)}
                      className="border rounded-md px-2 sm:py-1 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer w-auto sm:w-30"
                    >
                      장바구니 담기
                    </button>
                    <button
                      onClick={() => {
                        // 즐겨찾기 삭제 로직 추가 가능
                      }}
                      className="border rounded-md px-2 sm:py-1 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer w-auto sm:w-30"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
