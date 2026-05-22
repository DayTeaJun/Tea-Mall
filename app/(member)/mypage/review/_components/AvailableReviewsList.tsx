"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  useGetAvailableReviews,
  usePostHiddenReview,
} from "@/lib/queries/auth"; // 파일 경로에 맞게 수정
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2, Package } from "lucide-react";
import ReactPaginate from "react-paginate";
import Modal from "@/components/common/Modals/Modal";
import { toast } from "sonner";

export default function AvailableReviewsList() {
  const LIMIT = 5;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const currentPage = Number(searchParams.get("page")) || 1;

  const { mutate: delOrderItemMutate } = usePostHiddenReview(
    user?.id || "",
    currentPage,
  );

  const [isModal, setIsModal] = useState({ isOpen: false, orderId: "" });

  const { data, isLoading, isError } = useGetAvailableReviews(
    user?.id || "",
    currentPage,
    LIMIT,
  );

  const handlePageChange = (selected: { selected: number }) => {
    const newPage = selected.selected + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelOrderItem = (orderId: string) => {
    if (!orderId || !user?.id) {
      toast.error("주문 정보를 찾을 수 없습니다.");
      return;
    }

    delOrderItemMutate(orderId);
    console.log("숨김 처리된 주문 ID:", orderId);
    setIsModal({ isOpen: false, orderId: "" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        작성 가능한 리뷰를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const items = data?.items || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.ceil(totalCount / LIMIT);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center border border-gray-200 bg-gray-50">
        <Package size={40} className="mx-auto text-gray-200 mb-2" />
        <p className="text-gray-500 text-sm">작성 가능한 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-200 border-b border-gray-200">
        {items.map((item) => (
          <div
            key={item.id}
            className="py-6 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-5 flex-1">
              <div className="relative w-[120px] h-[120px] bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center">
                {item.product_image ? (
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-sm" />
                )}
              </div>

              <div className="space-y-1.5 pt-1">
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {item.product_name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {item.product_description}
                </p>
                <div className="text-xs text-gray-400 pt-3">
                  {item.delivered_at}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 shrink-0 w-[120px] self-center">
              <button
                onClick={() => router.push(`/productReview/${item.product_id}`)}
                className="w-full py-2 border border-blue-500 text-blue-600 text-sm font-semibold rounded-sm hover:bg-blue-50/50 transition-colors text-center"
              >
                리뷰 작성하기
              </button>
              <button
                onClick={() => setIsModal({ isOpen: true, orderId: item.id })}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 tracking-wide"
              >
                숨기기
              </button>
            </div>
          </div>
        ))}
      </div>

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

      <Modal
        isOpen={isModal.isOpen}
        onClose={() => setIsModal({ isOpen: false, orderId: "" })}
        title="리뷰 내역을 숨기시겠습니까?"
        description={`(* 해당 주문은 목록에서 숨겨지며, 삭제 후 2개월간 복구할 수 있습니다.)`}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModal({ isOpen: false, orderId: "" })}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            취소
          </button>
          <button
            onClick={() => handleDelOrderItem(isModal.orderId)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            확인
          </button>
        </div>
      </Modal>
    </div>
  );
}
