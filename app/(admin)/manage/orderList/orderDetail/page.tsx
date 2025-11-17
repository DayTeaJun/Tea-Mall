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
import { Dropdown } from "@/components/common/Dropdown";
import { useDeleteOrderMutation, useGetOrderDetails } from "@/lib/queries/auth";
import { OrderItemType } from "@/types/product";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { updateDeliveryStatus } from "@/lib/actions/admin";
import { queryClient } from "@/components/providers/ReactQueryProvider";

export default function OrderListPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: order, isLoading } = useGetOrderDetails(orderId || "");
  const { mutate: delOrderItemMutate } = useDeleteOrderMutation(
    orderId || "",
    user?.id || "",
    true,
  );

  const [isModal, setIsModal] = useState(false);

  const statusOptions = [
    "결제완료",
    "배송준비중",
    "배송중",
    "배송완료",
    "취소됨",
  ];

  const handleStatusChange = async (orderItemId: string, status: string) => {
    try {
      await updateDeliveryStatus(orderItemId, status);
      toast.success("배송 상태가 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["orderDetails"] });
    } catch (err) {
      toast.error("배송 상태 변경 실패");
      console.error(err);
    }
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
      <div className="flex justify-between items-center -mb-2">
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
      <p className="text-14 text-gray-500">
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
            key={item.id}
            className={`flex items-stretch py-4 gap-3 sm:p-4 ${
              order.order_items.length - i !== 1 ? "border-b" : ""
            }`}
          >
            <Image
              src={item.products.image_url ?? ""}
              alt={item.products.name}
              width={80}
              height={80}
              className="rounded border object-cover w-20 h-20"
            />
            <div className="flex flex-col sm:justify-center justify-start">
              <p className="font-medium">{item.products.name}</p>
              <p className="text-sm text-gray-500">
                {item.price.toLocaleString()}원 · {item.quantity}개 · 사이즈:{" "}
                {item.size}
              </p>

              <select
                value={item.delivery_status ?? "결제완료"}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                className="border p-1 rounded text-sm sm:hidden mt-auto block"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-col justify-center border-l pl-4 self-stretch hidden sm:flex ml-auto">
              <select
                value={item.delivery_status ?? "결제완료"}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>

      <div className="border rounded p-2 sm:p-4 mb-2 text-[12px] sm:text-sm bg-gray-50 space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <UserRound size={16} />
          <span className="font-bold">
            수령인 :{" "}
            <span className="font-normal">{order.receiver || "정보 없음"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Package size={16} />
          <span className="font-bold">
            배송지 :{" "}
            <span className="font-normal">
              {order.detail_address || "정보 없음"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
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
