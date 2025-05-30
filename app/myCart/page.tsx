"use client";

import {
  useDeleteCartItemMutation,
  useProductAllCart,
  useUpdateQuantityMutation,
} from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function MyCartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate, isPending } = useUpdateQuantityMutation(user?.id ?? "");
  const { mutate: deleteMutate } = useDeleteCartItemMutation(user?.id ?? "");

  const { data: cartItems, isLoading } = useProductAllCart(user?.id ?? "");

  const totalQuantity =
    cartItems && cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice =
    cartItems &&
    cartItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0,
    );

  if (isLoading || !cartItems) return <div className="p-5">로딩 중...</div>;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cartItems.length === 0 || !cartItems ? (
        <p className="text-gray-600">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border p-3 rounded "
              >
                <div className="flex items-start gap-3 justify-between w-full">
                  <div className="flex items-center gap-4">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-32 h-32 object-cover rounded cursor-pointer"
                        onClick={() =>
                          router.push(`/products/${item.product?.id}`)
                        }
                      />
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        className="cursor-pointer hover:underline text-left"
                        type="button"
                        onClick={() =>
                          router.push(`/products/${item.product?.id}`)
                        }
                      >
                        <span className="font-semibold">
                          {item.product?.name}
                        </span>
                      </button>
                      <p className="text-sm text-gray-500">
                        ₩{(item.product?.price ?? 0).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          className="w-8 h-8 border rounded bg-white hover:bg-gray-400 transition-all cursor-pointer"
                          onClick={() => {
                            if (item.quantity === 1) {
                              deleteMutate(item?.id);
                              return;
                            }
                            mutate({
                              itemId: item.id,
                              quantity: item.quantity - 1,
                            });
                          }}
                          disabled={isPending}
                        >
                          -
                        </button>
                        <span className="min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 border rounded bg-white hover:bg-gray-400 transition-all cursor-pointer"
                          onClick={() => {
                            mutate({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            });
                          }}
                          disabled={isPending}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMutate(item?.id)}
                    type="button"
                    className="shrink-0 cursor-pointer"
                  >
                    <span className="text-gray-500 underline transition-colors hover:no-underline hover:text-gray-800">
                      삭제
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 text-right space-y-1">
            <p className="text-sm text-gray-600">총 수량: {totalQuantity}개</p>
            <p className="text-lg font-bold">
              총 금액: ₩{totalPrice?.toLocaleString() || 0}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
