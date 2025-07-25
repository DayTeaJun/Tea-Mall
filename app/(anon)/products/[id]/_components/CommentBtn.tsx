"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

function CommentBtn({ productId }: { productId: string }) {
  const { user } = useAuthStore();
  const [hasReview, setHasReview] = useState<boolean | null>(null);

  useEffect(() => {
    const checkReview = async () => {
      if (!user?.id) return;

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (!error && data) {
        setHasReview(true);
      } else {
        setHasReview(false);
      }
    };

    checkReview();
  }, [user?.id, productId]);

  if (!user || hasReview === null) return null;

  return (
    <Link href={`/productReview/${productId}`} className="cursor-pointer">
      <span className="text-sm text-blue-600 hover:underline">
        {hasReview ? "리뷰 수정하기" : "리뷰 작성하기"}
      </span>
    </Link>
  );
}

export default CommentBtn;
