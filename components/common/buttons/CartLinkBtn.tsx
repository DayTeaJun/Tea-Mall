import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import CartLinkBtnClient from "./CartLinkBtnClient";

export default async function CartLinkBtn() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  if (user) {
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!error && typeof count === "number") {
      cartCount = count;
    }
  }

  return <CartLinkBtnClient cartCount={cartCount} isLoggedIn={!!user} />;
}
