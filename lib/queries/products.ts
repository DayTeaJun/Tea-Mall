"use client";

import { ProductType } from "@/types/product";
import { createBrowserSupabaseClient } from "../config/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/providers/ReactQueryProvider";

export type CartItemType = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
};

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

// 장바구니 상품 전체 조회
export async function getProductAllCart(
  userId: string,
): Promise<CartItemType[]> {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:product_id ( id, name, price, image_url )") // 장바구니 및 장바구니 상품 정보 조회 조인
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  const normalized = (data ?? []).map((item) => ({
    ...item,
    product: Array.isArray(item.product) ? item.product[0] : item.product, // product가 배열로 올 경우 첫 번째 요소만 사용 (supabase에서 조인 시 여러개가 조회될 수 있다 판단하여 배열로 반환)
  }));

  return normalized;
}

export function useProductAllCart(userId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart_items", userId],
    queryFn: () => getProductAllCart(userId),
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 장바구니 수량 변경
export const updateCartItemQuantity = async ({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) => {
  if (quantity < 1) return;
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) throw error;
  return data ?? [];
};

export const useUpdateQuantityMutation = (userId: string) => {
  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart_items", userId],
      });
    },
  });
  return { data, isError, mutate, isSuccess, isPending };
};
