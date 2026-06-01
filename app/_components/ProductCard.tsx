"use client";

import { ProductType } from "@/types/product";
import { Heart, ImageOff, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getFavorite,
  useDeleteFavoriteMutation,
  usePostFavoriteMutation,
} from "@/lib/queries/products";

function ProductCard({
  products,
  recommend,
}: {
  products: ProductType;
  recommend?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [favCount, setFavCount] = useState<number>(
    products.favorite_count ?? 0,
  );

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

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user?.id) {
        setIsFavorited(false);
        return;
      }
      try {
        const favorite = await getFavorite(user.id, products.id);
        setIsFavorited(!!favorite);
      } catch (error) {
        console.error("찜 상태 로드 오류:", error);
      }
    };

    fetchFavoriteStatus();
  }, [user?.id, products.id]);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isFavorited) {
      delFavoriteMutate(products.id);
      setIsFavorited(false);
      setFavCount((prev) => Math.max(0, prev - 1));
    } else {
      addFavoriteMutate(products.id);
      setIsFavorited(true);
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
      <div className="relative flex aspect-[1/1] w-full items-center justify-center overflow-hidden bg-[#f4f4f4] rounded-sm">
        {!imageError && products.image_url ? (
          <Image
            fill
            src={products.image_url}
            alt={products.name}
            className={`
              object-cover w-full h-full transition-transform duration-300 ease-out
              ${isSoldOut ? "grayscale" : "group-hover:scale-102"}
            `}
            onError={() => setImageError(true)}
            priority={recommend}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-gray-400">
            <ImageOff size={24} strokeWidth={1.2} />
            <p className="text-[11px] tracking-tighter">준비중</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleBookmark}
          title="즐겨찾기"
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-white hover:scale-110 transition-transform z-10"
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            className={`transition-colors duration-200 ${
              isFavorited
                ? "text-red-500 fill-red-500"
                : "text-white fill-black/5"
            }`}
          />
        </button>

        {isSoldOut && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center pt-20 pointer-events-none">
            <span className="text-white text-[20px] sm:text-[14px] font-medium tracking-[0.15em] border-b border-white/40 pb-1 uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-2.5 px-0.5">
        <h3 className="text-[13px] sm:text-[14px] pb-2 font-normal text-[#111111] line-clamp-2 leading-tight tracking-tight group-hover:text-gray-600 transition-colors">
          {products.name}
        </h3>

        <div className="mt-auto pt-1 flex flex-col gap-1">
          <p className="text-[14px] sm:text-[15px] font-bold text-[#111111] tracking-tight">
            {products.price.toLocaleString()}원
          </p>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-medium">
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
