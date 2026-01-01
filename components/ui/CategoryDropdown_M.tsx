"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

type SubCategory = {
  id: string;
  label: string;
};

type CategoryGroup = {
  id: string;
  label: string;
  children?: SubCategory[];
};

const DEFAULT_CATEGORIES: CategoryGroup[] = [
  { id: "all", label: "전체" },
  {
    id: "top",
    label: "상의",
    children: [
      { id: "tshirts", label: "티셔츠" },
      { id: "shirts-blouse", label: "셔츠/블라우스" },
      { id: "knit", label: "니트" },
      { id: "hoodie-sweatshirt", label: "후드/맨투맨" },
      { id: "sleeveless", label: "슬리브리스" },
      { id: "cardigan", label: "가디건" },
    ],
  },
  {
    id: "outer",
    label: "아우터",
    children: [
      { id: "jacket", label: "자켓" },
      { id: "coat", label: "코트" },
      { id: "jumper", label: "점퍼" },
      { id: "padding", label: "패딩" },
      { id: "vest", label: "베스트" },
    ],
  },
  {
    id: "bottom",
    label: "하의",
    children: [
      { id: "pants", label: "팬츠" },
      { id: "denim", label: "데님" },
      { id: "leggings", label: "레깅스" },
      { id: "shorts", label: "숏팬츠" },
    ],
  },
  { id: "skirt", label: "스커트" },
  { id: "dress", label: "드레스" },
  { id: "set", label: "세트웨어" },
  { id: "sportswear", label: "스포츠웨어" },
  { id: "homewear", label: "홈웨어" },
];

interface CategoryDropdownProps {
  categories?: CategoryGroup[];
}

export default function CategoryDropdown_M({
  categories = DEFAULT_CATEGORIES,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <div className="flex sm:hidden">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label="카테고리 열기"
          className="flex pl-4 h-full flex-col items-center justify-center"
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
        className={`fixed left-0 top-[40px] bottom-0 z-40 w-56 bg-white shadow-xl transition-transform duration-200 sm:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col">
          {categories.map((cat) => {
            const hasChildren = !!cat.children?.length;
            const isOpen = expanded === cat.id;

            return (
              <div key={cat.id} className="border-b">
                <button
                  type="button"
                  onClick={() =>
                    hasChildren ? setExpanded(isOpen ? null : cat.id) : close()
                  }
                  className="flex w-full items-center px-4 py-3 text-sm text-gray-800"
                >
                  <span className="flex-1 text-left">{cat.label}</span>
                </button>

                {hasChildren && isOpen && (
                  <div className="flex flex-col bg-gray-50">
                    {cat.children!.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${sub.id}`}
                        onClick={close}
                        className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
