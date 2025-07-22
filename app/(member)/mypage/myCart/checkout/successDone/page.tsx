"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import Image from "next/image";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

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
          `id, created_at, order_items (
            quantity,
            price,
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
        <p className="text-sm">장바구니 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col">
      <h1 className="text-xl font-bold mb-4 mx-auto">주문 완료</h1>
      <p className="text-sm text-gray-500 mb-6">
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
            <div>
              <p className="font-semibold">{item.products?.name}</p>
              <p className="text-sm text-gray-500">
                {item.price.toLocaleString()}원 · {item.quantity}개
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 justify-between items-center pt-4">
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
