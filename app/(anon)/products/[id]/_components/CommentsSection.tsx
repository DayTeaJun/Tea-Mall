import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { MessageCircleQuestion, Star } from "lucide-react";
import Image from "next/image";
import ReportBtn from "./ReportBtn";
import CommentBtn from "./CommentBtn";

interface Props {
  productId: string;
}

export default async function CommentsSection({ productId }: Props) {
  const supabase = await createServerSupabaseClient();

  const { data: comments } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  return (
    <section className="border-t">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold my-4">상품 리뷰</h2>
        <CommentBtn productId={productId} />
      </div>
      <ul className="space-y-4">
        {comments &&
          (comments?.length === 0 ? (
            <li className="py-10 flex flex-col items-center gap-2 text-gray-500 text-[18px] border-dashed border-2">
              <MessageCircleQuestion size={40} />
              아직 작성된 리뷰가 없습니다.
            </li>
          ) : (
            comments.map((comment) => (
              <li
                key={comment.id}
                className="py-4 border-b flex flex-col gap-4"
              >
                <div className="flex justify-between -my-2 text-sm text-gray-800">
                  <span>{comment.user_name}</span>
                  <span className="text-gray-500 text-[13px]">
                    {new Date(comment.created_at || "").toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < comment.rating ? "text-yellow-500" : "text-gray-300"
                      }
                      fill={
                        i < comment.rating
                          ? "oklch(79.5% 0.184 86.047)"
                          : "none"
                      }
                    />
                  ))}
                </div>

                {comment.images && comment.images.length > 0 && (
                  <div className="flex gap-1">
                    {comment.images.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 overflow-hidden border"
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

                <p className="text-gray-700 text-[13px]">{comment.content}</p>

                <ReportBtn />
              </li>
            ))
          ))}
      </ul>
    </section>
  );
}
