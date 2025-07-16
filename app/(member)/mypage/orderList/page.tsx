import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { notFound } from "next/navigation";
import OrderList from "../_components/OrderList";

export default async function OrderListPage() {
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

  return <OrderList orders={orders} />;
}
