import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyCartPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?redirect=/myCart");
  }

  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:product_id ( id, name, price, image_url )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="p-5 text-red-500">
        장바구니 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  // ✅ 총 수량과 총 금액 계산
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => (
              <Link href={`/products/${item.product?.id}`} key={item.id}>
                <li className="flex items-center justify-between border p-3 rounded hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                    )}

                    <div>
                      <p className="font-semibold">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        수량: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="font-bold">
                    ₩{(item.product?.price ?? 0).toLocaleString()}
                  </div>
                </li>
              </Link>
            ))}
          </ul>

          {/* ✅ 총합 영역 */}
          <div className="border-t pt-4 text-right space-y-1">
            <p className="text-sm text-gray-600">총 수량: {totalQuantity}개</p>
            <p className="text-lg font-bold">
              총 금액: ₩{totalPrice.toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
