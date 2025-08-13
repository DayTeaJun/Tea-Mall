"use client";

import { ProductType } from "@/types/product";
import { ImageOff, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function ProductCard({ products }: { products: ProductType }) {
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
      className="w-full h-fit hover:shadow-2xl transition-all duration-300 p-4 pt-0 group"
    >
      <div className="w-full h-50 lg:h-60 mb-2 relative flex items-center justify-center bg-gray-50 overflow-hidden">
        {!imageError && products.image_url ? (
          <Image
            fill
            src={products.image_url}
            alt={products.name}
            className="object-cover w-full h-full group-hover:scale-105 duration-200 transition-all"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-gray-100 ">
            <ImageOff className="text-gray-400" size={40} />
            <p className="text-gray-500">이미지가 없습니다.</p>
          </div>
        )}

        {isSoldOut && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-30 py-2 px-1 bg-black/85 group-hover:bg-black/50 text-white text-[16px] font-bold tracking-wider shadow transition-all duration-300">
            SOLD OUT
          </span>
        )}
      </div>
      <h3 className="text-lg font-medium">{products.name}</h3>

      <p className="mt-1 text-red-600 font-bold tracking-wide">
        {products.price.toLocaleString()}원
      </p>

      {reviewCount > 0 ? (
        <div className="flex items-center gap-1 mt-1">
          {[...Array(maxRating)].map((_, index) => {
            const isFilled = index < avgRating;
            return (
              <Star
                key={index}
                size={16}
                className={
                  isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }
              />
            );
          })}
          <p className="text-gray-500 text-xs font-bold tracking-widest ml-1">
            ({reviewCount})
          </p>
        </div>
      ) : (
        <div className="h-5" />
      )}
    </Link>
  );
}

export default ProductCard;
