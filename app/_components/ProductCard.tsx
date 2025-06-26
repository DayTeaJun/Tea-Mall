"use client";

import { ProductType } from "@/types/product";
import { ImageOff, Star } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function ProductCard({ products }: { products: ProductType }) {
  const [imageError, setImageError] = useState(false);

  const ratings = Object.values(products.rating_map ?? {}) as number[];

  const avgRating =
    ratings.length > 0
      ? parseFloat(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : 0;

  const reviewCount = ratings.length;

  const maxRating = 5;

  return (
    <a
      key={products.id}
      href={`/products/${products.id}`}
      className="w-full hover:shadow-2xl transition-all duration-300"
    >
      <div className="w-full h-80 mb-2 relative flex items-center justify-center bg-gray-50 overflow-hidden">
        {!imageError && products.image_url ? (
          <Image
            fill
            src={products.image_url}
            alt={products.name}
            className="object-cover w-full h-full hover:scale-105 duration-200 transition-all"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-gray-100 ">
            <ImageOff className="text-gray-400" size={40} />
            <p className="text-gray-500">이미지가 없습니다.</p>
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium">{products.name}</h3>

      <p className="mt-1 text-red-600 font-bold tracking-wide">
        {products.price.toLocaleString()}원
      </p>

      {reviewCount > 0 && (
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
          <p className="text-gray-500 text-xs font-bold tracking-wide ml-2">
            ( {reviewCount} )
          </p>
        </div>
      )}
    </a>
  );
}

export default ProductCard;
