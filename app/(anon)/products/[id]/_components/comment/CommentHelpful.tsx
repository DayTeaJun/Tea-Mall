"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";

interface CommentHelpfulProps {
  reviewId: string;
  initialCount: number;
  initialIsLiked: boolean;
}

export default function CommentHelpful({
  reviewId,
  initialCount,
  initialIsLiked,
}: CommentHelpfulProps) {
  const supabase = createBrowserSupabaseClient();
  const { user } = useAuthStore();

  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleHelpful = async () => {
    if (!user) {
      toast.warning("로그인 후 이용 가능합니다.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("toggle_review_helpful", {
        p_review_id: reviewId,
        p_user_id: user.id,
      });

      if (error) throw error;

      const result = data as { liked: boolean; helpful_count: number };

      setCount(result?.helpful_count);
      setIsLiked(result?.liked);
    } catch (error) {
      console.error("도움이 돼요 처리 중 오류 발생:", error);
      toast.error("처리에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleHelpful}
      disabled={isLoading}
      className={`flex gap-1.5 items-center text-xs border-2 rounded px-2.5 py-1.5 font-bold transition-all cursor-pointer ${
        isLiked
          ? "bg-green-500 border-green-500 text-white"
          : "bg-white border-green-300 text-green-600 hover:border-green-400"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <ThumbsUp size={14} className={isLiked ? "fill-current" : ""} />
      <span>도움이 돼요</span>
      <span className="ml-0.5">{count}</span>
    </button>
  );
}
