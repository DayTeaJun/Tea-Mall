"use client";

import Image from "next/image";
import React from "react";

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
  return (
    <a
      key={products.id}
      href={`/products/${products.id}`}
      className="border p-4 rounded-lg shadow hover:shadow-md transition"
    >
      <Image
        src={products.image_url}
        alt={products.name}
        className="w-full h-40 object-cover mb-2"
      />
      <h3 className="text-lg font-medium">{products.name}</h3>
      <p className="text-gray-500 text-sm truncate">{products.description}</p>
      <p className="text-right mt-2 font-bold">
        {products.price.toLocaleString()}원
      </p>
    </a>
  );
}

export default ProductCard;
