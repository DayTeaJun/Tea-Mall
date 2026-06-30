"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useProductAllCart } from "@/lib/queries/products";

const recentProducts = [
  { id: 1, src: "/main_1.jpg", alt: "상품 1" },
  { id: 2, src: "/main_2.jpg", alt: "상품 2" },
  { id: 3, src: "/main_3.jpg", alt: "상품 3" },
  { id: 4, src: "/main_1.jpg", alt: "상품 4" },
  { id: 5, src: "/main_2.jpg", alt: "상품 5" },
];

export default function SideQuickMenu() {
  const { user } = useAuthStore();

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(recentProducts.length / 3) || 1;
  const { data: cartItems } = useProductAllCart(user?.id ?? "");

  const itemsPerPage = 3;
  const currentItems = recentProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="w-32 border border-gray-300 bg-white text-center text-xs select-none">
      <Link
        href="/mypage/myCart"
        className="block bg-[#343a40] text-white py-2.5 px-3 border-b border-[#495057] hover:bg-[#212529] transition-colors"
      >
        <div className="flex justify-between items-center font-medium">
          <span>장바구니</span>
          <span className="text-[#00d2ff] font-bold">
            {cartItems?.length || 0}
          </span>
        </div>
      </Link>

      <div className="bg-[#343a40] text-white py-2.5 px-3">
        <div className="flex justify-between items-center font-medium">
          <span>최근본상품</span>
          <span className="text-[#00d2ff] font-bold">
            {recentProducts.length}
          </span>
        </div>
      </div>

      <div className="p-2 flex flex-col gap-2 min-h-[260px] justify-start bg-white">
        {currentItems.length > 0 ? (
          currentItems.map((prod) => (
            <Link
              key={prod.id}
              href={`/products/${prod.id}`}
              className="relative w-full aspect-square border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors bg-gray-50 block"
            >
              <Image
                src={prod.src}
                alt={prod.alt}
                fill
                sizes="100px"
                className="object-cover p-0.5"
              />
            </Link>
          ))
        ) : (
          <div className="text-gray-400 py-12">없음</div>
        )}
      </div>

      <div className="border-t border-gray-200 p-1.5 flex items-center justify-between bg-gray-50 text-[11px]">
        <div className="text-gray-500 pl-1">
          <span className="text-[#007bff] font-bold">{page}</span>/{totalPages}
        </div>
        <div className="flex border border-gray-300 rounded-sm bg-white divide-x divide-gray-300">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-0.5 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={12} className="text-gray-600" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-0.5 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight size={12} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
