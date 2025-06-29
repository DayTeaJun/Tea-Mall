import React from "react";
import OrderList from "./_components/OrderList";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { notFound } from "next/navigation";

async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;

  if (!userId) return notFound();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      order_items (
        product_id,
        quantity,
        price,
        products (
          name,
          image_url
        )
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("주문 조회 실패:", error.message);
    return null;
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl mb-4 text-center">마이페이지</h1>
      <p className="text-center text-gray-500 mb-4">
        회원님의 정보를 확인하고 관리할 수 있는 페이지입니다.
      </p>
      <OrderList orders={orders} />
    </div>
  );
}

export default Page;
