"use client";

import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { usePostDownloadCouponMutation } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function CouponDownload() {
  const { user } = useAuthStore();

  const [isModal, setIsModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const { mutateAsync } = usePostDownloadCouponMutation(user?.id || "");

  const handleRegister = async () => {
    if (!couponCode.trim()) {
      toast.error("쿠폰 코드를 입력해주세요.");
      return;
    }

    await mutateAsync(couponCode.trim().toUpperCase());

    setIsModal(false);
    setCouponCode("");
  };

  return (
    <>
      <button
        onClick={() => setIsModal(true)}
        className="flex items-center gap-1.5 border-2 p-1.5 px-2 border-green-400 text-sm hover:bg-green-100 transition-colors rounded"
        type="button"
      >
        <Plus size={18} />
        쿠폰등록
      </button>

      {isModal && (
        <div
          onClick={() => setIsModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden flex flex-col p-6 relative"
          >
            <button
              onClick={() => setIsModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              쿠폰 등록
            </h2>

            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="쿠폰코드를 입력해주세요"
              className="w-full bg-gray-100 border border-transparent focus:border-green-500 focus:bg-white transition-all rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 outline-none mb-4"
            />

            <button
              onClick={handleRegister}
              disabled={!couponCode.trim()}
              className={`w-full ${couponCode.trim() ? "bg-green-500 hover:bg-green-600" : "bg-gray-200"} text-white font-medium py-3 rounded-lg transition-colors mb-6 text-sm`}
            >
              등록하기
            </button>

            <ul className="text-xs text-gray-400 space-y-1.5 leading-relaxed list-disc list-inside">
              <li>유효기간이 지난 쿠폰은 등록이 불가합니다.</li>
              <li>
                쿠폰 등록 내역은 &apos;쿠폰함&apos;에서 확인할 수 있습니다.
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
