"use client";

import { useRouter } from "next/navigation";

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
  {
    id: "all",
    label: "전체상품",
    children: [
      { id: "new", label: "신상품 (NEW)" },
      { id: "best", label: "베스트셀러" },
      { id: "sale", label: "특가/할인" },
    ],
  },
  {
    id: "clothing",
    label: "의류",
    children: [
      { id: "outer", label: "아우터" },
      { id: "top", label: "상의" },
      { id: "pants", label: "팬츠" },
      { id: "skirt-dress", label: "스커트/원피스" },
    ],
  },
  {
    id: "shoes",
    label: "신발",
    children: [
      { id: "sneakers", label: "스니커즈" },
      { id: "loafer-shoes", label: "로퍼/구두" },
      { id: "sandal-slippers", label: "샌들/슬리퍼" },
    ],
  },
  {
    id: "bag",
    label: "가방",
    children: [
      { id: "backpack", label: "백팩" },
      { id: "cross-bag", label: "크로스백" },
      { id: "tote-bag", label: "토트백" },
    ],
  },
  {
    id: "accessory",
    label: "액세서리",
    children: [
      { id: "cap-hat", label: "모자" },
      { id: "jewelry", label: "주얼리" },
      { id: "scarf-belt", label: "머플러/벨트" },
    ],
  },
];

interface CategoryDropdownProps {
  categories?: CategoryGroup[];
}

export default function CategoryDropdown({
  categories = DEFAULT_CATEGORIES,
}: CategoryDropdownProps) {
  const router = useRouter();

  const goToSearch = (label: string) => {
    const searchTarget = label.includes("신상품")
      ? "전체"
      : label.includes("베스트")
        ? "전체"
        : label === "전체상품"
          ? "전체"
          : label;
    const encoded = encodeURIComponent(searchTarget);
    router.push(`/category?type=${encoded}&page=1`);
  };

  return (
    <div className="hidden sm:inline-block group">
      <button
        type="button"
        aria-label="카테고리 열기"
        className="flex h-full flex-col items-center justify-center gap-1 font-bold px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        카테고리
      </button>

      <div
        className="
          absolute left-1/2 top-full z-20 w-screen -translate-x-1/2
          border-t border-b border-gray-200 bg-white shadow-lg
          opacity-0 invisible -translate-y-1
          transition-all duration-200
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
        "
      >
        <nav className="mx-auto flex max-w-6xl items-start justify-between gap-6 py-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex-1 text-center flex flex-col items-center"
            >
              <button
                type="button"
                className="text-base font-bold text-gray-900 hover:text-green-600 transition-colors cursor-pointer pb-2 border-b border-transparent hover:border-green-600"
                onClick={() => goToSearch(cat.label)}
              >
                {cat.label}
              </button>

              {cat.children && cat.children.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {cat.children.map((sub) => (
                    <li key={sub.id}>
                      <button
                        type="button"
                        className="w-full rounded text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 p-1.5 hover:font-medium transition-colors cursor-pointer"
                        onClick={() => goToSearch(sub.label)}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
