"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import { CheckoutItem } from "@/types/product";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const processOrder = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const paymentKey = searchParams.get("paymentKey");
        const amount = Number(searchParams.get("amount"));

        if (!orderId || !paymentKey || isNaN(amount)) {
          throw new Error("결제 정보가 유효하지 않습니다.");
        }

        const request = sessionStorage.getItem("request") ?? "";
        const receiver = sessionStorage.getItem("receiver") ?? "";
        const detailAddress = sessionStorage.getItem("detailAddress") ?? "";
        const userCouponId = sessionStorage.getItem("couponId");

        // 1. 유저 정보 확인
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("사용자 인증에 실패하였습니다.");
        }

        // 2. 토스 결제 승인 요청
        const confirmRes = await fetch("/api/toss/confirm", {
          method: "POST",
          body: JSON.stringify({ orderId, paymentKey, amount }),
          headers: { "Content-Type": "application/json" },
        });

        if (!confirmRes.ok) {
          const result = await confirmRes.json();
          throw new Error(`결제 인증 실패: ${result.message}`);
        }

        // 3. 주문(Orders) 테이블 저장
        const { data: orderInsert, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            request,
            receiver,
            detail_address: detailAddress,
          })
          .select("id")
          .single();

        if (orderError || !orderInsert) {
          throw new Error("주문 저장에 실패하였습니다.");
        }

        const order_id = orderInsert.id;

        // 4. 쿠폰 사용 처리 (쿠폰을 썼을 경우에만)
        if (userCouponId && userCouponId !== "") {
          const { error: couponUpdateError } = await supabase
            .from("user_coupons")
            .update({
              is_used: true,
              used_at: new Date().toISOString(),
            })
            .eq("id", userCouponId)
            .eq("user_id", user.id);

          if (couponUpdateError) {
            throw new Error("쿠폰 사용 처리에 실패했습니다.");
          }
        }

        // 5. 주문 상품(Order Items) 저장
        const items = JSON.parse(
          sessionStorage.getItem("checkoutItems") ?? "[]",
        );
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error("상품 정보가 비어 있습니다.");
        }

        function mergeItems(items: CheckoutItem[]): CheckoutItem[] {
          const map = new Map<string, CheckoutItem>();
          for (const item of items) {
            const size = item.options?.size ?? null;
            const key = `${item.product.id}::${size ?? "null"}`;
            const existed = map.get(key);
            if (existed) {
              map.set(key, {
                ...existed,
                quantity: existed.quantity + item.quantity,
              });
            } else {
              map.set(key, { ...item });
            }
          }
          return Array.from(map.values());
        }

        const mergedItems = mergeItems(items as CheckoutItem[]);
        const orderItems = mergedItems.map((item) => {
          const price = item.product?.price;
          if (typeof price !== "number") {
            throw new Error("상품 가격이 유효하지 않습니다.");
          }
          return {
            order_id,
            product_id: item.product.id,
            quantity: item.quantity,
            size: item.options?.size ?? null,
            price,
          };
        });

        const { error: itemError } = await supabase
          .from("order_items")
          .insert(orderItems);
        if (itemError) {
          throw new Error("상품 정보 저장에 실패하였습니다.");
        }

        // 6. 장바구니 비우기
        for (const item of items) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", item.product.id)
            .contains("options", { size: item.options?.size });
        }

        // 7. 재고 차감
        const productStockMap = new Map<
          string,
          { size: string | null; quantity: number }[]
        >();
        for (const item of orderItems) {
          const group = productStockMap.get(item.product_id) ?? [];
          group.push({ size: item.size, quantity: item.quantity });
          productStockMap.set(item.product_id, group);
        }

        for (const [productId, sizeItems] of productStockMap.entries()) {
          const { data: productData } = await supabase
            .from("products")
            .select("stock_by_size")
            .eq("id", productId)
            .single();

          if (!productData?.stock_by_size) continue;

          const stockMap = {
            ...(productData.stock_by_size as Record<string, number>),
          };
          for (const { size, quantity } of sizeItems) {
            if (size && typeof stockMap[size] === "number") {
              stockMap[size] = Math.max(0, stockMap[size] - quantity);
            }
          }

          await supabase
            .from("products")
            .update({
              stock_by_size: stockMap,
              total_stock: Object.values(stockMap).reduce(
                (sum, qty) => sum + qty,
                0,
              ),
            })
            .eq("id", productId);
        }

        // 8. 성공 마무리 및 세션 정리
        router.refresh();
        sessionStorage.removeItem("checkoutItems");
        sessionStorage.removeItem("request");
        sessionStorage.removeItem("receiver");
        sessionStorage.removeItem("detailAddress");
        sessionStorage.removeItem("couponId");

        toast.success("주문이 완료되었습니다.");
        window.location.href = `/mypage/myCart/checkout/successDone?orderId=${order_id}`;
      } catch (err) {
        console.error("주문 처리 중 오류 발생:", err);

        toast.error("주문 처리 중 오류가 발생했습니다. 장바구니로 이동합니다.");

        setTimeout(() => router.replace("/mypage/myCart"), 2500);
      }
    };

    processOrder();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-[60vh] text-gray-700">
      <LoaderCircle size={48} className="animate-spin mb-4 text-blue-500" />
      <p className="text-lg font-semibold">결제가 완료되었습니다.</p>
      <p className="text-sm mt-2 text-gray-500">주문을 저장 중입니다...</p>
    </div>
  );
}
