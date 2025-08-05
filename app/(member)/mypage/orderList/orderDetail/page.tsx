"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  LoaderCircle,
  UserRound,
  StickyNote,
  Package,
  PackageX,
} from "lucide-react";
import CartBtn from "@/components/common/buttons/CartBtn";
import { Dropdown } from "@/components/common/Dropdown";
import { useDeleteOrderMutation, useGetOrderDetails } from "@/lib/queries/auth";
import { OrderItemType } from "@/types/product";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function OrderListPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: order, isLoading } = useGetOrderDetails(orderId || "");
  const { mutate: delOrderItemMutate } = useDeleteOrderMutation(
    orderId || "",
    user?.id || "",
  );

  const [isModal, setIsModal] = useState(false);

  const statusColors: Record<string, string> = {
    결제완료: "text-gray-700",
    배송준비중: "text-blue-700",
    배송중: "text-yellow-700",
    배송완료: "text-green-700",
    취소됨: "text-red-700",
  };

  if (!orderId) {
    toast.error("잘못된 접근입니다.");
    router.push("/");
    return;
  }

  const handleDelOrderItem = () => {
    if (!orderId || !user?.id) {
      toast.error("주문 정보를 찾을 수 없습니다.");
      return;
    }

    delOrderItemMutate();
    setIsModal(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">주문 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <PackageX size={48} className="mb-4" />
        <p className="text-sm">삭제된 주문이거나 존재하지 않는 주문입니다.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => router.replace("/mypage/orderList")}
        >
          주문 목록으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">주문 상세</h1>
        <Dropdown>
          <li className="hover:text-gray-800 w-full">
            <button
              onClick={() => {
                setIsModal(true);
              }}
              className="px-3 py-2 text-start w-full tracking-wide"
            >
              주문내역 삭제
            </button>
          </li>
        </Dropdown>
      </div>
      <p className="text-sm text-gray-500">
        <span className="font-bold">주문일 : </span>
        {new Date(order.created_at!).toLocaleString()}
      </p>

      <p className="text-sm text-gray-500 -mt-4">
        <span className="font-bold">주문번호 : </span>
        {order.id}
      </p>

      <ul className="flex flex-col gap-1 border-t border-b">
        {order.order_items.map((item, i) => (
          <li
            key={i}
            className={`p-4 flex flex-col gap-4 bg-white ${
              order.order_items.length - i !== 1 ? "border-b" : ""
            }`}
          >
            <div className="flex justify-between items-center gap-4">
              <div
                className="flex gap-4 cursor-pointer flex-1 justify-between"
                onClick={() => router.push(`/products/${item.products.id}`)}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.products.image_url ?? ""}
                    alt={item.products.name}
                    width={80}
                    height={80}
                    className="rounded border object-cover w-20 h-20"
                  />
                  <div className="flex flex-col gap-1 justify-center">
                    <p className="text-sm font-medium flex gap-1 items-center">
                      {item.products.name}
                      <span
                        className={`text-xs font-bold rounded-full w-fit ${
                          statusColors[item.delivery_status ?? "결제완료"]
                        }`}
                      >
                        · {item.delivery_status ?? "결제완료"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.price.toLocaleString()}원 · {item.quantity}개 ·
                      사이즈: {item.size}
                    </p>
                  </div>
                </div>

                <CartBtn
                  className="w-30 h-fit border my-auto rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                  productId={item.products.id}
                  quantity={1}
                  selectedSize={item.size || ""}
                />
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0 border-l pl-4">
                <button
                  type="button"
                  onClick={() => toast.info("교환, 반품 신청은 준비중 입니다.")}
                  className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  교환, 반품 신청
                </button>
                <button
                  className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() =>
                    router.push(`/productReview/${item.products.id}`)
                  }
                >
                  리뷰 작성하기
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border rounded p-4 mb-2 bg-gray-50 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <UserRound size={16} />
          <span className="font-bold">
            수령인 :{" "}
            <span className="font-normal">{order.receiver || "정보 없음"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Package size={16} />
          <span className="font-bold">
            배송지 :{" "}
            <span className="font-normal">
              {order.detail_address || "정보 없음"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <StickyNote size={16} />
          <span className="font-bold">
            배송 요청사항 :{" "}
            <span className="font-normal">{order.request || "없음"}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <span className="text-[16px]">총 주문 금액 : </span>
        <span className="text-[20px] font-bold ">
          {order.order_items
            .reduce(
              (total: number, item: OrderItemType) =>
                total + item.price * item.quantity,
              0,
            )
            .toLocaleString()}
          원
        </span>
      </div>

      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="주문내역을 삭제하시겠습니까?"
        description={`(* 해당 주문은 목록에서 숨겨지며, 삭제 후 2개월간 복구할 수 있습니다.)`}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModal(false)}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            취소
          </button>
          <button
            onClick={handleDelOrderItem}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            삭제
          </button>
        </div>
      </Modal>
    </div>
  );
}
