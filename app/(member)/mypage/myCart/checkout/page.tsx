"use client";

import { useSearchParams } from "next/navigation";
import { useProductAllCart } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useMemo, useState } from "react";

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const itemIds = searchParams.getAll("itemIds");

  const { data: cartItems, isLoading } = useProductAllCart(user?.id ?? "");

  const selectedCartItems = useMemo(() => {
    return cartItems?.filter((item) => itemIds.includes(item.id)) ?? [];
  }, [cartItems, itemIds]);

  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  const [orderer, setOrderer] = useState(user?.user_name ?? "");
  const [receiver, setReceiver] = useState(user?.user_name ?? "");
  const [address, setAddress] = useState("");
  const [request, setRequest] = useState("");

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">주문 / 결제</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section className="border rounded p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">배송지</h2>
              <button className="text-sm underline text-gray-500">
                배송지 변경
              </button>
            </div>
            <p className="text-sm text-gray-700">{address}</p>
            <p className="text-sm text-gray-700">휴대폰: 010-0000-0000</p>
          </section>

          <hr className="border border-gray-300" />

          <section className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-lg mb-2">주문자</h2>
              <input
                type="text"
                value={orderer}
                onChange={(e) => setOrderer(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="주문자 이름 입력"
              />
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">수령인</h2>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="수령인 이름 입력"
              />
            </div>
          </section>

          <hr className="border border-gray-300" />

          <section className="">
            <h2 className="font-bold text-lg mb-2">배송 요청사항</h2>
            <input
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="요청사항 입력"
            />
          </section>
        </div>

        <div className="border p-6 bg-white h-fit">
          <h2 className="text-lg font-bold mb-4">최종 결제 금액</h2>

          <div className="flex justify-between mb-2 text-sm">
            <span>총 상품 가격</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>

          <hr className="my-4" />

          <div className="flex flex-col text-sm font-bold mb-6">
            <span>총 결제 금액</span>
            <p className="ml-auto text-xl">
              {totalPrice.toLocaleString()} <span className="text-sm">원</span>
            </p>
          </div>

          <p className="text-[10px] text-gray-400 mb-2">
            토스 페이먼츠를 이용한 테스트 결제입니다. 실제 결제되지 않으며 결제
            테스트가 가능합니다.
          </p>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
