"use client";

import { createBrowserSupabaseClient } from "../config/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}
const supabase = createBrowserSupabaseClient();

// 상품 전체 조회 (메인 페이지용)
export async function getProductAllToMain(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data ?? [];
}

export function useProductAllToMainQuery() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProductAllToMain,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
