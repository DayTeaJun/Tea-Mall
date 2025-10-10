"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useEffect } from "react";

export default function ProductDetail({ productId }: { productId: string }) {
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!productId) return;

    const incrementViews = async () => {
      const { data, error } = await supabase.rpc("increment_product_views", {
        p_id: productId,
      });
      if (error) console.error("조회수 증가 실패:", error.message);
      else console.log("현재 조회수:", data);
    };

    incrementViews();
  }, [productId]);

  return <></>;
}
