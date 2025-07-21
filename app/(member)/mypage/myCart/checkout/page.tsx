"use client";

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductAllCart } from "@/lib/queries/products";
import { useAuthStore } from "@/lib/store/useAuthStore";
import DaumPostcode from "../../../../../components/common/AddressSearch";
import Modal from "@/components/common/Modal";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
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
  const [address, setAddress] = useState(user?.address ?? "");
  const [request, setRequest] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDetailAddressOpen, setIsDetailAddressOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && selectedCartItems.length === 0) {
      router.replace("/not-found");
    }
  }, [isLoading, selectedCartItems, router]);

  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({
        customerKey: user?.id ?? ANONYMOUS,
      });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: totalPrice,
        },
        orderId: `order-${Date.now()}`,
        orderName: `${selectedCartItems[0]?.product?.name ?? "상품"} 외 ${
          selectedCartItems.length - 1
        }건`,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerName: orderer,
        customerEmail: user?.email ?? "",
        customerMobilePhone:
          (user?.phone ?? "").replace(/-/g, "") ?? "01000000000",
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (err) {
      console.error("결제 실패:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">장바구니 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">주문 / 결제</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-8 col-span-2">
          <section className="border rounded">
            <div className="flex justify-between items-center mb-2 bg-gray-50 p-4">
              <h2 className="font-bold text-lg">배송지</h2>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="text-sm underline text-gray-500"
              >
                배송지 변경
              </button>
            </div>
            <div className="bg-white p-4 flex flex-col gap-2">
              <p className="text-sm text-gray-700">
                {address || user?.address}
              </p>
              {isDetailAddressOpen && (
                <input
                  type="text"
                  placeholder="상세 주소 (선택)"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="border-b py-1 text-sm"
                />
              )}
              <p className="text-sm text-gray-700">휴대폰: {user?.phone}</p>
            </div>
          </section>

          <p className="text-sm -mb-6">
            <span className="font-bold">{selectedCartItems.length} </span>개
            품목
          </p>
          <ul className="flex flex-col gap-2">
            {selectedCartItems.map((item) => (
              <li key={item.id} className="flex gap-4 border rounded p-4">
                <Image
                  src={item.product?.image_url ?? "/default-product.jpg"}
                  alt={item.product?.name ?? "상품 이미지"}
                  width={80}
                  height={80}
                  className="rounded border object-cover w-20 h-20"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{item.product?.name}</p>
                  {item.options && (
                    <p className="text-sm text-gray-500">
                      {Object.entries(item.options)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" / ")}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    수량: {item.quantity}개 · 가격: ₩
                    {(item.product?.price ?? 0).toLocaleString()} · 총 가격 :{" "}
                    {(item.product?.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>

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
                placeholder="수령인 이름 입력 (선택)"
              />
            </div>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">배송 요청사항</h2>
            <input
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="요청사항 입력 (선택)"
            />
          </section>

          <section>
            <h2 className="font-bold text-lg mb-4">
              결제수단{" "}
              <span className="text-[11px] text-gray-400">
                (* 토스페이먼츠 테스트 결제입니다)
              </span>
            </h2>
            <div className="text-sm text-gray-600">카드 결제 (테스트용)</div>
          </section>
        </div>

        <div className="border p-6 bg-white h-fit">
          <h2 className="text-lg font-bold mb-4">최종 결제 금액</h2>
          <div className="flex justify-between mb-2 text-sm">
            <span>총 상품 가격</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="h-[1px] bg-gray-300 my-4" />
          <div className="flex flex-col text-sm font-bold mb-6">
            <span>총 결제 금액</span>
            <p className="ml-auto text-xl">
              {totalPrice.toLocaleString()} <span className="text-sm">원</span>
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mb-2">
            실제 결제는 이루어지지 않습니다. 테스트 환경입니다.
          </p>
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            결제하기
          </button>
        </div>
      </div>

      <Modal
        title="배송지 변경"
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        className="rounded-none"
      >
        <DaumPostcode
          onComplete={(data) => {
            setAddress(data.address);
            setIsAddressModalOpen(false);
            setIsDetailAddressOpen(true);
          }}
        />
      </Modal>
    </div>
  );
}
