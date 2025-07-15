"use client";

import Modal from "@/components/common/Modal";
import { Json } from "@/lib/config/supabase/types_db";
import {
  useDeleteCartItemMutation,
  useProductAllCart,
  useUpdateQuantityMutation,
} from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ImageOff, LoaderCircle, PackageX, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isModal, setIsModal] = useState(false);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const selectedCartItems = cartItems?.filter((item) =>
    selectedItems.includes(item.id),
  );

  const totalQuantity =
    selectedCartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const totalPrice =
    selectedCartItems?.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0,
    ) ?? 0;

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("선택된 상품이 없습니다.");
      return;
    }

    const query = new URLSearchParams();
    selectedItems.forEach((id) => query.append("itemIds", id));
    router.push(`/myCart/checkout?${query.toString()}`);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems?.map((item) => item.id) ?? []);
    }
  };

  const handleDelSelectCart = () => {
    selectedItems.forEach((id) => deleteMutate(id));
    setSelectedItems([]);
    router.refresh();

    setIsModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">장바구니 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cartItems &&
        (cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
            <PackageX size={48} className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              장바구니가 비어 있습니다
            </h3>
            <p className="text-sm mb-6">
              마음에 드는 상품을 장바구니에 담아보세요.
            </p>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
            >
              <ShoppingCart size={16} />
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <ul className="flex flex-col gap-4 mb-6 flex-1">
              <div className="flex items-center justify-between mb-4 border p-3 rounded bg-gray-50">
                <div
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    onChange={() => toggleSelectAll()}
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    checked={selectedItems.length === cartItems?.length}
                  />
                  <span className="text-sm text-gray-800 font-medium">
                    전체 선택 ({selectedItems.length} / {cartItems?.length ?? 0}
                    )
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (selectedItems.length === 0) {
                        toast.error("삭제할 항목을 선택하세요.");
                        return;
                      }
                      setIsModal(true);
                    }}
                    className="px-3 py-1 border text-sm rounded hover:bg-gray-100 transition"
                  >
                    선택삭제
                  </button>
                </div>
              </div>

              {cartItems.map((item) => {
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border p-3 rounded"
                  >
                    <div className="flex items-start gap-3 justify-between w-full">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mr-2 my-auto cursor-pointer"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />

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
                  <span className="font-bold">
                    {totalPrice.toLocaleString()}
                  </span>{" "}
                  원
                </p>
              </div>

              <hr className="my-2" />

              <p className="text-[20px] text-right">
                {totalPrice.toLocaleString()}
                <span className="font-normal text-[16px]"> 원</span>
              </p>

              <button
                onClick={handleCheckout}
                type="button"
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                구매하기
              </button>
            </div>
          </div>
        ))}

      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="선택한 상품을 삭제하시겠습니까?"
        description={`* 선택한 상품이 장바구니에서 삭제됩니다. \n (상품페이지에서 다시 상품을 다시 추가할 수 있습니다.)`}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModal(false)}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            취소
          </button>
          <button
            onClick={handleDelSelectCart}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            삭제
          </button>
        </div>
      </Modal>
    </div>
  );
}
