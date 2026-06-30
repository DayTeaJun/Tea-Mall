"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
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

  useEffect(() => {
    if (!productId) return;

    const incrementViews = async () => {
      const { data, error } = await supabase.rpc("increment_product_views", {
        p_id: productId,
      });
      if (error) console.error("조회수 증가 실패:", error.message);
      else console.log("현재 조회수:", data);
    };

    const updateRecentProducts = () => {
      const saved = localStorage.getItem("recent_products");
      let currentList = saved ? JSON.parse(saved) : [];

      currentList = currentList.filter(
        (item: { id: string }) => item.id !== productId,
      );

      const newItem = {
        id: productId,
        src: productImg,
        alt: productName,
      };
      currentList.unshift(newItem);

      if (currentList.length > 6) {
        currentList = currentList.slice(0, 6);
      }

      localStorage.setItem("recent_products", JSON.stringify(currentList));

      window.dispatchEvent(new Event("recentProductsUpdated"));
    };

    incrementViews();
    updateRecentProducts();
  }, [productId, productImg, productName]);

  return <></>;
}
