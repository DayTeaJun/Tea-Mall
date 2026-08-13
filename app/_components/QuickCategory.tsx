"use client";

import Link from "next/link";
import { Shirt, Tag, Watch, Sparkles } from "lucide-react";

const categories = [
  { name: "전체상품", path: "/category?type=전체&page=1", icon: Sparkles },
  { name: "아우터", path: "/category?type=아우터&page=1", icon: Shirt },
  { name: "상의", path: "/category?type=상의&page=1", icon: Shirt },
  { name: "팬츠", path: "/category?type=팬츠&page=1", icon: Tag },
  { name: "액세서리", path: "/category?type=악세서리&page=1", icon: Watch },
];

export default function QuickCategory() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar px-2 sm:justify-center sm:gap-12">
        {categories.map((cat, idx) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={idx}
              href={cat.path}
              className="flex flex-col items-center gap-2 group shrink-0 cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 text-gray-700 transition-colors border border-gray-200">
                <IconComponent size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
