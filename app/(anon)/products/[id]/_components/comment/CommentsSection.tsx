import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { MessageCircleQuestion, Star, UserRound } from "lucide-react";
import Image from "next/image";
import CommentReportBtn from "./CommentReportBtn";
import CommentBtn from "./CommentBtn";
import CommentHelpful from "./CommentHelpful";

interface Props {
  productId: string;
}

export default async function CommentsSection({ productId }: Props) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  const { data: rawComments } = await supabase
    .from("reviews")
    .select(
      `
      id,
      user_id,
      user_name,
      rating,
      created_at,
      images,
      content,
      product_id,
      updated_at,
      public_profiles ( profile_image_url ),
      helpful_count,
      review_helpfuls ( user_id )
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  const comments = rawComments
    ? rawComments.map((comment) => {
        // review_helpfuls 배열 중에 현재 유저의 id가 포함되어 있는지 확인
        const isLikedByMe = userId
          ? comment.review_helpfuls?.some(
              (h: { user_id: string }) => h.user_id === userId,
            )
          : false;

        return {
          ...comment,
          isLiked: isLikedByMe,
        };
      })
    : [];

  // 내가 남긴 리뷰를 상단으로 정렬
  const sortedComments = comments
    ? [...comments].sort((a, b) => {
        if (a.user_id === userId && b.user_id !== userId) return -1;
        if (a.user_id !== userId && b.user_id === userId) return 1;
        return 0;
      })
    : [];

  return (
    <section
      id="product-comments-section"
      className="border-t scroll-mt-[146px] w-full"
    >
      <div className="flex justify-between items-center px-4 sm:px-0">
        <h2 className="text-[18px] sm:text-[20px] font-semibold my-4">
          상품 리뷰
        </h2>

        {sortedComments.find((item) => item.user_id !== userId) && (
          <CommentBtn productId={productId} />
        )}
      </div>
      <ul className="list-none pl-0 divide-y divide-gray-100">
        {sortedComments &&
          (sortedComments.length === 0 ? (
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
                            unoptimized
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
          ))}
      </ul>
    </section>
  );
}
