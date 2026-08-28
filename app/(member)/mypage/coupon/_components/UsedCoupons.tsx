"use client";

import { useGetMyUsedCoupons } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function UsedCoupons() {
  const { user } = useAuthStore();

  const { data: coupons, isLoading } = useGetMyUsedCoupons(user?.id || "");

  if (isLoading) {
    return (
      <p className="text-gray-400 text-center py-10">쿠폰을 불러오는 중...</p>
    );
  }

  if (coupons && coupons.length === 0) {
    return (
      <p className="text-gray-400 text-center py-10">사용한 쿠폰이 없습니다.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {coupons?.map((item) => {
        const coupon = item.coupon;
        if (!coupon) return null;

        return (
          <div
            key={item.id}
            className="border border-gray-200 p-6 py-8 flex items-center justify-between bg-gray-50 opacity-80 shadow-sm relative overflow-hidden"
          >
            {/* 💡 우측 상단이나 구원에 '사용완료' 워터마크 또는 라벨 느낌 추가 */}
            <div className="absolute top-0 right-0 bg-gray-400 text-white text-[10px] font-bold px-3 py-1">
              사용완료
            </div>

            <div className="w-[38%] text-center border-r border-dashed border-gray-300 pr-4">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-gray-400">
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}%`
                  : `${coupon.discount_value.toLocaleString()}`}
              </span>
            </div>

            <div className="w-[62%] pl-4 flex flex-col items-start gap-1.5 relative">
              <div className="relative mb-1">
                <p className="text-[11px] px-2 py-1 bg-gray-200 text-gray-600 w-fit font-medium">
                  {new Date(coupon.created_at).toLocaleDateString("ko-KR")}
                  {" ~ "}
                  {new Date(coupon.expires_at).toLocaleDateString("ko-KR")}
                </p>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-gray-600 line-through">
                {coupon.name}
              </h3>

              <p className="text-xs text-gray-400">
                최소주문{" "}
                {coupon.min_order_price
                  ? coupon.min_order_price.toLocaleString() + "원 이상"
                  : "없음"}
              </p>

              {item.used_at && (
                <p className="text-[11px] text-gray-400 mt-1">
                  사용일: {new Date(item.used_at).toLocaleDateString("ko-KR")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
