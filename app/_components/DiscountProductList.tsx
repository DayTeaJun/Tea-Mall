"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Heart, Percent } from "lucide-react";
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
            sizes="(max-width: 1024px) 100vw, 33vw"
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

const AUTO_ADVANCE_MS = 4000;

function DiscountCarouselMobile({
  columns,
}: {
  columns: { label: string; products: ProductType[] }[];
}) {
  const count = columns.length;
  const canSlide = count > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: canSlide });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // 가만히 두면 일정 시간마다 자동으로 다음 카테고리로 넘어감. 슬라이드가
  // 바뀔 때마다(자동이든 사용자가 직접 눌렀든) 타이머가 새로 시작되므로,
  // 방금 조작했는데 곧바로 또 넘어가는 어색함이 없음
  useEffect(() => {
    if (!emblaApi || !canSlide) return;
    const timer = setTimeout(() => emblaApi.scrollNext(), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [emblaApi, selectedIndex, canSlide]);

  const goPrev = () => emblaApi?.scrollPrev();
  const goNext = () => emblaApi?.scrollNext();

  const displayIndex = selectedIndex + 1;

  const navButtonClass =
    "flex h-8 w-8 items-center justify-center text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-700";

  return (
    <div className="lg:hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {columns.map((col) => (
            <div key={col.label} className="shrink-0 w-full min-w-0">
              <DiscountColumn label={col.label} products={col.products} />
            </div>
          ))}
        </div>
      </div>

      {canSlide && (
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-[2px] rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-300 ease-out"
              style={{ width: `${(displayIndex / count) * 100}%` }}
            />
          </div>

          <button type="button" onClick={goPrev} className={navButtonClass}>
            <ChevronLeft size={16} />
          </button>

          <div className="flex w-8 items-center gap-1.5 text-sm shrink-0">
            <span className="font-bold text-gray-900">{displayIndex}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400">{count}</span>
          </div>

          <button type="button" onClick={goNext} className={navButtonClass}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function DiscountProductList() {
  const { data, isLoading } = useDiscountProductListQuery();
  const columns = data ?? [];

  if (!isLoading && columns.length === 0) return null;

  return (
    <section className="w-full mb-16">
      <div className="mb-6">
        <h2 className="flex items-center gap-1.5 text-2xl font-bold tracking-tight">
          <Percent size={20} className="text-red-500" strokeWidth={2.5} />
          지금 놓치면 후회할 특가
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          얼마 남지 않은 할인, 지금 바로 확인하세요
        </p>
      </div>

      {isLoading ? (
        <>
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="aspect-[4/3] rounded-sm bg-gray-100 animate-pulse" />
                <div className="h-[92px] rounded-sm bg-gray-100 animate-pulse" />
                <div className="h-[92px] rounded-sm bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="lg:hidden flex flex-col gap-3">
            <div className="aspect-[4/3] rounded-sm bg-gray-100 animate-pulse" />
            <div className="h-[92px] rounded-sm bg-gray-100 animate-pulse" />
            <div className="h-[92px] rounded-sm bg-gray-100 animate-pulse" />
          </div>
        </>
      ) : (
        <>
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {columns.map((col) => (
              <DiscountColumn
                key={col.label}
                label={col.label}
                products={col.products}
              />
            ))}
          </div>

          <DiscountCarouselMobile columns={columns} />
        </>
      )}
    </section>
  );
}
