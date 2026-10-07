"use client";

import { useState } from "react";
import { Loader2, MessageCircleQuestion, Star, UserRound } from "lucide-react";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  PRODUCT_REVIEWS_PAGE_SIZE,
  ProductReviewRow,
  useProductReviewsQuery,
} from "@/lib/queries/products";
import CommentReportBtn from "./CommentReportBtn";
import CommentBtn from "./CommentBtn";
import CommentHelpful from "./CommentHelpful";

interface Props {
  productId: string;
  initialReviews?: ProductReviewRow[];
  initialTotalCount?: number;
}

export default function CommentsSection({
  productId,
  initialReviews,
  initialTotalCount,
}: Props) {
  const { user } = useAuthStore();
  const userId = user?.id;
  const [page, setPage] = useState(1);

  // 서버 컴포넌트에서 1페이지를 미리 받아온 경우, 그 데이터를 그대로
  // react-query의 초기 데이터로 써서 첫 진입 시 로딩 깜빡임 없이 바로 보여줌
  const hasInitialData = initialTotalCount !== undefined;

  const { reviews, totalCount, isLoading } = useProductReviewsQuery(
    productId,
    page,
    PRODUCT_REVIEWS_PAGE_SIZE,
    hasInitialData
      ? { reviews: initialReviews ?? [], totalCount: initialTotalCount }
      : undefined,
  );

  // review_helpfuls 배열 중에 현재 유저의 id가 포함되어 있는지 확인
  const comments = reviews.map((comment) => {
    const isLikedByMe = userId
      ? comment.review_helpfuls?.some(
          (h: { user_id: string }) => h.user_id === userId,
        )
      : false;

    return {
      ...comment,
      isLiked: isLikedByMe,
    };
  });

  // 내가 남긴 리뷰를 현재 페이지 내에서 상단으로 정렬
  const sortedComments = [...comments].sort((a, b) => {
    if (a.user_id === userId && b.user_id !== userId) return -1;
    if (a.user_id !== userId && b.user_id === userId) return 1;
    return 0;
  });

  const pageCount = Math.max(
    1,
    Math.ceil(totalCount / PRODUCT_REVIEWS_PAGE_SIZE),
  );

  return (
    <section
      id="product-comments-section"
      className="border-t scroll-mt-[146px] w-full"
    >
      <div className="flex justify-between items-center px-4 sm:px-0">
        <h2 className="text-[18px] sm:text-[20px] font-semibold my-4">
          상품 리뷰
        </h2>

        {!isLoading &&
          !sortedComments.some((item) => item.user_id === userId) && (
            <CommentBtn productId={productId} />
          )}
      </div>
      <ul className="list-none pl-0 divide-y divide-gray-100">
        {isLoading ? (
          <li className="py-10 flex flex-col items-center gap-2 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </li>
        ) : sortedComments.length === 0 ? (
          <li className="py-10 mx-4 sm:mx-0 flex flex-col items-center gap-2 text-gray-500 text-[16px] sm:text-[18px] border-dashed border-2 border-gray-200 rounded-sm">
            <MessageCircleQuestion size={36} className="sm:w-10 sm:h-10" />
            아직 작성된 리뷰가 없습니다.
          </li>
        ) : (
          sortedComments.map((comment) => {
            const isMyItem = comment.user_id === userId;

            return (
              <li
                key={comment.id}
                className={`p-4 sm:p-5 flex flex-col gap-3.5 transition-colors ${
                  isMyItem ? "bg-gray-50/80 px-4 my-2 sm:my-3" : "bg-white"
                }`}
              >
                <div className="flex flex-col gap-2">
                  {isMyItem && (
                    <div className="flex justify-between items-center">
                      <span className="w-fit font-bold px-1.5 py-0.5 rounded-xs text-[10px] tracking-tight bg-gray-900 text-white">
                        내가 남긴 리뷰
                      </span>
                      <CommentBtn productId={productId} />
                    </div>
                  )}

                  <div className="flex gap-3 items-center sm:items-start">
                    <div className="rounded-full overflow-hidden shrink-0 border border-gray-100">
                      {comment?.public_profiles?.profile_image_url ? (
                        <Image
                          width={40}
                          height={40}
                          src={comment.public_profiles.profile_image_url}
                          alt={comment.user_name}
                          className="object-cover w-12 h-12 sm:w-10 sm:h-10"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 flex items-center justify-center text-gray-300">
                          <UserRound size={24} className="sm:w-8 sm:h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row flex-1 sm:justify-between gap-1 sm:gap-2 text-sm text-gray-800">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-[13px] sm:text-[14px] font-medium ${
                            isMyItem
                              ? "text-gray-950 font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          {comment.user_name}
                        </span>

                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`sm:w-4 sm:h-4 ${
                                i < comment.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                              fill={
                                i < comment.rating
                                  ? "oklch(79.5% 0.184 86.047)"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-400 sm:text-gray-500 text-[11px] sm:text-[13px] mt-0.5 sm:mt-0">
                        <span>
                          {new Date(
                            comment.created_at || "",
                          ).toLocaleDateString()}
                        </span>
                        {comment.updated_at && (
                          <span className="text-gray-400 text-[11px] sm:text-[12px]">
                            (수정됨)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {comment.images && comment.images.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-0.5">
                    {comment.images.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border border-gray-200 rounded-xs"
                      >
                        <Image
                          fill
                          src={url}
                          alt={`review-${idx}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <p
                  className={`whitespace-pre-line pl-0.5 text-[13px] sm:text-sm leading-relaxed ${
                    isMyItem ? "text-gray-950 font-medium" : "text-gray-700"
                  }`}
                >
                  {comment.content}
                </p>

                <div className="flex justify-between pt-1">
                  <CommentHelpful
                    reviewId={comment.id}
                    initialCount={comment.helpful_count}
                    initialIsLiked={comment.isLiked}
                  />
                  <CommentReportBtn />
                </div>
              </li>
            );
          })
        )}
      </ul>

      {!isLoading && pageCount > 1 && (
        <div className="flex justify-center mt-6 mb-2 text-xs sm:text-sm">
          <ReactPaginate
            onPageChange={(e) => setPage(e.selected + 1)}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            forcePage={page - 1}
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
      )}
    </section>
  );
}
