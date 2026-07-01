"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useRecentProductsStore } from "@/lib/store/useRecentProductsStore";
import { useEffect } from "react";

interface ProductDetailProps {
  productId: string;
  productImg: string;
  productName: string;
}

export default function ProductDetail({
  productId,
  productImg,
  productName,
}: ProductDetailProps) {
  const supabase = createBrowserSupabaseClient();
  const { addProduct } = useRecentProductsStore();

  useEffect(() => {
    if (!productId) return;

    const incrementViews = async () => {
      const { error } = await supabase.rpc("increment_product_views", {
        p_id: productId,
      });
      if (error) console.error("조회수 증가 실패:", error.message);
    };

    addProduct({
      id: productId,
      src: productImg,
      alt: productName,
    });

    incrementViews();
  }, [productId, productImg, productName, addProduct]);

  return <></>;
}
