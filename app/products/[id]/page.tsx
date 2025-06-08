import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import ProductImageSection from "./_components/ProductImageSection";
import ShareButton from "@/components/common/buttons/ShareBtn";
import ProductPurchaseSection from "./_components/ProductPurchaseSection"; // 추가

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();
  const { id } = params;

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
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <ShareButton />
            </div>

            {/* 메타정보 */}
            <div className="text-sm text-gray-600 mb-2 space-x-2">
              {product.category && <span>카테고리: {product.category}</span>}
              {product.subcategory && (
                <span>· 서브카테고리: {product.subcategory}</span>
              )}
              {product.gender && <span>· 성별: {product.gender}</span>}
              {product.color && <span>· 색상: {product.color}</span>}
            </div>

            <hr className="my-2" />

            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-green-700">
                {formattedPrice}원
              </div>

              <p className="text-sm text-gray-500">
                배송비 3,000원 (20,000원 이상 구매 시 무료)
              </p>

              <p className="text-sm text-gray-500">
                총 재고: {product.total_stock ?? "정보 없음"}개
              </p>
            </div>

            <hr className="my-2" />

            <p className="text-gray-700 mb-4 whitespace-pre-line overflow-hidden text-ellipsis line-clamp-5">
              {product.description}
            </p>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <ProductPurchaseSection
            productId={product.id}
            stockBySize={product.stock_by_size as Record<string, number>}
          />
        </div>
      </div>

      <div className="mt-10">
        {detailImages &&
          detailImages.map((image) => (
            <div key={image.sort_order} className="mb-4">
              <img
                src={image.image_url}
                alt={`Product detail ${image.sort_order}`}
                className="w-full h-auto"
              />
            </div>
          ))}
      </div>
    </main>
  );
}
