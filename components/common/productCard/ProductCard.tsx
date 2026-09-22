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
}: {
  products: ProductType;
  recommend?: boolean;
  sizes?: string;
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
      className="group flex w-full flex-col bg-white transition-all duration-300"
    >
      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#f7f7f5] to-[#ececea]">
        {!imageError && products.image_url ? (
          <Image
            fill
            src={products.image_url}
            alt={products.name}
            className={`
              object-cover transition-transform duration-300 ease-out rounded 
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
          <h3 className="text-[13px] sm:text-[14px] font-normal text-[#111111] line-clamp-2 leading-tight tracking-tight group-hover:text-gray-600 transition-colors">
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
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 fill-transparent"
              }`}
            />
          </button>
        </div>

        <div className="mt-auto pt-1 flex flex-col gap-0.5">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 line-through">
                {products.original_price?.toLocaleString()}원
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] sm:text-[15px] font-bold text-red-500 tracking-tight">
                  {discountPercent}%
                </span>
                <span className="text-[14px] sm:text-[15px] font-bold text-[#111111] tracking-tight">
                  {products.price.toLocaleString()}원
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[14px] sm:text-[15px] font-bold text-[#111111] tracking-tight">
              {products.price.toLocaleString()}원
            </p>
          )}

          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-0.5 text-gray-500">
              <Heart size={11} className="fill-gray-400 text-gray-400" />
              {favCount}
            </span>

            {reviewCount > 0 && (
              <span className="flex items-center gap-0.5">
                <Star size={11} className="fill-gray-400 text-gray-400" />
                {avgRating} ({reviewCount})
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
