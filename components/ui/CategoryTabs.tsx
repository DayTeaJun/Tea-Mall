"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

type CategoryTabsProps = {
  categories?: string[];
  basePath?: string; // "/category"
  initial?: string;
};

export default function CategoryTabs({
  categories = [
    "전체",
    "상의",
    "티셔츠",
    "셔츠/블라우스",
    "아우터",
    "스커트",
    "드레스",
    "니트",
    "스포츠웨어",
  ],
  basePath = "/category",
  initial,
}: CategoryTabsProps) {
  const pathname = usePathname() ?? "/";

  const allowedPaths = ["/", "/category", "/products"];
  const isAllowedPath = useMemo(
    () =>
      allowedPaths.some((p) =>
        p === "/" ? pathname === "/" : pathname.startsWith(p),
      ),
    [pathname],
  );

  const currentCategoryFromPath = useMemo(() => {
    if (!pathname.startsWith(basePath)) return categories[0];

    if (pathname === basePath) return categories[0];

    const slug = pathname.slice(basePath.length + 1);

    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  }, [pathname, basePath, categories]);

  const defaultCategory = initial ?? currentCategoryFromPath;
  const [active, setActive] = useState(defaultCategory);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!pathname.startsWith(basePath)) {
      setActive(categories[0]);
      return;
    }
    const next = currentCategoryFromPath ?? categories[0];
    if (next !== active) setActive(next);
  }, [pathname, currentCategoryFromPath, categories, basePath]);

  useEffect(() => {
    const container = containerRef.current;
    const activeEl = activeRef.current;
    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const offset =
      activeRect.left -
      containerRect.left -
      containerRect.width / 2 +
      activeRect.width / 2;

    container.scrollBy({ left: offset, behavior: "smooth" });
  }, [active]);

  if (!isAllowedPath) return null;

  return (
    <div className="w-full border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div
          className="w-full overflow-x-auto scrollbar-hide"
          ref={containerRef}
          role="tablist"
          aria-label="의류 카테고리"
        >
          <div className="inline-flex gap-2 py-2 px-1">
            {categories.map((cat) => {
              const isActive = cat === active;

              const params = new URLSearchParams();
              params.set("page", "1");

              const href =
                cat === categories[0]
                  ? `${basePath}?${params.toString()}`
                  : `${basePath}/${encodeURIComponent(
                      cat,
                    )}?${params.toString()}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  ref={isActive ? activeRef : undefined}
                  className={
                    "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition " +
                    (isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200")
                  }
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
