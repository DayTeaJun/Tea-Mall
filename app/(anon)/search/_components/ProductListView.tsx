"use client";

import ProductCard from "@/app/_components/ProductCard";
import ProductCardSkeleton from "@/app/_components/ProductCardSkeleton";
import { useSearchProductsQuery } from "@/lib/queries/products";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { PackageSearch, ShoppingCart } from "lucide-react";

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

  const handlePageChange = (selected: { selected: number }) => {
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
    <div className="w-full min-h-screen flex flex-col justify-between">
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
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <PackageSearch size={48} className="mb-4" />

          <h3 className="text-lg font-semibold mb-2">상품이 없습니다</h3>

          <p className="text-sm mb-6 text-gray-500">
            다른 검색어나 카테고리를 선택해보세요.
          </p>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart size={16} />
            홈으로 돌아가기
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <ReactPaginate
          onPageChange={handlePageChange}
          pageCount={pageCount}
          forcePage={currentZeroBased}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
      </div>
    </div>
  );
}
