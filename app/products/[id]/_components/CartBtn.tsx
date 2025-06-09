"use client";

import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartBtn({
  productId,
  quantity,
}: {
  productId: string;
  quantity?: number;
}) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const handleAddToCart = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      toast.error("장바구니 조회 중 오류가 발생했습니다.");
      return;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (updateError) {
        toast.error("장바구니 수량 업데이트에 실패했습니다.");
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity: quantity,
      });

      if (insertError) {
        toast.error("장바구니 추가에 실패했습니다.");
        return;
      }
    }

    toast.success("장바구니에 추가되었습니다.");

    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button
        className="flex-1 text-green-600 hover:text-green-900 border-2 border-green-600 hover:border-green-900 cursor-pointer p-2 duration-300 transition-colors"
        onClick={handleAddToCart}
      >
        장바구니 추가
      </button>
    </div>
  );
}
