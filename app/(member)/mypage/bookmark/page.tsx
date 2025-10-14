"use client";

import { useFavoritesAll } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { LoaderCircle, PackageX, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyCartPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { data: favorites, isLoading } = useFavoritesAll(user?.id ?? "");

  console.log(favorites);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">찜 목록 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">찜 목록</h1>
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
        <></>
      )}
    </div>
  );
}
