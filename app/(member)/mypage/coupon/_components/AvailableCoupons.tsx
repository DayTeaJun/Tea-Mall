"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import React, { useEffect, useState } from "react";

interface UserCoupon {
  id: string;
  is_used: boolean;
  coupon: {
    id: string;
    name: string;
    discount_type: string;
    discount_value: number;
    min_order_price: number | null;
    max_discount_price: number | null;
    expires_at: string;
  };
}

export default function AvailableCoupons() {
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  const fetchMyAvailableCoupons = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_coupons")
      .select(
        `
        id,
        is_used,
        coupon:coupons (
          id,
          name,
          discount_type,
          discount_value,
          min_order_price,
          max_discount_price,
          expires_at
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("is_used", false);

    if (!error && data) {
      setCoupons(data as unknown as UserCoupon[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyAvailableCoupons();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-400 text-center py-10">쿠폰을 불러오는 중...</p>
    );
  }

  if (coupons.length === 0) {
    return (
      <p className="text-gray-400 text-center py-10">
        사용 가능한 쿠폰이 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {coupons.map((item) => {
        const coupon = item.coupon;

        if (!coupon) return null;

        return (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm bg-white"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-green-600 font-bold">
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}% 할인`
                  : `${coupon.discount_value.toLocaleString()}원 할인`}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-gray-800">
                {coupon.name}
              </h3>
              <p className="text-xs text-gray-500">
                최소주문:{" "}
                {coupon.min_order_price
                  ? coupon.min_order_price.toLocaleString() + "원"
                  : "없음"}
              </p>
              <p className="text-xs text-gray-400">
                기한: {new Date(coupon.expires_at).toLocaleDateString()} 까지
              </p>
            </div>
            <div className="bg-green-100 text-green-700 text-xs sm:text-sm px-4 py-2 rounded font-medium">
              사용 가능
            </div>
          </div>
        );
      })}
    </div>
  );
}
