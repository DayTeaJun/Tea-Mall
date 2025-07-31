"use client";

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Modal from "@/components/common/Modal";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import DaumPostcode from "@/components/common/AddressSearch";
import { useGetProductDetail } from "@/lib/queries/products";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

type SelectedItem = {
  id: string;
  quantity: number | string;
  options?: Record<string, string>;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
};

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  const productIdFromParam = searchParams.get("productId") ?? "";

  const sizeParam = searchParams.get("size") ?? "";
  const quantity = searchParams.get("quantity") ?? "1";

  const { data: product, isLoading } = useGetProductDetail(productIdFromParam);

  const selectedItem: SelectedItem | null = useMemo(() => {
    if (!product) return null;
    return {
      id: productIdFromParam,
      quantity,
      options: { size: sizeParam },
      product: {
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        image_url: product.image_url ?? null,
      },
    };
  }, [product, productIdFromParam, sizeParam, quantity]);

  const totalPrice = useMemo(() => {
    if (!selectedItem?.product) return 0;
    return (
      (selectedItem.product.price ?? 0) *
      (typeof selectedItem.quantity === "string"
        ? parseInt(selectedItem.quantity)
        : selectedItem.quantity)
    );
  }, [selectedItem]);

  const orderName = useMemo(() => {
    if (!selectedItem?.product) return "상품";
    const base = selectedItem.product.name;
    return sizeParam ? `${base} (${sizeParam})` : base;
  }, [selectedItem, sizeParam]);

  const [orderer, setOrderer] = useState(user?.user_name ?? "");
  const [receiver, setReceiver] = useState(user?.user_name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [request, setRequest] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDetailAddressOpen, setIsDetailAddressOpen] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!selectedItem?.product) {
      toast.error("주문 정보가 올바르지 않습니다.");
      return;
    }

    sessionStorage.setItem("checkoutItems", JSON.stringify([selectedItem]));
    sessionStorage.setItem("request", request);
    sessionStorage.setItem("receiver", receiver);
    sessionStorage.setItem(
      "detailAddress",
      address + (detailAddress ? `, ${detailAddress}` : ""),
    );

    const customerMobile = (user?.phone ?? "01000000000").replace(/-/g, "");

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
        orderName,
        successUrl: `${window.location.origin}/directCheckout/success`,
        failUrl: `${window.location.origin}/directCheckout/fail`,
        customerName: orderer,
        customerEmail: user?.email ?? "",
        customerMobilePhone: customerMobile,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch {
      toast.error("결제 취소되었습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading || !selectedItem?.product) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
        <LoaderCircle size={48} className="animate-spin mb-4" />
        <p className="text-sm">주문 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 ">
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
            <span className="font-bold">1 </span>개 품목
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex gap-4 border rounded p-4">
              <Image
                src={selectedItem.product?.image_url ?? "/default-product.jpg"}
                alt={selectedItem.product?.name ?? "상품 이미지"}
                width={80}
                height={80}
                className="rounded border object-cover w-20 h-20"
              />
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{selectedItem.product?.name}</p>
                <p className="text-sm text-gray-500">
                  사이즈: {sizeParam} / 수량: {selectedItem.quantity}개
                </p>
                <p className="text-sm text-gray-500">
                  가격: ₩{(selectedItem.product?.price ?? 0).toLocaleString()} ·
                  총 가격:{" "}
                  {(
                    (selectedItem.product?.price ?? 0) *
                    (typeof selectedItem.quantity === "string"
                      ? parseInt(selectedItem.quantity)
                      : selectedItem.quantity)
                  ).toLocaleString()}
                </p>
              </div>
            </li>
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
