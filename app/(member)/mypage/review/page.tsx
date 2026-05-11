"use client";

import React from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2, MessageSquare, Star } from "lucide-react";
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
}

export default function MyReviewsPage() {
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
        <Loader2 className="animate-spin text-gray-300" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        리뷰를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">리뷰 관리</h1>
      <p className="text-sm text-gray-500 my-2">
        작성하신 리뷰 {reviews?.length || 0}건이 있습니다.
      </p>

      <div className="border border-gray-200 bg-white overflow-hidden">
        <div className="hidden md:flex bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
          <div className="flex-[2] p-4 text-center">리뷰 정보</div>
          <div className="flex-[4] p-4">내용</div>
          <div className="flex-[1] p-4 text-center">작성일</div>
          <div className="flex-[1] p-4 text-center">관리</div>
        </div>

        <div className="divide-y divide-gray-200">
          {reviews && reviews.length > 0 ? (
            reviews.map((review: Review) => (
              <div
                key={review.id}
                className="flex flex-col md:flex-row hover:bg-gray-50 duration-150"
              >
                <div className="flex-[2] p-4 flex flex-col items-center justify-center gap-2 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  {review.images && review.images.length > 0 ? (
                    <div className="relative w-16 h-16 border rounded overflow-hidden">
                      <Image
                        src={review.images[0]}
                        alt="리뷰 이미지"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      <MessageSquare size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-[4] p-4 flex flex-col gap-2">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {review.content}
                  </p>
                </div>

                <div className="flex-[1] p-4 flex items-center justify-center text-xs text-gray-500 bg-gray-50/30 md:bg-transparent">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString()
                    : "-"}
                </div>

                <div className="flex-[1] p-4 flex md:flex-col items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/productReview/${review.product_id}`)
                    }
                    type="button"
                    className="flex-1 md:w-full py-2 border border-gray-200 text-xs text-gray-600 hover:bg-white transition-colors"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="flex-1 md:w-full py-2 border border-gray-200 text-xs text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelReview(review.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-500">
              작성된 리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
