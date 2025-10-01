"use client";

import ProductCard from "@/app/_components/ProductCard";
import ProductCardSkeleton from "@/app/_components/ProductCardSkeleton";
import { useSearchProductsQuery } from "@/lib/queries/products";
import { useRouter, useSearchParams } from "next/navigation";
import ReactPaginate from "react-paginate";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const category = searchParams.get("category") ?? "";

  const keyword = searchParams.get("query") ?? "";

  const currentPage = Number(searchParams.get("page") ?? 1);
  const { data: products, isLoading } = useSearchProductsQuery(
    category,
    query,
    currentPage,
    8,
  );

  const PAGE_SIZE = 10;

  const totalCount = products?.count ?? 0;

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const currentZeroBased = Math.max(
    0,
    Math.min((currentPage || 1) - 1, pageCount - 1),
  );

  const handlePageChange = (selected: { selected: number }) => {
    const newPage = selected.selected + 1;
    router.push(`/search?query=${encodeURIComponent(keyword)}&page=${newPage}`);
  };

  return (
    <div className="p-4 sm:p-8 py-8 sm:py-16 w-full max-w-7xl mx-auto">
      <h1 className="text-[16px] sm:text-2xl mb-4 text-center">
        Search Result
      </h1>
      <p className="text-center text-[14px] sm:text-xl text-gray-500 mb-4 sm:mb-8">
        <span className="text-black font-semibold">
          &quot;
          {query}
          &quot;
        </span>{" "}
        에 대한 검색 결과입니다.
      </p>

      {isLoading ? (
        <section className="min-h-[calc(100vh-329px)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </section>
      ) : products?.data.length ? (
        <section className="min-h-[calc(100vh-329px)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.data.map((product) => (
            <ProductCard key={product.id} products={product} />
          ))}
        </section>
      ) : (
        <p className="min-h-[calc(100vh-329px)] text-gray-500 mt-8">
          검색 결과가 없습니다.
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <ReactPaginate
          onPageChange={handlePageChange}
          pageRangeDisplayed={3}
          pageCount={pageCount} // 항상 ≥ 1
          forcePage={currentZeroBased}
          marginPagesDisplayed={1}
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={`page-item ${
            pageCount === 1 ? "disabled pointer-events-none opacity-50" : ""
          }`}
          previousLinkClassName={"page-link"}
          nextClassName={`page-item ${
            pageCount === 1 ? "disabled pointer-events-none opacity-50" : ""
          }`}
          nextLinkClassName={"page-link"}
        />
      </div>
    </div>
  );
}
