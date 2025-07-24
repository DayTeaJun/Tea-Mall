"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, XCircle } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabaseClient();

  const [error, setError] = useState("");

  useEffect(() => {
    const processOrder = async () => {
      const orderId = searchParams.get("orderId");
      const paymentKey = searchParams.get("paymentKey");
      const amount = Number(searchParams.get("amount"));

      if (!orderId || !paymentKey || isNaN(amount)) {
        setError("결제 정보가 유효하지 않습니다.");
        toast.error("결제 정보가 유효하지 않습니다.");
        return;
      }

      const request = sessionStorage.getItem("request") ?? "";
      const receiver = sessionStorage.getItem("receiver") ?? "";
      const detailAddress = sessionStorage.getItem("detailAddress") ?? "";

      try {
        const confirmRes = await fetch("/api/toss/confirm", {
          method: "POST",
          body: JSON.stringify({ orderId, paymentKey, amount }),
          headers: { "Content-Type": "application/json" },
        });

        if (!confirmRes.ok) {
          const result = await confirmRes.json();
          console.error("❌ Toss 인증 실패:", result);
          setError(`결제 인증 실패: ${result.message}`);
          toast.error(`결제 인증 실패: ${result.message}`);
          return;
        }
      } catch (e) {
        console.error("❌ Toss 인증 요청 실패", e);
        setError("결제 인증 요청 중 오류가 발생했습니다.");
        toast.error("결제 인증 요청 중 오류가 발생했습니다.");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ 사용자 인증 실패", userError);
        setError("사용자 인증 실패");
        toast.error("사용자 인증 실패하였습니다.");
        return;
      }

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
        console.error("❌ 주문 저장 실패", orderError);
        setError("주문 저장 실패");
        toast.error("주문 저장에 실패하였습니다.");
        return;
      }

      const order_id = orderInsert.id;

      const items = JSON.parse(sessionStorage.getItem("checkoutItems") ?? "[]");

      if (!Array.isArray(items) || items.length === 0) {
        setError("상품 정보가 비어 있습니다.");
        toast.error("상품 정보가 비어 있습니다.");
        return;
      }

      const mergedItems = items.reduce((acc: any[], item: any) => {
        const existing = acc.find((i) => i.product.id === item.product.id);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);

      const orderItems = mergedItems.map((item) => ({
        order_id,
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.options?.size ?? "",
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemError) {
        console.error("❌ 주문 상품 저장 실패", itemError);
        setError("상품 정보 저장 실패");
        toast.error("상품 정보 저장에 실패하였습니다.");
        return;
      }

      const checkoutItems = JSON.parse(
        sessionStorage.getItem("checkoutItems") ?? "[]",
      );

      for (const item of checkoutItems) {
        const { error: deleteError } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", item.product.id)
          .contains("options", { size: item.options?.size });

        if (deleteError) {
          console.error("장바구니 삭제 실패:", deleteError.message);
          toast.error(
            "장바구니 삭제에 실패하였습니다. 관리자에게 문의해주세요.",
          );
        }
      }

      router.refresh();

      window.location.href = `/mypage/myCart/checkout/successDone?orderId=${order_id}`;
      sessionStorage.removeItem("checkoutItems");
      sessionStorage.removeItem("request");
      sessionStorage.removeItem("receiver");
      sessionStorage.removeItem("detailAddress");
      toast.success("주문이 완료되었습니다.");
    };

    processOrder();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-red-600">
        <XCircle size={48} className="mb-4" />
        <p className="text-lg font-semibold">주문 처리 오류</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-[60vh] text-gray-700">
      <LoaderCircle size={48} className="animate-spin mb-4 text-blue-500" />
      <p className="text-lg font-semibold">결제가 완료되었습니다.</p>
      <p className="text-sm mt-2 text-gray-500">주문을 저장 중입니다...</p>
    </div>
  );
}
