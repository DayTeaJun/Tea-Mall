"use client";

import { Json } from "@/lib/config/supabase/types_db";
import {
  useDeleteCartItemMutation,
  useProductAllCart,
  useUpdateQuantityMutation,
} from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CartItemOptions({ options }: { options?: Json | null }) {
  if (!options) return null;

  const labels: Record<string, string> = {
    size: "사이즈",
    color: "색상",
  };

  return (
    <p className="text-xs text-gray-500">
      {Object.entries(options)
        .map(([k, v]) => `${labels[k] ?? k}: ${v}`)
        .join(" / ")}
    </p>
  );
}

export default function MyCartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate, isPending } = useUpdateQuantityMutation(user?.id ?? "");
  const { mutate: deleteMutate } = useDeleteCartItemMutation(user?.id ?? "");
  const { data: cartItems, isLoading } = useProductAllCart(user?.id ?? "");

  const totalQuantity =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const totalPrice =
    cartItems?.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0,
    ) ?? 0;

  if (isLoading || !cartItems) return <div className="p-5">로딩 중...</div>;

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">장바구니가 비어 있습니다.</p>
      ) : (
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 mb-6 flex-1">
            {cartItems.map((item) => {
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between border p-3 rounded"
                >
                  <div className="flex items-start gap-3 justify-between w-full">
                    <div className="flex items-center gap-4">
                      {item.product?.image_url ? (
                        <Image
                          width={128}
                          height={128}
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-32 h-32 object-cover rounded cursor-pointer"
                          onClick={() =>
                            router.push(`/products/${item.product?.id}`)
                          }
                        />
                      ) : (
                        <div className="flex w-32 h-32 flex-col gap-2 items-center justify-center bg-gray-100 rounded">
                          <ImageOff size={40} className="text-gray-400" />
                          <p className="text-gray-500 text-sm text-center">
                            이미지가 없습니다.
                          </p>
                        </div>
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

                        <CartItemOptions options={item.options} />

                        <p className="text-sm text-gray-500">
                          ₩{(item.product?.price ?? 0).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2 mt-auto">
                          <button
                            className="w-8 h-8 border rounded bg-white hover:bg-gray-400 transition-all cursor-pointer"
                            onClick={() => {
                              if (item.quantity === 1) {
                                deleteMutate(item?.id);
                                router.refresh();
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
              );
            })}
          </ul>

          <div className="min-w-[280px] border p-4 flex flex-col gap-3 self-start rounded">
            <p className="text-[22px]">주문 예상 금액</p>
            <div className="flex justify-between items-center text-[16px]">
              <p>총 수량</p>
              <p>
                <span className="font-bold">{totalQuantity}</span> 개
              </p>
            </div>

            <div className="flex justify-between items-center text-[16px]">
              <p>총 상품 가격</p>
              <p>
                <span className="font-bold">{totalPrice.toLocaleString()}</span>{" "}
                원
              </p>
            </div>

            <hr className="my-2" />

            <p className="text-[20px] text-right">
              {totalPrice.toLocaleString()}
              <span className="font-normal text-[16px]"> 원</span>
            </p>

            <button
              onClick={() => toast.success("결제 기능 준비 중입니다.")}
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
