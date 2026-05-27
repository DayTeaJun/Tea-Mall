"use client";

import { ProductType } from "@/types/product";
import { Heart, ImageOff, Star } from "lucide-react";
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

  return (
    <Link
      key={products.id}
      href={`/products/${products.id}`}
      className={`
        group flex w-full flex-col bg-white transition-all duration-300
        ${recommend ? "p-0" : "p-2 sm:p-3"}
      `}
    >
      <div
        className="
          relative flex aspect-[1/1] w-full items-center justify-center
          overflow-hidden bg-[#f4f4f4] rounded-sm
        "
      >
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
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            className="text-white fill-black/5"
          />
        </button>

        {isSoldOut && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center pt-20">
            <span className="text-white text-[20px] sm:text-[14px] font-medium tracking-[0.15em] border-b border-white/40 pb-1 uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-2.5 px-0.5">
        <h3 className="text-[13px] sm:text-[14px] font-normal text-[#111111] line-clamp-2 min-h-[38px] leading-tight tracking-tight group-hover:text-gray-600 transition-colors">
          {products.name}
        </h3>

        <div className="mt-auto pt-1 flex flex-col gap-1">
          <p className="text-[14px] sm:text-[15px] font-bold text-[#111111] tracking-tight">
            {products.price.toLocaleString()}원
          </p>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-0.5 text-gray-500">
              <Heart size={11} className="fill-gray-400 text-gray-400" />
              1.2천
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
