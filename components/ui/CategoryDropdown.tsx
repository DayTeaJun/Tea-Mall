"use client";

type SubCategory = {
  id: string;
  label: string;
};

type CategoryGroup = {
  id: string;
  label: string; // 대 카테고리
  children?: SubCategory[]; // 소 카테고리
};

const DEFAULT_CATEGORIES: CategoryGroup[] = [
  {
    id: "all",
    label: "전체",
  },
  {
    id: "top",
    label: "상의",
    children: [
      { id: "tshirts", label: "티셔츠" },
      { id: "shirts-blouse", label: "셔츠/블라우스" },
      { id: "knit", label: "니트" },
    ],
  },
  {
    id: "outer",
    label: "아우터",
  },
  {
    id: "skirt",
    label: "스커트",
  },
  {
    id: "dress",
    label: "드레스",
  },
  {
    id: "sportswear",
    label: "스포츠웨어",
  },
];

interface CategoryDropdownProps {
  categories?: CategoryGroup[];
  onSelect?: (category: string) => void;
}

export default function CategoryDropdown({
  categories = DEFAULT_CATEGORIES,
  onSelect,
}: CategoryDropdownProps) {
  return (
    <div className="hidden sm:inline-block group">
      <button
        type="button"
        aria-label="카테고리 열기"
        className="flex h-full flex-col items-center justify-center gap-1 font-bold px-4 py-2 hover:bg-gray-100"
      >
        카테고리
      </button>

      <div
        className="
          pointer-events-none
          absolute left-1/2 top-full z-20 w-screen -translate-x-1/2
          border-t border-b bg-white shadow-md
          opacity-0 -translate-y-1
          transition-all duration-200
          group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0
        "
      >
        <nav className="mx-auto flex max-w-7xl items-stretch justify-between gap-6 px-6 py-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="
                group/item
                relative flex-1 text-center
              "
            >
              <button
                type="button"
                className="text-sm font-medium text-gray-900 hover:text-green-600"
                onClick={() => onSelect?.(cat.label)}
              >
                {cat.label}
              </button>

              {cat.children && cat.children.length > 0 && (
                <div
                  className="
                    pointer-events-none
                    absolute left-1/2 top-full z-30 mt-2 w-40 -translate-x-1/2
                    rounded-md border bg-white py-2 shadow-lg
                    opacity-0
                    transition-all duration-150
                    group-hover/item:pointer-events-auto group-hover/item:opacity-100
                  "
                >
                  <ul className="flex flex-col gap-1">
                    {cat.children.map((sub) => (
                      <li key={sub.id}>
                        <button
                          type="button"
                          className="w-full px-3 py-1 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                          onClick={() => onSelect?.(sub.label)}
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
