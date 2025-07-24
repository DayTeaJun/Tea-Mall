"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import Image from "next/image";
import { toast } from "sonner";
import {
  LoaderCircle,
  UserRound,
  StickyNote,
  Package,
  MapPin,
} from "lucide-react";

export default function CheckoutDonePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) {
      toast.error("주문 ID가 없습니다.");
      router.push("/not-found");
      return;
    }

    const fetchOrder = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id, created_at, request, receiver, detail_address,
          order_items (
            quantity,
            price,
            size,
            products (
              name,
              image_url
            )
          )`,
        )
        .eq("id", orderId)
        .single();

      if (error) {
        toast.error("주문 내역을 불러올 수 없습니다.");
        router.push("/not-found");
      } else {
        setOrder(data);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">주문 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <h1 className="text-xl font-bold mx-auto">주문 완료</h1>
      <p className="text-sm text-gray-500">
        주문일: {new Date(order.created_at).toLocaleString()}
      </p>

      <ul className="flex flex-col border p-5 gap-5">
        {order.order_items.map((item: any, idx: number) => (
          <li
            key={idx}
            className={`flex gap-4 items-center ${
              idx < order.order_items.length - 1 ? "border-b" : ""
            } pb-4`}
          >
            <Image
              width={200}
              height={200}
              src={item.products?.image_url ?? "/default.jpg"}
              alt={item.products?.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium">{item.products.name}</p>
              <p className="text-sm text-gray-500">
                {item.price.toLocaleString()}원 · {item.quantity}개 · 사이즈:{" "}
                {item.size}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="border rounded p-4 mb-6 bg-gray-50 space-y-2">
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

      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">총 주문 금액 : </span>
          <span className="text-[18px] font-bold ">
            {order.order_items
              .reduce(
                (total: number, item: any) =>
                  total + item.price * item.quantity,
                0,
              )
              .toLocaleString()}
            원
          </span>
        </div>

        <button
          className="px-6 py-1 rounded text-white bg-green-500 hover:bg-green-600 transition"
          onClick={() => router.push("/mypage/orderList")}
        >
          주문 내역 보기
        </button>
      </div>
    </div>
  );
}
