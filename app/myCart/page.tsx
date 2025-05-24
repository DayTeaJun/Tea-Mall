"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const supabase = createBrowserSupabaseClient();

type CartItemType = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  } | null;
};

export default function MyCartPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const router = useRouter();

  const { data: cartItems = [], isLoading } = useQuery<CartItemType[], Error>({
    queryKey: ["cartItems", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
        id,
        quantity,
        product:product_id (
          id,
          name,
          price,
          image_url
        )
      `,
        )
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data as CartItemType[]; // ✅ 강제 타입 지정
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      if (quantity < 1) return;
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cartItems", user?.id],
      });
    },
  });

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  if (!user || isLoading) return <div className="p-5">로딩 중...</div>;

  if (!user) return <div className="p-5">로그인 정보가 없습니다.</div>;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => router.push(`/products/${item.product?.id}`)}
              >
                <div className="flex items-center gap-3">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                  )}

                  <div>
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      ₩{(item.product?.price ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 border rounded bg-white hover:bg-gray-400 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity.mutate({
                        itemId: item.id,
                        quantity: item.quantity - 1,
                      });
                    }}
                    disabled={updateQuantity.isPending}
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    className="w-8 h-8 border rounded bg-white hover:bg-gray-400 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      });
                    }}
                    disabled={updateQuantity.isPending}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 text-right space-y-1">
            <p className="text-sm text-gray-600">총 수량: {totalQuantity}개</p>
            <p className="text-lg font-bold">
              총 금액: ₩{totalPrice.toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
