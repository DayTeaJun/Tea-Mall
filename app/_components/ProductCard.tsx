"use client";

import { ProductType } from "@/types/product";
import { ImageOff, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function ProductCard({
  products,
  recommend,
}: {
  products: ProductType;
  recommend?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  const ratings = Object.values(products.rating_map ?? {}) as number[];
  const isSoldOut = (products.total_stock ?? 0) <= 0;

  const avgRating =
    ratings.length > 0
      ? parseFloat(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : 0;

  const reviewCount = ratings.length;
  const maxRating = 5;

  return (
    <Link
      key={products.id}
      href={`/products/${products.id}`}
      className={`
        w-full h-fit transition-all duration-300
        pt-0 group
        flex ${recommend ? "flex-col sm:p-0" : "flex-row sm:p-4"} gap-3 sm:block
      `}
    >
      <div
        className="
          w-full
          aspect-[3/4]
          mb-2 relative flex items-center justify-center
          bg-gray-50 overflow-hidden
        "
      >
        {!imageError && products.image_url ? (
          <Image
            fill
            src={products.image_url}
            alt={products.name}
            className={`${isSoldOut ? "grayscale" : "group-hover:scale-105"} object-cover w-full h-full duration-200 transition-all`}
            onError={() => setImageError(true)}
            priority={recommend}
          />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-gray-100">
            <ImageOff className="text-gray-400" size={40} />
            <p className="text-gray-500">이미지가 없습니다.</p>
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-6">
            <span className="text-white text-[13px] sm:text-[14px] font-medium tracking-[0.15em] border-b border-white/40 pb-1 uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-medium line-clamp-2">{products.name}</h3>

        <p className="mt-1 text-red-600 font-bold tracking-wide">
          {products.price.toLocaleString()}원
        </p>

        {reviewCount > 0 ? (
          <div className="flex items-center gap-1 mt-1 w-[120px]">
            {[...Array(maxRating)].map((_, index) => {
              const isFilled = index < Math.round(avgRating);
              return (
                <Star
                  key={index}
                  size={16}
                  className={
                    isFilled
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              );
            })}
            <p className="text-gray-500 text-xs font-bold tracking-widest ml-1">
              ({reviewCount})
            </p>
          </div>
        ) : (
          <div className="h-5 w-[120px]" />
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
