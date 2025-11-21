"use client";

import ProductCard from "@/app/_components/ProductCard";
import ProductCardSkeleton from "@/app/_components/ProductCardSkeleton";
import { useSearchProductsQuery } from "@/lib/queries/products";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function ProductListView({
  category = "",
  keyword = "",
  page = 1,
  pageSize = 10,
}) {
  const router = useRouter();

  const { data: products, isLoading } = useSearchProductsQuery(
    category,
    keyword,
    page,
    pageSize,
  );

  const totalCount = products?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentZeroBased = Math.max(0, Math.min(page - 1, pageCount - 1));

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;

    const base = category
      ? `/category/${encodeURIComponent(category)}`
      : `/search`;

    const qs = keyword
      ? `?query=${encodeURIComponent(keyword)}&page=${newPage}`
      : `?page=${newPage}`;

    router.push(`${base}${qs}`);
  };

  return (
    <div>
      {isLoading ? (
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </section>
      ) : products?.data.length ? (
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.data.map((product) => (
            <ProductCard key={product.id} products={product} />
          ))}
        </section>
      ) : (
        <p className="text-gray-500 mt-8">상품이 없습니다.</p>
      )}

      <div className="mt-6 flex justify-center">
        <ReactPaginate
          onPageChange={handlePageChange}
          pageCount={pageCount}
          forcePage={currentZeroBased}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          previousLabel={"이전"}
          nextLabel={"다음"}
        />
      </div>
    </div>
  );
}
