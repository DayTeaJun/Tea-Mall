"use client";

import React from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2, MessageSquare, Star, Calendar, Package } from "lucide-react";
import Image from "next/image";
import { useDelReview, useGetReviews } from "@/lib/queries/auth";
import { useRouter } from "next/navigation";

export interface Review {
  id: string;
  content: string;
  rating: number;
  images: string[] | null;
  user_name: string;
  user_id: string;
  product_id: string;
  created_at: string | null;
  updated_at: string | null;
  product_image?: string | null;
  product_name?: string | null;
}

export default function MyReviewsList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: reviews, isLoading, isError } = useGetReviews(user?.id || "");
  const { mutate: deleteReview } = useDelReview(user?.id || "");

  const handleDelReview = (reviewId: string) => {
    if (confirm("정말로 리뷰를 삭제하시겠습니까?")) {
      deleteReview(reviewId);
    }
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
        리뷰를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-20 text-center border border-gray-200 bg-gray-50">
        <MessageSquare size={40} className="mx-auto text-gray-200 mb-2" />
        <p className="text-gray-500 text-sm">작성하신 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review: Review) => (
        <div key={review.id} className="border border-gray-200 rounded-sm">
          {/* ...기존의 리뷰 카드 마크업 동일... */}
          <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 border border-gray-200 bg-white shrink-0">
                {review.product_image ? (
                  <Image
                    src={review.product_image}
                    alt="상품"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package size={20} />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => router.push(`/products/${review.product_id}`)}
                  className="text-sm font-bold text-gray-800 hover:underline line-clamp-1 text-left"
                >
                  {review.product_name || "상품 정보 없음"}
                </button>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {review.created_at?.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() =>
                  router.push(`/productReview/${review.product_id}?from=mypage`)
                }
                className="hover:text-blue-600 px-2 py-1 border border-gray-300 bg-white"
              >
                수정
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleDelReview(review.id)}
                className="hover:text-red-500 px-2 py-1 border border-gray-300 bg-white"
              >
                삭제
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < review.rating
                        ? "text-orange-500 fill-orange-500"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              {review.updated_at && review.updated_at !== review.created_at && (
                <span className="text-[11px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-sm font-medium">
                  수정됨
                </span>
              )}
            </div>
            <div className="text-[15px] text-gray-800 leading-relaxed mb-6 min-h-[50px]">
              {review.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
