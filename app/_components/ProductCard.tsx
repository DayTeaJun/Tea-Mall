"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

interface Props {
  products: ProductType;
}

function ProductCard({ products }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      key={products.id}
      href={`/products/${products.id}`}
      className="p-4 rounded-lg shadow hover:shadow-md transition"
    >
      <div className="w-full h-40 mb-2 relative flex items-center justify-center bg-gray-50">
        {!imageError && products.image_url ? (
          <img
            src={products.image_url}
            alt={products.name}
            width={200}
            height={160}
            className="object-cover w-full h-full rounded-md"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageOff className="text-gray-400" size={40} />
        )}
      </div>
      <h3 className="text-lg font-medium">{products.name}</h3>
      <p className="text-gray-500 text-sm truncate">{products.description}</p>
      <p className="text-right mt-2 font-bold">
        {products.price.toLocaleString()}원
      </p>
    </a>
  );
}

export default ProductCard;
