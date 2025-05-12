"use client";

import { ProductType } from "@/types/product";
import { createBrowserSupabaseClient } from "../config/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createBrowserSupabaseClient();

// 상품 전체 조회 (메인 페이지용)
export async function getProductAllToMain(): Promise<ProductType[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("deleted", false);

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
