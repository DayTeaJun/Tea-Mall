"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessDonePage() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] text-gray-700">
      <CheckCircle2 size={64} className="text-green-500 mb-4" />
      <p className="text-xl font-bold">주문이 성공적으로 완료되었습니다!</p>
      <p className="text-sm mt-2 text-gray-500">
        결제 및 주문 내역을 확인하실 수 있습니다.
      </p>

      <Link
        href="/mypage/orderList"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        주문 내역 보기
      </Link>
    </div>
  );
}
