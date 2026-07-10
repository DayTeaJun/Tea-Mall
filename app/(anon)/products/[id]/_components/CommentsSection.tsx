import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { MessageCircleQuestion, Star, UserRound } from "lucide-react";
import Image from "next/image";
import ReportBtn from "./ReportBtn";
import CommentBtn from "./CommentBtn";

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
      public_user_profile ( profile_image_url )
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  const comments = rawComments
    ? [...rawComments].sort((a, b) => {
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
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold my-4">상품 리뷰</h2>
        <CommentBtn productId={productId} />
      </div>
      <ul className="list-none pl-0 divide-y divide-gray-100">
        {comments &&
          (comments.length === 0 ? (
            <li className="py-10 flex flex-col items-center gap-2 text-gray-500 text-[18px] border-dashed border-2 border-gray-200 rounded-sm">
              <MessageCircleQuestion size={40} />
              아직 작성된 리뷰가 없습니다.
            </li>
          ) : (
            comments.map((comment) => {
              const isMyItem = comment.user_id === userId;

              return (
                <li
                  key={comment.id}
                  className={`p-5 flex flex-col gap-4 transition-colors ${
                    isMyItem ? "bg-gray-50/80 px-4 my-3" : "bg-white"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <div className="rounded-full overflow-hidden shrink-0">
                      {comment?.public_user_profile?.profile_image_url ? (
                        <Image
                          width={40}
                          height={40}
                          src={comment.public_user_profile.profile_image_url}
                          alt={comment.user_name}
                          className="object-cover w-10 h-10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-300">
                          <UserRound size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 justify-between -my-2 text-sm text-gray-800">
                      <div className="flex flex-col justify-between gap-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${isMyItem ? "text-gray-950 font-bold" : "text-gray-800"}`}
                          >
                            {comment.user_name}
                          </span>
                          {isMyItem && (
                            <span className="font-bold px-1.5 py-0.5 rounded-xs text-[10px] tracking-tight bg-gray-900 text-white">
                              내가 남긴 리뷰
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < comment.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                              fill={
                                i < comment.rating
                                  ? "oklch(79.5% 0.184 86.047)"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                        <span>
                          {new Date(
                            comment.created_at || "",
                          ).toLocaleDateString()}
                        </span>
                        {comment.updated_at && (
                          <span className="text-gray-400 text-[12px]">
                            (수정됨)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {comment.images && comment.images.length > 0 && (
                    <div className="flex gap-1 pl-1">
                      {comment.images.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 overflow-hidden border border-gray-200 rounded-xs"
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
                    className={`whitespace-pre-line pl-1 text-[13px] sm:text-sm leading-relaxed ${
                      isMyItem ? "text-gray-950 font-medium" : "text-gray-700"
                    }`}
                  >
                    {comment.content}
                  </p>

                  <div className="flex justify-start">
                    <ReportBtn />
                  </div>
                </li>
              );
            })
          ))}
      </ul>
    </section>
  );
}
