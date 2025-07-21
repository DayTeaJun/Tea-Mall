"use client";

import { LoaderCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] text-gray-700">
      <LoaderCircle size={48} className="animate-spin mb-4 text-blue-500" />
      <p className="text-lg font-semibold">결제가 완료되었습니다.</p>
      <p className="text-sm mt-2 text-gray-500">주문을 저장하고 있습니다...</p>
    </div>
  );
}
