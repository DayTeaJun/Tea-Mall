"use client";

import { useGetMyAvailableCoupons } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { calculateDday, formatWithoutYear } from "@/lib/utils";

export default function AvailableCoupons() {
  const { user } = useAuthStore();

  const { data: coupons, isLoading } = useGetMyAvailableCoupons(user?.id || "");

  if (isLoading) {
    return (
      <p className="text-gray-400 text-center py-10">쿠폰을 불러오는 중...</p>
    );
  }

  if (coupons && coupons.length === 0) {
    return (
      <p className="text-gray-400 text-center py-10">
        사용 가능한 쿠폰이 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {coupons?.map((item) => {
        const coupon = item.coupon;
        if (!coupon) return null;

        const dDayText = calculateDday(coupon.expires_at);

        return (
          <div
            key={item.id}
            className="border border-gray-200 p-2 py-8 sm:p-6 sm:py-8 flex items-center justify-between bg-gray-50 opacity-80 shadow-sm relative overflow-hidden"
          >
            <div className="w-[38%] text-center border-r border-dashed border-gray-300 pr-4">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900">
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}%`
                  : `${coupon.discount_value.toLocaleString()}`}
              </span>
            </div>

            <div className="w-[62%] pl-4 flex flex-col items-start gap-1.5 relative">
              <div className="relative mb-1">
                <span className="absolute -top-5 left-1 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm after:content-[''] after:absolute after:top-full after:left-2 after:border-4 after:border-transparent after:border-t-pink-500">
                  {dDayText}
                </span>

                <p className="text-[11px] px-2 py-1 bg-black text-white w-fit font-medium">
                  {formatWithoutYear(coupon.created_at)}
                  {" ~ "}
                  {formatWithoutYear(coupon.expires_at)}
                </p>
              </div>

              <h3 className="font-bold text-12 sm:text-base text-gray-900">
                {coupon.name}
              </h3>

              <p className="text-xs text-gray-500">
                최소주문{" "}
                {coupon.min_order_price
                  ? coupon.min_order_price.toLocaleString() + "원 이상"
                  : "없음"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
