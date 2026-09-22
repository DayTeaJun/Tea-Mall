"use client";

import { ProductType } from "@/types/product";
import { Heart, ImageOff, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useDeleteFavoriteMutation,
  useMyFavoriteIdsQuery,
  usePostFavoriteMutation,
} from "@/lib/queries/products";

function ProductCard({
  products,
  recommend,
  // 이 카드가 실제로 그려지는 그리드/캐러셀 레이아웃에 맞는 값을 호출부에서 넘겨줄 것.
  // 안 넘기면 가장 흔한 상품 그리드(1→2→4→5열) 기준값으로 대체됨.
  sizes = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw",
  // 어두운 배경 섹션(예: 실시간 베스트의 남색 배경) 위에 올릴 때 true로 넘김
  dark = false,
}: {
  products: ProductType;
  recommend?: boolean;
  sizes?: string;
  dark?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const [favCount, setFavCount] = useState<number>(
    products.favorite_count ?? 0,
  );

  const { data: favoriteIds } = useMyFavoriteIdsQuery(user?.id);
  const isFavorited = favoriteIds?.has(products.id) ?? false;

  const { mutate: addFavoriteMutate } = usePostFavoriteMutation(user?.id ?? "");
  const { mutate: delFavoriteMutate } = useDeleteFavoriteMutation(
    user?.id ?? "",
  );

  const ratings = Object.values(products.rating_map ?? {}) as number[];
  const isSoldOut = (products.total_stock ?? 0) <= 0;

  const avgRating =
    ratings.length > 0
      ? parseFloat(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : 0;

  const reviewCount = ratings.length;

  const hasDiscount =
    products.original_price && products.original_price > products.price;

  let discountPercent = 0;
  if (hasDiscount && products.original_price) {
    if (products.discount_type === "percentage" && products.discount_value) {
      discountPercent = products.discount_value;
    } else {
      discountPercent = Math.round(
        ((products.original_price - products.price) / products.original_price) *
          100,
      );
    }
  }

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isFavorited) {
      delFavoriteMutate(products.id);
      setFavCount((prev) => Math.max(0, prev - 1));
    } else {
      addFavoriteMutate(products.id);
      setFavCount((prev) => prev + 1);
    }

    router.refresh();
  };

  return (
    <Link
      key={products.id}
      href={`/products/${products.id}`}
      className={`group flex w-full flex-col transition-all duration-300 ${
        dark ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#f7f7f5] to-[#ececea] rounded-md">
        {!imageError && products.image_url ? (
          <Image
            fill
            src={products.image_url}
            alt={products.name}
            className={`
              object-cover transition-transform duration-300 ease-out 
              ${isSoldOut ? "grayscale" : "group-hover:scale-105"}
            `}
            onError={() => setImageError(true)}
            priority={recommend}
            sizes={sizes}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-gray-400">
            <ImageOff size={24} strokeWidth={1.2} />
            <p className="text-[11px] tracking-tighter">준비중</p>
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center pt-20 pointer-events-none">
            <span className="text-white text-[20px] sm:text-[14px] font-medium tracking-[0.15em] border-b border-white/40 pb-1 uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-2.5 px-0.5">
        <div className="flex justify-between items-center">
          <h3
            className={`text-[15px] sm:text-base font-normal line-clamp-2 leading-tight tracking-tight transition-colors ${
              dark
                ? "text-white group-hover:text-white/70"
                : "text-[#111111] group-hover:text-gray-600"
            }`}
          >
            {products.name}
          </h3>

          <button
            type="button"
            onClick={handleBookmark}
            title="즐겨찾기"
            className="flex h-8 w-8 items-center justify-center rounded-full "
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={`transition-colors duration-200 ${
                isFavorited
                  ? dark
                    ? "text-gray-300 fill-gray-300"
                    : "text-red-500 fill-red-500"
                  : dark
                    ? "text-white/50 fill-transparent"
                    : "text-gray-400 fill-transparent"
              }`}
            />
          </button>
        </div>

        <div className="mt-auto pt-1 flex flex-col gap-0.5">
          <div className="flex flex-col">
            {/* 할인이 없어도 이 줄이 차지하는 높이를 그대로 남겨서, 카드 높이가
                할인 유무와 상관없이 항상 동일하게 유지되도록 invisible로 처리 */}
            <span
              className={`text-[13px] line-through ${
                hasDiscount
                  ? dark
                    ? "text-white/40"
                    : "text-gray-400"
                  : "invisible"
              }`}
            >
              {hasDiscount
                ? `${products.original_price?.toLocaleString()}원`
                : "0원"}
            </span>
            <div className="flex items-center gap-1.5">
              {hasDiscount && (
                <span className="text-[15px] sm:text-[17px] font-bold text-red-500 tracking-tight">
                  {discountPercent}%
                </span>
              )}
              <span
                className={`text-[15px] sm:text-[17px] font-bold tracking-tight ${dark ? "text-white" : "text-[#111111]"}`}
              >
                {products.price.toLocaleString()}원
              </span>
            </div>
          </div>

          <div
            className={`flex items-center justify-between mt-1.5 text-[13px] font-medium ${dark ? "text-white/50" : "text-gray-400"}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-0.5 ${dark ? "text-white/60" : "text-gray-500"}`}
              >
                <Heart
                  size={13}
                  className={
                    dark
                      ? "fill-white/50 text-white/50"
                      : "fill-gray-400 text-gray-400"
                  }
                />
                {favCount}
              </span>

              {reviewCount > 0 && (
                <span className="flex items-center gap-0.5">
                  <Star
                    size={13}
                    className={
                      dark
                        ? "fill-white/50 text-white/50"
                        : "fill-gray-400 text-gray-400"
                    }
                  />
                  {avgRating} ({reviewCount})
                </span>
              )}
            </div>

            {(products.sales_count ?? 0) > 0 && (
              <span>구매 {products.sales_count}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
