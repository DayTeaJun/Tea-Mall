"use client";

import Image from "next/image";
import { Star, UserRound } from "lucide-react";
import CommentReportBtn from "./CommentReportBtn";
import CommentBtn from "./CommentBtn";
import CommentHelpful from "./CommentHelpful";
import { ProductReviewRow } from "@/lib/queries/products";

interface ReviewCardProps {
  comment: ProductReviewRow & { isLiked: boolean };
  productId: string;
  isMyItem?: boolean;
}

export default function ReviewCard({
  comment,
  productId,
  isMyItem = false,
}: ReviewCardProps) {
  return (
    <div
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
                  isMyItem ? "text-gray-950 font-bold" : "text-gray-800"
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
                      i < comment.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    fill={
                      i < comment.rating ? "oklch(79.5% 0.184 86.047)" : "none"
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 sm:text-gray-500 text-[11px] sm:text-[13px] mt-0.5 sm:mt-0">
              <span>
                {new Date(comment.created_at || "").toLocaleDateString()}
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
    </div>
  );
}
