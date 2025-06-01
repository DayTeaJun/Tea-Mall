"use client";

import { ProductType } from "@/types/product";
import { ImageOff, Star } from "lucide-react";
import React, { useState } from "react";

function ProductCard({ products }: { products: ProductType }) {
  const [imageError, setImageError] = useState(false);

  const tempRating = 4;
  const maxRating = 5;

  return (
    <a
      key={products.id}
      href={`/products/${products.id}`}
      className="p-4 shadow hover:shadow-md transition"
    >
      <div className="w-full h-40 mb-2 relative flex items-center justify-center bg-gray-50 overflow-hidden">
        {!imageError && products.image_url ? (
          <img
            src={products.image_url}
            alt={products.name}
            width={200}
            height={160}
            className="object-cover w-full h-full hover:scale-105 duration-200 transition-all"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageOff className="text-gray-400" size={40} />
        )}
      </div>
      <h3 className="text-lg font-medium">{products.name}</h3>

      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: maxRating }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < tempRating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <p className="text-gray-500 text-[12px] tracking-wide ml-2">(21)</p>
      </div>

      <p className="mt-2 text-red-600 font-bold tracking-wide">
        {products.price.toLocaleString()}원
      </p>
    </a>
  );
}

export default ProductCard;
