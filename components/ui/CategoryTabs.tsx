"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

type CategoryTabsProps = {
  categories?: string[];
  basePath?: string;
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
  basePath = "/search",
  initial,
}: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/";

  const allowedPaths = ["/", "/search", "/products"];

  const isAllowedPath = allowedPaths.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p),
  );

  const paramCategory = searchParams?.get("category") ?? undefined;
  const query = searchParams?.get("query") ?? "";
  const page = searchParams?.get("page") ?? "1";

  const defaultCategory =
    pathname === basePath
      ? paramCategory ?? initial ?? categories[0]
      : categories[0];

  const [active, setActive] = useState<string>(defaultCategory);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (pathname !== basePath) {
      setActive(categories[0]);
      return;
    }

    if (paramCategory && paramCategory !== active) setActive(paramCategory);

    if (paramCategory === null && active !== categories[0]) {
      setActive(categories[0]);
    }
  }, [paramCategory, pathname]);

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
              params.set("category", cat);
              if (query) params.set("query", query);
              if (page) params.set("page", page);

              const href = `${basePath}?${params.toString()}`;

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
