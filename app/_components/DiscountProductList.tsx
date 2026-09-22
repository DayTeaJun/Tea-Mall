"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Percent } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  getDiscountPercent,
  useDiscountProductListQuery,
  useMyFavoriteIdsQuery,
  usePostFavoriteMutation,
  useDeleteFavoriteMutation,
} from "@/lib/queries/products";
import { ProductType } from "@/types/product";

const COLUMN_GROUPS: { label: string; categories: string[] }[] = [
  { label: "의류", categories: ["의류"] },
  { label: "신발", categories: ["신발"] },
  { label: "가방·액세서리", categories: ["가방", "액세서리"] },
];

const MAX_ITEMS_PER_COLUMN = 2;

function DiscountListRow({ product }: { product: ProductType }) {
  const percent = getDiscountPercent(product);
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: favoriteIds } = useMyFavoriteIdsQuery(user?.id);
  const isFavorited = favoriteIds?.has(product.id) ?? false;

  const { mutate: addFavoriteMutate } = usePostFavoriteMutation(user?.id ?? "");
  const { mutate: delFavoriteMutate } = useDeleteFavoriteMutation(
    user?.id ?? "",
  );

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isFavorited) {
      delFavoriteMutate(product.id);
    } else {
      addFavoriteMutate(product.id);
    }

    router.refresh();
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex items-center gap-4 p-3.5 hover:bg-gray-50 transition-colors"
    >
      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-sm bg-gray-100">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-800 line-clamp-1">{product.name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {percent > 0 && (
            <span className="text-[15px] font-bold text-red-500">
              {percent}%
            </span>
          )}
          <span className="text-[15px] font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBookmark}
        title="즐겨찾기"
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
      >
        <Heart
          size={18}
          strokeWidth={1.5}
          className={
            isFavorited
              ? "text-red-500 fill-red-500"
              : "text-gray-300 fill-gray-100"
          }
        />
      </button>
    </Link>
  );
}

function DiscountColumn({
  label,
  products,
}: {
  label: string;
  products: ProductType[];
}) {
  const bannerImage = products[0];
  const maxPercent = Math.max(...products.map(getDiscountPercent));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-gray-100">
        {bannerImage.image_url && (
          <Image
            src={bannerImage.image_url}
            alt={label}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-base font-bold">{label}</p>
          {maxPercent > 0 && (
            <p className="text-[11px] font-medium text-white/80">
              최대 {maxPercent}% 할인
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-sm overflow-hidden">
        {products.map((product) => (
          <DiscountListRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function DiscountProductList() {
  const { data: products, isLoading } = useDiscountProductListQuery();

  const columns = COLUMN_GROUPS.map((group) => ({
    label: group.label,
    products: (products ?? [])
      .filter((p) => p.category && group.categories.includes(p.category))
      .slice(0, MAX_ITEMS_PER_COLUMN),
  })).filter((col) => col.products.length > 0);

  if (!isLoading && columns.length === 0) return null;

  return (
    <section className="w-full mb-16">
      <div className="mb-6">
        <h2 className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
          <Percent size={18} className="text-red-500" strokeWidth={2.5} />
          지금 놓치면 후회할 특가
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          할인가로 만나는 T-Mall 인기 상품
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="aspect-[4/3] rounded-sm bg-gray-100 animate-pulse" />
                <div className="h-[92px] rounded-sm bg-gray-100 animate-pulse" />
                <div className="h-[92px] rounded-sm bg-gray-100 animate-pulse" />
              </div>
            ))
          : columns.map((col) => (
              <DiscountColumn
                key={col.label}
                label={col.label}
                products={col.products}
              />
            ))}
      </div>
    </section>
  );
}
