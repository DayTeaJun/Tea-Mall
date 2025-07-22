"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import Image from "next/image";

export default function CheckoutDonePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!orderId) {
      setError("주문 ID가 없습니다.");
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
        setError("주문 내역을 불러올 수 없습니다.");
      } else {
        setOrder(data);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (error) return <p>{error}</p>;
  if (!order) return <p>로딩 중...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-4">주문 완료</h1>
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
      <div className="flex justify-between items-center pt-4">
        <span className="text-[14px]">총 주문 금액</span>
        <span className="text-[18px] font-bold ">
          {order.order_items
            .reduce(
              (total: number, item: any) => total + item.price * item.quantity,
              0,
            )
            .toLocaleString()}
          원
        </span>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="px-10 py-1 rounded text-white bg-green-500 hover:bg-green-600 transition"
          onClick={() => router.push("/mypage/orderList")}
        >
          주문 내역 보기
        </button>
      </div>
    </div>
  );
}
