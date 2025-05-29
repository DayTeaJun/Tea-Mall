import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import ProductDelBtn from "./_components/ProductDelBtn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartBtn from "./_components/CartBtn";
import ProductImageSection from "./_components/ProductImageSection";
import ShareButton from "@/components/common/buttons/ShareBtn";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("deleted", false)
    .single();
  if (!product || error) return notFound();

  const { data: detailImages } = await supabase
    .from("product_images")
    .select("image_url, sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner =
    user?.id === product.user_id || user?.user_metadata?.role === "admin";

  const formattedPrice = product.price.toLocaleString();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {product.image_url && detailImages && (
          <ProductImageSection
            mainImage={product.image_url}
            detailImages={detailImages ?? []}
          />
        )}

        <div className="flex flex-col justify-between w-full">
          <div>
            <p className="text-sm text-gray-500 mb-1">티몰 공식 판매처</p>
            <div className=" mb-2 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <ShareButton />
            </div>

            <hr className="my-2" />

            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-green-700">
                {formattedPrice}원
              </div>

              <p className="text-sm text-gray-500">
                배송비 3,000원 (20,000원 이상 구매 시 무료)
              </p>

              <p className="text-sm text-gray-500">재고 있음</p>
            </div>

            <hr className="my-2" />

            <p className="text-gray-700 mb-4 whitespace-pre-line overflow-hidden text-ellipsis line-clamp-5">
              {product.description}
            </p>
          </div>
          <hr className="my-4" />

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {product && <CartBtn product={product} />}
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                바로 구매
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mt-5 flex gap-2 justify-end">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="outline" className="cursor-pointer">
              수정하기
            </Button>
          </Link>
          <ProductDelBtn
            productUserId={product.user_id}
            productId={product.id}
            imageUrl={product.image_url || ""}
            isOwner={isOwner}
          />
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">추천 상품</h2>
      </div>
    </main>
  );
}
