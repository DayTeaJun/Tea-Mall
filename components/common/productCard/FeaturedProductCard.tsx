"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { ProductType } from "@/types/product";
import { getDiscountPercent } from "@/lib/queries/products";

interface FeaturedProductCardProps {
  product: ProductType;
  eyebrow?: string;
}

export default function FeaturedProductCard({
  product,
  eyebrow,
}: FeaturedProductCardProps) {
  const percent = getDiscountPercent(product);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-gray-100"
    >
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-300">
          <ImageOff size={32} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
        {eyebrow && (
          <p className="text-[11px] sm:text-xs font-medium text-white/70 mb-1.5">
            {eyebrow}
          </p>
        )}
        <p className="text-base sm:text-xl md:text-2xl font-extrabold leading-tight line-clamp-2">
          {product.name}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          {percent > 0 && (
            <span className="text-sm sm:text-base font-bold text-red-400">
              {percent}%
            </span>
          )}
          <span className="text-sm sm:text-base font-bold">
            {product.price.toLocaleString()}원
          </span>
        </div>
      </div>
    </Link>
  );
}
