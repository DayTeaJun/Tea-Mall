"use client";

import Link from "next/link";
import { Sparkles, Shirt, Footprints, ShoppingBag, Watch } from "lucide-react";

const categories = [
  {
    name: "전체상품",
    path: "/category?type=전체&page=1",
    icon: Sparkles,
    pcOnly: true,
  },
  { name: "의류", path: "/category?type=의류&page=1", icon: Shirt },
  { name: "신발", path: "/category?type=신발&page=1", icon: Footprints },
  { name: "가방", path: "/category?type=가방&page=1", icon: ShoppingBag },
  { name: "액세서리", path: "/category?type=악세서리&page=1", icon: Watch },
];

export default function QuickCategory() {
  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-12 px-2 sm:px-0">
        {categories.map((cat, idx) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={idx}
              href={cat.path}
              className={`flex-col items-center gap-1.5 sm:gap-2 group shrink-0 cursor-pointer ${
                cat.pcOnly ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 text-gray-700 transition-colors border border-gray-200">
                <IconComponent
                  size={20}
                  className="sm:w-6 sm:h-6"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[11px] sm:text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
