"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Menu, Shirt, Sparkles } from "lucide-react";

type CategoryItem = {
  id: string;
  label: string;
  href: string;
  Icon: LucideIcon;
  badge?: string;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "fashion",
    label: "패션의류/잡화",
    href: "/category/fashion",
    Icon: Shirt,
  },
  { id: "beauty", label: "뷰티", href: "/category/beauty", Icon: Sparkles },
];

interface CategoryDropdownProps {
  categories?: CategoryItem[];
}

export default function CategoryDropdown({
  categories = DEFAULT_CATEGORIES,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <>
      <div className="flex sm:hidden">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label="카테고리 열기"
          className="flex pl-4 h-full flex-col items-center justify-center gap-1"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <button
          type="button"
          onClick={close}
          aria-label="카테고리 닫기"
          className="fixed inset-0 z-30 sm:hidden"
        />
      )}

      <div
        className={`fixed left-0 top-[40px] bottom-0 z-40 h-full w-56 transform bg-white shadow-xl transition-transform duration-200 sm:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="">
          <nav className="flex flex-col">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 border-b"
                onClick={close}
              >
                <cat.Icon className="h-5 w-5 text-gray-500" />
                <span className="flex-1 truncate">{cat.label}</span>
                {cat.badge && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {cat.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
