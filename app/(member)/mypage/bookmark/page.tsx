"use client";

import {
  useDeleteFavoriteMutation,
  useFavoritesAll,
  usePostMutation,
} from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LoaderCircle,
  PackageX,
  RefreshCcw,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/common/Modal";
import ReactPaginate from "react-paginate";

export default function BookmarkPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("query") ?? "";
  const [searchInput, setSearchInput] = useState(keyword);

  const currentPage = Number(searchParams.get("page") ?? 1);

  const {
    data: favorites,
    isLoading,
    isError,
  } = useFavoritesAll(user?.id ?? "", keyword, currentPage, 8);

  const { mutate: deleteMutate } = useDeleteFavoriteMutation(user?.id ?? "");
  const { mutate: addCartMutate } = usePostMutation(user?.id ?? "");

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isModal, setIsModal] = useState(false);

  const handleSearch = () => {
    router.push(`/mypage/bookmark?query=${searchInput}&page=1`);
  };

  const handleSearchRefresh = () => {
    setSearchInput("");
    router.push("/mypage/bookmark?query=&page=1");
  };

  const handlePageChange = (selected: { selected: number }) => {
    const newPage = selected.selected + 1;
    router.push(
      `/mypage/bookmark?query=${encodeURIComponent(keyword)}&page=${newPage}`,
    );
  };

  const PAGE_SIZE = 10;

  const totalCount = favorites?.count ?? 0;

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === favorites?.data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites?.data.map((item) => item.products.id) ?? []);
    }
  };

  const handleDelSelectFavorites = () => {
    selectedItems.forEach((id) => deleteMutate(id));
    setSelectedItems([]);
    router.refresh();

    setIsModal(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">찜 목록 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (isError || !favorites) {
    return (
      <div className="max-w-7xl">
        <h1 className="text-xl font-bold">찜 리스트</h1>
        <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
          <PackageX size={48} className="mb-4" />
          <p className="text-sm">찜 목록을 불러오는 중 문제가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">찜 리스트</h1>
      {favorites && favorites?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <PackageX size={48} className="mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            찜 목록이 비어 있습니다
          </h3>
          <p className="text-sm mb-6">
            마음에 드는 상품을 찜 목록에 담아보세요.
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart size={16} />
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <>
          <ul className="flex flex-col border-b">
            <div className="flex items-center mb-4 gap-2 relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="상품 이름을 검색해보세요!"
                className="w-full px-3 py-2 pr-10 border rounded-md text-sm"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                  }}
                  className="absolute right-12 sm:right-[52px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label="검색어 지우기"
                >
                  <X size={18} />
                </button>
              )}

              <button
                onClick={handleSearch}
                className="p-2 text-black border rounded-md cursor-pointer active:scale-[0.98]"
                aria-label="검색"
              >
                <Search size={20} />
              </button>

              <button
                onClick={handleSearchRefresh}
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm self-end sm:self-auto w-full sm:w-auto justify-center sm:justify-start shrink-0"
              >
                <RefreshCcw size={16} />
                검색 초기화
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-b p-3 px-4 bg-gray-50">
              <div
                onClick={toggleSelectAll}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  onChange={() => toggleSelectAll()}
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  checked={selectedItems.length === favorites?.data.length}
                />
                <span className="text-sm text-gray-800 font-medium">
                  전체 선택 ({selectedItems.length} /{" "}
                  {favorites?.data.length ?? 0})
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      toast.error("삭제할 항목을 선택하세요.");
                      return;
                    }
                    setIsModal(true);
                  }}
                  className="px-3 py-1 border text-sm rounded hover:bg-gray-100 transition"
                >
                  선택삭제
                </button>
              </div>
            </div>
            {favorites?.data.map((fav, i) => {
              const p = fav.products;
              return (
                <li
                  key={i}
                  className={`py-3 sm:p-4 px-0 bg-white ${
                    favorites?.data.length - i !== 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3 sm:gap-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mr-2  cursor-pointer"
                      checked={selectedItems.includes(p.id)}
                      onChange={() => toggleItemSelection(p.id)}
                    />
                    <div
                      className="flex flex-col gap-2 cursor-pointer sm:flex-1"
                      onClick={() => router.push(`/products/${p.id}`)}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <Image
                            src={p.image_url ?? ""}
                            alt={p.name}
                            width={80}
                            height={80}
                            className="rounded border object-cover w-16 h-16 sm:w-20 sm:h-20"
                          />
                          <div className="flex flex-col gap-1 justify-center">
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {p.price.toLocaleString()}원
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:flex sm:flex-col sm:items-end sm:justify-center sm:gap-2 sm:border-l sm:pl-4">
                      <button
                        onClick={() =>
                          addCartMutate({
                            productId: p.id,
                            userId: user?.id || "",
                            quantity: 1,
                            selectedSize: "M",
                          })
                        }
                        className="border rounded-md px-2 sm:py-1 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer w-auto sm:w-30"
                      >
                        장바구니 담기
                      </button>
                      <button
                        onClick={() => {
                          deleteMutate(fav.product_id);
                        }}
                        className="border rounded-md px-2 sm:py-1 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer w-auto sm:w-30"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex justify-center">
            <ReactPaginate
              onPageChange={handlePageChange}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              forcePage={currentPage - 1}
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
        </>
      )}

      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="선택한 상품을 삭제하시겠습니까?"
        description={`* 선택한 상품이 장바구니에서 삭제됩니다. \n (상품페이지에서 다시 상품을 다시 추가할 수 있습니다.)`}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModal(false)}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            취소
          </button>
          <button
            onClick={handleDelSelectFavorites}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            삭제
          </button>
        </div>
      </Modal>
    </div>
  );
}
