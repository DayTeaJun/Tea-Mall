"use client";

import {
  useDeleteCartItemMutation,
  useProductAllCart,
  useUpdateQuantityMutation,
} from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cartItems.length === 0 || !cartItems ? (
        <p className="text-gray-600">장바구니가 비어 있습니다.</p>
      ) : (
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 mb-6 flex-1">
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

          <div className="w-[300px] border p-4 flex flex-col gap-3 self-start rounded">
            <p className="text-[22px]">주문 예상 금액</p>
            <div className="flex justify-between items-center text-[16px]">
              <p>총 수량</p>
              <p>
                <span className="font-bold">{totalQuantity} </span>개
              </p>
            </div>

            <div className="flex justify-between items-center text-[16px]">
              <p>총 상품 가격</p>
              <p>
                <span className="font-bold">
                  {totalPrice?.toLocaleString() || 0}{" "}
                </span>
                원
              </p>
            </div>

            <hr className="my-2" />

            <p className="text-[20px] text-right">
              {totalPrice?.toLocaleString() || 0}
              <span className="font-normal text-[16px]"> 원</span>
            </p>

            <button
              onClick={() => toast.success("결제 기능 준비 중 입니다.")}
              type="button"
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              구매하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
